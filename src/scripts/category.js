// import { loadHTML } from "./utils.js";
import { showNotification } from './notification.js';
import { addToCart, updateCartCountIcon, getCart } from './cart-utils.js';
import { init } from './search-utils.js'; 
init();

function attachAddToCartListeners(products, gridElement) {
  gridElement.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", function (event) {
      event.stopPropagation();
      const card = btn.closest(".product-card");
      const productId = Number(card.getAttribute("data-product-id"));
      const product = products.find(p => p.id === productId);
      if (product) {
        const cart = getCart();
        const cartItem = cart.find(item => item.id === product.id);
        const currentQty = cartItem ? cartItem.quantity : 0;

        if (product.stock === 0) {
          showNotification
            ? showNotification("Sorry, this product is out of stock.")
            : alert("Sorry, this product is out of stock.");
          return;
        }

        if (currentQty + 1 > product.stock) {
          showNotification
            ? showNotification(`Sorry, only ${product.stock} items available.`)
            : alert(`Sorry, only ${product.stock} items available.`);
          return;
        }

        addToCart(product, 1);
        showNotification
          ? showNotification(`${product.name} added to cart!`)
          : alert(`${product.name} added to cart!`);
        updateCartCountIcon && updateCartCountIcon();
      }
    });
  });
}

// loadHTML("/header.html", "afterbegin");
// loadHTML("/footer.html", "beforeend");

const productGrid = document.querySelector(".product-grid");
const paginationContainer = document.getElementById("pagination");

const livingRoomBtn = document.getElementById("living-room-btn");
const bedroomBtn = document.getElementById("bedroom-btn");
const diningRoomBtn = document.getElementById("dining-room-btn");

const stockBtnFilter = document.getElementById("stock-btn-filter");
const livingRoomBtnFilter = document.getElementById("livingroom-btn-filter");
const bedroomBtnFilter = document.getElementById("bedroom-btn-filter");
const diningRoomBtnFilter = document.getElementById("diningroom-btn-filter");

const azBtnSort = document.getElementById("a-z-sort");
const zaBtnSort = document.getElementById("z-a-sort");
const lowestFirstSort = document.getElementById("lowest-first-sort");
const highestFirstSort = document.getElementById("highest-first-sort");

const productsPerPage = 16;
let allProducts = [];
let filteredProducts = [];

function renderProducts(page) {
  productGrid.innerHTML = "";

  const start = (page - 1) * productsPerPage;
  const end = start + productsPerPage;
  const productsToShow = filteredProducts.slice(start, end);

  productsToShow.forEach((product) => {
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

    const productCard = document.createElement("div");
    productCard.classList.add("product-card");
    productCard.setAttribute("data-product-id", product.id);
    productCard.innerHTML = `
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
      <button class="add-to-cart" ${product.stock === 0 ? "disabled title='Out of stock'" : ""}>
        ${product.stock === 0 ? "Out of Stock" : "Add to Cart"}
      </button>
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
    `;
    productGrid.appendChild(productCard);
  });

  productGrid.querySelectorAll(".product-card").forEach((card) => {
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

  attachAddToCartListeners(productsToShow, productGrid);
}

function setupPagination(totalItems) {
  paginationContainer.innerHTML = "";
  const pageCount = Math.ceil(totalItems / productsPerPage);

  for (let i = 1; i <= pageCount; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;
    pageBtn.classList.add("page-btn");
    if (i === 1) pageBtn.classList.add("active");

    pageBtn.addEventListener("click", () => {
      renderProducts(i);
      setActivePage(i);
    });

    paginationContainer.appendChild(pageBtn);
  }
}

function setActivePage(currentPage) {
  paginationContainer.querySelectorAll("button").forEach((el, idx) => {
    el.classList.toggle("active", idx + 1 === currentPage);
  });
}

function filterByCategory(category) {
  filteredProducts = allProducts.filter((p) => p.category === category);
  renderProducts(1);
  setupPagination(filteredProducts.length);
  setActivePage(1);
  scrollToProductsSection();
}

function filterByStock() {
  filteredProducts = allProducts.filter((p) => p.stock > 0);
  renderProducts(1);
  setupPagination(filteredProducts.length);
  setActivePage(1);
}

function sortByAtoZ() {
  filteredProducts = [...filteredProducts].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  renderProducts(1);
  setupPagination(filteredProducts.length);
  setActivePage(1);
}

function sortByZtoA() {
  filteredProducts = [...filteredProducts].sort((a, b) =>
    b.name.localeCompare(a.name)
  );
  renderProducts(1);
  setupPagination(filteredProducts.length);
  setActivePage(1);
}

function sortByLowestFirst() {
  filteredProducts = [...filteredProducts].sort((a, b) => {
    const priceA = parseInt(a.price.replace(/[^\d]/g, ""));
    const priceB = parseInt(b.price.replace(/[^\d]/g, ""));
    return priceA - priceB;
  });

  renderProducts(1);
  setupPagination(filteredProducts.length);
  setActivePage(1);
}

function sortByHighestFirst() {
  filteredProducts = [...filteredProducts].sort((a, b) => {
    const priceA = parseInt(a.price.replace(/[^\d]/g, ""));
    const priceB = parseInt(b.price.replace(/[^\d]/g, ""));
    return priceB - priceA;
  });

  renderProducts(1);
  setupPagination(filteredProducts.length);
  setActivePage(1);
}

function getCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("category");
}

fetch("../assets/products.json")
  .then((response) => response.json())
  .then((data) => {
    allProducts = data.products;
    const initialCategory = getCategoryFromUrl();
    if (initialCategory) {
      filterByCategory(initialCategory);
    } else {
      filteredProducts = allProducts;
      renderProducts(1);
      setupPagination(filteredProducts.length);
    }
  })
  .catch((error) => console.error("Error fetching product data:", error));

// Top buttons
livingRoomBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  filterByCategory("living-room");
});
bedroomBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  filterByCategory("bedroom");
});
diningRoomBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  filterByCategory("dining-room");
});

// Filter buttons
livingRoomBtnFilter?.addEventListener("click", (e) => {
  e.preventDefault();
  filterByCategory("living-room");
});
bedroomBtnFilter?.addEventListener("click", (e) => {
  e.preventDefault();
  filterByCategory("bedroom");
});
diningRoomBtnFilter?.addEventListener("click", (e) => {
  e.preventDefault();
  filterByCategory("dining-room");
});
stockBtnFilter?.addEventListener("click", (e) => {
  e.preventDefault();
  filterByStock();
});

// Sort buttons
azBtnSort?.addEventListener("click", (e) => {
  e.preventDefault();
  sortByAtoZ();
});
zaBtnSort?.addEventListener("click", (e) => {
  e.preventDefault();
  sortByZtoA();
});
lowestFirstSort?.addEventListener("click", (e) => {
  e.preventDefault();
  sortByLowestFirst();
});
highestFirstSort?.addEventListener("click", (e) => {
  e.preventDefault();
  sortByHighestFirst();
});

function scrollToProductsSection() {
  const section = document.getElementById('products-section');
  if (section) section.scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCountIcon();
});