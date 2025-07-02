import { loadHTML } from './utils.js';
import { setupSearch } from './search-utils.js';

async function init() {
  await loadHTML("/header.html", "afterbegin");
  await loadHTML("/footer.html", "beforeend");

  const response = await fetch("/src/assets/products.json");
  const data = await response.json();
  const products = data.products;

  setupSearch(products);
}

init();