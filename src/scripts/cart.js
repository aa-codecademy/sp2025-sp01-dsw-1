import { loadHTML } from "./utils.js";
import { getCart, saveCart } from './cart-utils.js';
import { showNotification } from './notification.js';

loadHTML("../templates/header.html", "afterbegin");
loadHTML("../templates/footer.html", "beforeend");

async function fetchProducts() {
  const response = await fetch("../assets/products.json");
  const data = await response.json();
  return data.products;
}

function parsePrice(priceStr) {
  return Number(priceStr.replace(/[^\d]/g, ""));
}

function formatCurrency(num) {
  return "Rp " + num.toLocaleString("id-ID");
}

function renderCart(products) {
  const cart = getCart();
  const tbody = document.getElementById("cart-items");
  tbody.innerHTML = "";
  let subtotal = 0;

  cart.forEach((cartItem, idx) => {
    const product = products.find((p) => String(p.id) === String(cartItem.id));
    if (!product) return;

    const price = parsePrice(product.price);
    const itemSubtotal = price * cartItem.quantity;
    subtotal += itemSubtotal;

    const row = document.createElement("tr");

    const productTd = document.createElement("td");
    productTd.innerHTML = `
      <div class="cart-product-info">
        <img src="${product.image}" alt="${product.name}" class="cart-product-img">
        <span class="cart-product-name">${product.name}</span>
      </div>
    `;

    const priceTd = document.createElement("td");
    priceTd.textContent = formatCurrency(price);

    const isOutOfStock = product.stock === 0;
    const qtyTd = document.createElement("td");
    qtyTd.innerHTML = `
      <div class="cart-quantity-controls">
        <button class="decrement" data-idx="${idx}" 
          ${cartItem.quantity <= 1 || isOutOfStock ? "disabled" : ""} 
          title="${isOutOfStock ? "Out of stock" : "Decrease quantity"}">-</button>
        <input type="number" min="1" max="${product.stock}" value="${cartItem.quantity}" 
          class="cart-qty-input" data-idx="${idx}" ${isOutOfStock ? "disabled" : ""}>
        <button class="increment" data-idx="${idx}" 
          ${cartItem.quantity >= product.stock || isOutOfStock ? "disabled" : ""} 
          title="${isOutOfStock ? "Out of stock" : `Only ${product.stock} in stock`}">+</button>
        <span class="stock-info">${isOutOfStock ? "Out of stock" : `In stock: ${product.stock}`}</span>
      </div>
    `;

    const subtotalTd = document.createElement("td");
    subtotalTd.textContent = formatCurrency(itemSubtotal);

    const removeTd = document.createElement("td");
    removeTd.innerHTML = `<button class="cart-remove-btn" data-idx="${idx}" title="Remove from cart">&#128465;</button>`;

    row.append(productTd, priceTd, qtyTd, subtotalTd, removeTd);
    tbody.appendChild(row);
  });

  document.getElementById("subtotal-value").textContent = formatCurrency(subtotal);
  document.getElementById("total-value").textContent = formatCurrency(subtotal);
}

document.addEventListener("DOMContentLoaded", async () => {
  const products = await fetchProducts();
  renderCart(products);

  document
    .getElementById("cart-items")
    .addEventListener("click", function (event) {
      const cart = getCart();
      if (event.target.classList.contains("increment")) {
        let itemIndex = Number(event.target.dataset.idx);
        let cartItem = cart[itemIndex];
        let product = products.find(p => String(p.id) === String(cartItem.id));
        if (cartItem.quantity < product.stock) {
          cartItem.quantity++;
          saveCart(cart);
          renderCart(products);
        } else {
          if (typeof showNotification === "function") {
            showNotification(`Sorry, only ${product.stock} items available.`);
          } else {
            alert(`Sorry, only ${product.stock} items available.`);
          }
        }
      }
      if (event.target.classList.contains("decrement")) {
        let itemIndex = Number(event.target.dataset.idx);
        let cartItem = cart[itemIndex];
        if (cartItem.quantity > 1) {
          cartItem.quantity--;
          saveCart(cart);
          renderCart(products);
        }
      }
      if (event.target.classList.contains("cart-remove-btn")) {
        let itemIndex = Number(event.target.dataset.idx);
        cart.splice(itemIndex, 1);
        saveCart(cart);
        renderCart(products);
      }
    });

  document
    .getElementById("cart-items")
    .addEventListener("input", function (event) {
      if (event.target.classList.contains("cart-qty-input")) {
        const cart = getCart();
        let itemIndex = Number(event.target.dataset.idx);
        let newQuantity = Number(event.target.value);
        let product = products.find(function (p) {
          return String(p.id) === String(cart[itemIndex].id);
        });
        if (isNaN(newQuantity) || newQuantity < 1) {
          newQuantity = 1;
        }
        if (newQuantity > product.stock) {
          newQuantity = product.stock;
          if (typeof showNotification === "function") {
            showNotification(`Sorry, only ${product.stock} items available.`);
          } else {
            alert(`Sorry, only ${product.stock} items available.`);
          }
        }
        cart[itemIndex].quantity = newQuantity;
        saveCart(cart);
        renderCart(products);
      }
    });

  const checkoutBtn = document.querySelector(".checkout-btn");
  if (checkoutBtn && checkoutBtn.tagName === "BUTTON") {
    checkoutBtn.addEventListener("click", () => {
      window.location.href = "checkout.html";
    });
  }
});
