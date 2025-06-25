import { loadHTML } from '../scripts/utils.js';
import { showNotification } from './notification.js';
import { addToCart, updateCartCountIcon } from './cart-utils.js';

const mostPopularGrid = document.querySelector(".most-popular-grid");
const categoryProductsGrid = document.querySelector(".category-products-grid");

function attachAddToCartListeners(products, gridElement) {
  gridElement.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", function (event) {
      event.stopPropagation();
      const card = btn.closest(".product-card");
      const productId = card.getAttribute("data-product-id");
      const product = products.find(p => String(p.id) === String(productId));
      if (product) {
        addToCart(product, 1);
        showNotification(`${product.name} added to cart!`);
      }
    });
  });
}

function renderProductCards(products, gridElement) {
  gridElement.innerHTML = '';
  products.forEach(product => {
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

    // Fix image path for homepage
    let imagePath = product.image;
    if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
      if (imagePath.startsWith('../assets/')) {
        imagePath = imagePath.replace('../assets/', 'src/assets/');
      }
    }

    const productCard = document.createElement("div");
    productCard.classList.add("product-card");
    productCard.setAttribute("data-product-id", product.id);
    productCard.innerHTML = `
      ${badgeHTML}
      <img src="${imagePath}" alt="${product.name}" class="product-image">
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
          <img src="src/assets/Frame 11.png" alt="Share" class="product-icon">
        </a>
        <a href="#" class="product-link">
          <img src="src/assets/Frame 12.png" alt="Compare" class="product-icon">
        </a>
        <a href="#" class="product-link">
          <img src="src/assets/Frame 10.png" alt="Like" class="product-icon">
        </a>
      </div>
    `;
    gridElement.appendChild(productCard);
  });

  gridElement.querySelectorAll(".product-card").forEach((card) => {
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

  attachAddToCartListeners(products, gridElement);
}

fetch("src/assets/products.json")
  .then((response) => response.json())
  .then((data) => {
    const products = data.products;

    const mostPopularProducts = products.filter(
      (product) => product.IsMostPopular
    );
    renderProductCards(mostPopularProducts.slice(0, 8), mostPopularGrid);

    function filterAndRenderCategory(categoryName) {
      const filtered = products.filter(
        (product) => product.category && product.category.toLowerCase() === categoryName.toLowerCase()
      );
      renderProductCards(filtered, categoryProductsGrid);
    }

    document.getElementById('dining-room-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      filterAndRenderCategory('dining-room');
    });
    document.getElementById('living-room-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      filterAndRenderCategory('living-room');
    });
    document.getElementById('bedroom-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      filterAndRenderCategory('bedroom');
    });
  })
  .catch((error) => console.error("Error fetching product data:", error));

const headerPath = 'src/templates/header.html';
loadHTML(headerPath, 'afterbegin').then(() => {
  if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
    document.querySelectorAll('header img').forEach(img => {
      let origSrc = img.getAttribute('src');
      if (origSrc && (origSrc.startsWith('../assets/') || origSrc.startsWith('/assets/'))) {
        img.setAttribute('src', origSrc.replace(/^\.\.\/assets\//, 'src/assets/').replace(/^\/assets\//, 'src/assets/'));
      }
    });
    document.querySelectorAll('.navbar-links a, .navbar-icons a').forEach(a => {
      let href = a.getAttribute('href');
      if (href === '../../index.html') {
        a.setAttribute('href', 'index.html');
      } else if (
        !href.startsWith('http') &&
        !href.startsWith('src/templates/') &&
        href !== 'index.html'
      ) {
        href = href.replace(/^\.\//, '').replace(/^\//, '');
        a.setAttribute('href', 'src/templates/' + href);
      }
    });
  }
});

loadHTML('src/templates/footer.html', 'beforeend');

document.addEventListener('DOMContentLoaded', () => {
  updateCartCountIcon();
});