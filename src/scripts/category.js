import { loadHTML } from "./utils.js";

loadHTML("../templates/header.html", "afterbegin");
loadHTML("../templates/footer.html", "beforeend");

async function fetchProducts() {
  const response = await fetch("../assets/products.json");
  const data = await response.json();
  return data.products;
}

function renderProducts(products) {
  const grid = document.querySelector(".product-grid");
  grid.innerHTML = "";
  products.forEach((product) => {
    let badgeHTML = "";
    if (product.discount) {
      const discountPercentage = Math.round(
        ((parseFloat(product.discount.replace(/[^0-9.-]+/g, "")) -
          parseFloat(product.price.replace(/[^0-9.-]+/g, ""))) /
          parseFloat(product.discount.replace(/[^0-9.-]+/g, ""))) *
          100
      );
      badgeHTML = `<div class="product-badge discount">${discountPercentage}%</div>`;
    } else {
      badgeHTML = `<div class="product-badge new">New</div>`;
    }
    grid.innerHTML += `
      <div class="product-card" data-product-id="${product.id}">
        ${badgeHTML}
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
          <p class="product-name">${product.name}</p>
          <p class="product-description">${product.description}</p>
          <p class="product-price">
            ${product.price}
            ${
              product.discount
                ? `<span class="product-discount">${product.discount}</span>`
                : ""
            }
          </p>
        </div>
        <button class="add-to-cart">Add to Cart</button>
        <div class="product-links">
          <a href="#" class="product-link">
            <img src="../assets/Frame 11.png" alt="Share" class="product-icon">
          </a>
          <a href="#" class="product-link">
            <img src="../assets/Frame 12.png" alt="Compare" class="product-icon">
          </a>
          <a href="#" class="product-link">
            <img src="../assets/Frame 10.png" alt="Like" class="product-icon">
          </a>
        </div>
      </div>
    `;
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const products = await fetchProducts();
  renderProducts(products);

  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", function (event) {
      if (
        event.target.closest(".add-to-cart") ||
        event.target.closest(".product-link")
      ) {
        return;
      }
      const productId = card.getAttribute("data-product-id");
      if (productId) {
        window.location.href = `product_details.html?id=${productId}`;
      }
    });
  });
});
