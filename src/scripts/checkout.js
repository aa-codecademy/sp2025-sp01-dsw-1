import { loadHTML } from "./utils.js";
import { initCartCount } from "./cart-utils.js";
import { init } from "./search-utils.js";
import { initSearch } from "./search.js";

document.addEventListener("DOMContentLoaded", function () {
  console.log("Checkout page loaded, loading header and footer...");
  loadHTML("../templates/header.html", "header-container");
  loadHTML("../templates/footer.html", "footer-container");
  setTimeout(() => {
    init();
    // Initialize cart count after header is loaded
    initCartCount();
    // Initialize search functionality after header is loaded
    initSearch();
  }, 200);
});
