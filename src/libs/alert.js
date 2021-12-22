const alertJs = class {
	#CONTAINER_ID = 'alert-area';

	#ALERT_COUNT = []; // id, message, type

	#options = {
		stable: false,
		unique: false,
		duration: 3000,
		closeByClick: true,
		animationDuration: 750,
		placement: 'bottom-center', // top-left | top-center | top-right | bottom-left | bottom-center | bottom-right
	};

	constructor(options = {}) {
		this.#rewriteOption(options);
	}

	/**
	 * ! Public Methods
	 */

	error(input, options = {}) {
		return this.#generateAlert(input, 'error', options);
	}

	warning(input, options = {}) {
		return this.#generateAlert(input, 'warning', options);
	}

	success(input, options = {}) {
		return this.#generateAlert(input, 'success', options);
	}

	/**
	 * ! Private Methods
	 */

	#generateAlert(message, type, options) {
		const id = options['id'] || message;
		const placement = this.#getOptionProperty('placement', options);

		if (options.unique === true && this.#getAlert(placement, id)) return;

		// Create container if not exists
		const container = this.#containerExists(placement);

		// Create an alert
		const animationDuration = this.#getOptionProperty('animationDuration', options);
		const a = document.createElement('div');
		a.innerText = message;
		a.style.animationDuration = `${animationDuration}ms`;
		a.style.webkitAnimationDuration = `${animationDuration}ms`;
		a.classList.add('active', 'alert-message', 'alert-' + type);
		a.setAttribute('data-id', id);

		// Append
		container.appendChild(a);

		// Create new alert object
		const currentAlert = {
			id,
			type,
			message,
			placement,
			timestamp: undefined,
			end: () => this.#alertCloseEvent(a, id, animationDuration),
			update: (options) => this.#update(a, id, options),
		};

		// Close after few seconds
		const duration = this.#getOptionProperty('duration', options);
		const stable = this.#getOptionProperty('stable', options);
		if (!stable) {
			currentAlert.timestamp = setTimeout(() => this.#alertCloseEvent(a, currentAlert, animationDuration), duration ?? 3500);
		}

		// Close by click
		const closeByClick = this.#getOptionProperty('closeByClick', options);
		if (closeByClick) {
			a.addEventListener('click', () => {
				if (currentAlert.timestamp !== undefined) clearTimeout(currentAlert.timestamp);
				this.#alertCloseEvent(a, currentAlert, animationDuration);
			});
		}

		// Add alert to alerts
		this.#ALERT_COUNT = [
			...this.#ALERT_COUNT,
			currentAlert
		];

		return currentAlert;
	}

	#alertCloseEvent(target, id, duration) {
		this.#ALERT_COUNT = this.#ALERT_COUNT.filter(alert => alert.id !== id);
		target.classList.remove('active');

		setTimeout(() => {
			target.remove();
		}, duration);
	}

	#update(target, id, options) {
		const currentAlert = this.#ALERT_COUNT.find(alert => alert.id === id);

		if ("message" in options) target.innerText = options.message;

		if ("id" in options) {
			currentAlert.id = options.id;
			target.setAttribute("data-id", options.id);
		}

		if ("stable" in options) {
			currentAlert.timestamp = undefined;
			clearTimeout(options.timestamp);
		}

		if (!options.hasOwnProperty("stable") && "duration" in options) {
			clearTimeout(options.timestamp);
			const animationDuration = this.#getOptionProperty('animationDuration', options);

			currentAlert.timestamp = setTimeout(() => this.#alertCloseEvent(target, currentAlert, animationDuration), options.duration);
		}

		this.#ALERT_COUNT = this.#ALERT_COUNT.map(alert => {
			if (alert.id === id) return currentAlert;
			return alert;
		});
	}

	#rewriteOption(no) {
		this.#checkType(no, 'object', "'options' must be an object");

		Object.keys(no).forEach(key => {
			this.#options[key] = no[key];
		});
	}

	#getContainer(placement) {
		return document.querySelector('#' + this.#CONTAINER_ID + `[data-placement="${placement}"]` + '>' + '.alert-container');
	}

	#getAlert(placement, id) {
		return document.querySelector('#' + this.#CONTAINER_ID + `[data-placement="${placement}"]` + '>' + '.alert-container' + '>' + `.alert-message[data-id="${id}"]`);
	}

	#createContainer(placement) {
		const area = document.createElement('div');
		area.setAttribute('data-placement', placement);
		area.id = this.#CONTAINER_ID;

		const container = document.createElement('div');
		container.classList.add('alert-container');

		area.append(container);
		document.body.append(area);
	}

	#containerExists(placement = 'bottom-center') {
		if (!document.body.contains(this.#getContainer(placement))) this.#createContainer(placement);

		return this.#getContainer(placement);
	}

	#getOptionProperty(propName, options) {
		return options[propName] || this.#options[propName];
	}

	#checkType(input, types = [], error) {
		if (!types.includes(typeof input)) throw new Error(error);
	}
};

export default alertJs;