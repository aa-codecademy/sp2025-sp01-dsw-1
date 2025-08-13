export function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

export function saveCart(cart) {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (e) {}
}

export function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => String(item.id) === String(product.id));
  if (existing) {
    existing.quantity += quantity;
  } else {
    const { id, name, price, image, discount, description } = product;
    cart.push({ id, name, price, image, discount, description, quantity });
  }
  const cleanedCart = cart.map((item) => {
    const { id, name, price, image, discount, description, quantity } = item;
    return { id, name, price, image, discount, description, quantity };
  });
  saveCart(cleanedCart);
  updateCartCountIcon();
}

export function updateCartCountIcon() {
  // Try to find the cart icon element
  let cartIcon = document.getElementById("cart-icon-link");

  // If cart icon doesn't exist yet, retry after a short delay
  if (!cartIcon) {
    setTimeout(() => updateCartCountIcon(), 100);
    return;
  }

  let badge = document.getElementById("cart-count-badge");

  if (!badge) {
    badge = document.createElement("span");
    badge.id = "cart-count-badge";
    badge.style.position = "absolute";
    badge.style.top = "0";
    badge.style.right = "0";
    badge.style.background = "#e74c3c";
    badge.style.color = "#fff";
    badge.style.fontSize = "12px";
    badge.style.padding = "2px 6px";
    badge.style.borderRadius = "50%";
    badge.style.zIndex = "10001";
    badge.style.transform = "translate(50%,-50%)";
    badge.style.pointerEvents = "none";
    cartIcon.style.position = "relative";
    cartIcon.appendChild(badge);
  }

  const cart = getCart();
  badge.textContent = cart.length > 0 ? cart.length : "";
  badge.style.display = cart.length > 0 ? "inline-block" : "none";
}

// Function to initialize cart count after header is loaded
export function initCartCount() {
  // Wait for header to be loaded, then update cart count
  const checkHeaderLoaded = () => {
    const cartIcon = document.getElementById("cart-icon-link");
    if (cartIcon) {
      updateCartCountIcon();
    } else {
      // If header not loaded yet, retry after 100ms
      setTimeout(checkHeaderLoaded, 100);
    }
  };

  // Start checking after a short delay to allow header loading
  setTimeout(checkHeaderLoaded, 200);
}
