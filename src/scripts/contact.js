import { loadHTML } from "./utils.js";
import { initCartCount } from "./cart-utils.js";
import { initSearch } from "./search.js";

// Load header and footer
document.addEventListener("DOMContentLoaded", function () {
  console.log("Contact page loaded, loading header and footer...");

  // Load header and footer - utils.js will automatically adjust paths
  loadHTML("../templates/header.html", "header-container");
  loadHTML("../templates/footer.html", "footer-container");
  setTimeout(() => {
    // Initialize cart count after header is loaded
    initCartCount();
    // Initialize search functionality after header is loaded
    initSearch();
  }, 200);
});

// Add form submission handling
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(contactForm);
      const name = formData.get("name");
      const email = formData.get("email");
      const subject = formData.get("subject");
      const message = formData.get("message");

      // Simple validation
      if (!name || !email || !subject || !message) {
        alert("Please fill in all required fields.");
        return;
      }

      // Here you would typically send the data to a server
      // For now, just show a success message
      alert("Thank you for your message! We'll get back to you soon.");
      contactForm.reset();
    });
  }
});
