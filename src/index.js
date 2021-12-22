import * as tfjs from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import * as fp from 'fingerpose';

// DOM
import dom, { createEl } from './libs/dom';

// alertJs
import alertJs from './libs/alert';

// Styles
import './assets/scss/app.scss';

/* Variables */
const ALERT = new alertJs({ closeByClick: false });

let wrapper;

let ctx;

let video;

/* Development */
const init = () => {
	const at = ALERT.warning('Please enable webcam access :)', {
		stable: true,
	});

	getPermissions()
		.then(stream => {
			// Load wrapper
			wrapper = dom();

			// Load video
			renderVideo(stream);
		})
		.catch((message) => {
			ALERT.error(message, {
				stable: true,
			});
		})
		.finally(() => {
			at.end();
		});
}

const renderVideo = stream => {
	// Load Video webcam
	video = createEl(
		'video',
		{
			width: 640,
			height: 480
		}
	);

	const webcam = createEl('div', { class: 'webcam' }, video);
	video.srcObject = stream;
	video.muted = 1;

	// Append video to .wrapper
	wrapper.append(webcam);

	// Configuration
	video.play();
	video.addEventListener('loadeddata', loadModels);
}

const getLoading = () => {
	return createEl(
		'div',
		{
			class: 'backdrop-loading'
		},
		createEl(
			'div',
			{
				class: 'loader'
			},
			[createEl('div'), createEl('div')]
		)
	);
}

const getCanvas = () => {
	const canvas = createEl('canvas');
	ctx = canvas.getContext('2d');

	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;

	return canvas;
}

const getPermissions = () => {
	return new Promise((done, reject) => {
		try {
			if (navigator && navigator.mediaDevices) {

				navigator.mediaDevices
					.getUserMedia({
						video: true,
					})
					.then(stream => {
						done(stream);
					})
					.catch(e => {
						reject(e.message);
					})

			} else throw new Error("Your browser does not support this feature");
		} catch (e) {
			reject(e.message);
		}
	});
}

const loadModels = () => {
	// Render Loading
	video.parentElement.append(getLoading());

	// Show alert
	const at = ALERT.warning("Loading Models...", {
		stable: true,
	});

	// Load
	handpose.load()
		.then(detect)
		.catch(() => {
			ALERT.error("Sorry, an error occurred", {
				stable: true,
			});
		})
		.finally(() => {
			at.end();
		})
}

const detect = async (net) => {
	// Create canvas
	const canvas = getCanvas();

	// Detect
	const hands = await net.estimateHands(video);

	if (hands.length > 0) {
	} else {
		ALERT.error("Your hand could not be found", {
			stable: true,
		});
	}
}

document.addEventListener('DOMContentLoaded', init);