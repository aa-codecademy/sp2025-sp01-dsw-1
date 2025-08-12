import { loadHTML } from "./utils.js";
import { init } from "./search-utils.js";

document.addEventListener("DOMContentLoaded", function () {
  console.log("Login page loaded, loading header and footer...");
  loadHTML("../templates/header.html", "header-container");
  loadHTML("../templates/footer.html", "footer-container");
  setTimeout(() => {
    init();
  }, 200);
});
