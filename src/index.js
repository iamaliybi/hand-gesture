import * as tfjs from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";

// DOM
import dom, { createEl } from './libs/dom';

// alertJs
import alertJs from './libs/alert';

// Styles
import './assets/scss/app.scss';

/* Variables */
const ALERT = new alertJs({ closeByClick: false });

let wrapper;

/* Development */
const init = () => {
	// getPermissions
}

document.addEventListener('DOMContentLoaded', init);