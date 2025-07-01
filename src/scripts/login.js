import { loadHTML } from './utils.js';

loadHTML('../templates/header.html', 'afterbegin');
loadHTML('../templates/footer.html', 'beforeend');