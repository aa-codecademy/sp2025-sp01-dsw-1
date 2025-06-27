import { loadHTML } from './utils.js';

loadHTML("/header.html", "afterbegin");
loadHTML("/footer.html", "beforeend");
