import * as tfjs from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";

// DOM
import dom, { createEl } from './dom';

// Styles
import './assets/scss/app.scss';

/* Variables */
let wrapper;

/* Development */
const init = () => {
	wrapper = dom();
	load();
}

document.addEventListener('DOMContentLoaded', init);