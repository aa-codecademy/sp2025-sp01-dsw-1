// import { loadHTML } from './utils.js';
import { showNotification } from './notification.js';
import { addToCart, updateCartCountIcon, getCart } from './cart-utils.js';
// import { setupSearch } from './search-utils.js';
import { init } from './search-utils.js'; 
init();


async function fetchProducts() {
    const response = await fetch('../../products.json');
    const data = await response.json();
    return data.products;
}

function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return Number(params.get('id'));
}

function renderProduct(product) {
    const mainImg = document.getElementById('main-product-image');
    mainImg.src = (product.imageUrl && product.imageUrl[0]) || product.image;
    mainImg.alt = product.name;

    const thumbnailsDiv = document.getElementById('product-thumbnails');
    thumbnailsDiv.innerHTML = '';
    (product.imageUrl && product.imageUrl.length ? product.imageUrl : [product.image]).forEach((img, idx) => {
        const thumb = document.createElement('img');
        thumb.src = img;
        thumb.alt = product.name + ' thumbnail';
        if (idx === 0) thumb.classList.add('selected');
        thumb.addEventListener('click', () => {
            mainImg.src = img;
            thumbnailsDiv.querySelectorAll('img').forEach(i => i.classList.remove('selected'));
            thumb.classList.add('selected');
        });
        thumbnailsDiv.appendChild(thumb);
    });

    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-price').textContent = product.price;
    document.getElementById('product-description').textContent = product.description || '';

    const stockInfo = document.getElementById('product-stock-info');
    if (stockInfo) {
        stockInfo.textContent = product.stock === 0 ? 'Out of stock' : `In stock: ${product.stock}`;
    }

    const addBtn = document.getElementById('add-to-cart-btn');
    if (addBtn) {
        addBtn.disabled = product.stock === 0;
        addBtn.title = product.stock === 0 ? 'Out of stock' : '';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const products = await fetchProducts();
    const productId = getProductIdFromUrl();
    const product = products.find(p => p.id === productId) || products[0];

    renderProduct(product);

    const qtyInput = document.getElementById('product-qty');
    const decreaseBtn = document.getElementById('decrease-qty');
    const increaseBtn = document.getElementById('increase-qty');
    const addBtn = document.getElementById('add-to-cart-btn');
    let stockInfo = document.getElementById('product-stock-info');

    if (!stockInfo && qtyInput) {
        stockInfo = document.createElement('span');
        stockInfo.id = 'product-stock-info';
        stockInfo.className = 'stock-info';
        qtyInput.parentNode.appendChild(stockInfo);
    }

    function getCurrentQtyInCart() {
        const cart = getCart();
        const cartItem = cart.find(item => item.id === product.id);
        return cartItem ? cartItem.quantity : 0;
    }

    function updateQtyControls() {
        const stock = product.stock;
        const currentInCart = getCurrentQtyInCart();
        const maxAvailable = Math.max(stock - currentInCart, 0);

        let val = parseInt(qtyInput.value, 10) || 1;
        if (val < 1) val = 1;
        if (val > maxAvailable) val = maxAvailable;
        qtyInput.value = val;

        const outOfStock = stock === 0 || maxAvailable === 0;
        qtyInput.disabled = outOfStock;
        increaseBtn.disabled = outOfStock || val >= maxAvailable;
        increaseBtn.title = outOfStock
            ? "Out of stock"
            : (val >= maxAvailable ? `Only ${maxAvailable} left (already ${currentInCart} in cart)` : "");
        decreaseBtn.disabled = outOfStock || val <= 1;
        decreaseBtn.title = outOfStock ? "Out of stock" : "Decrease quantity";
        addBtn.disabled = outOfStock;
        addBtn.title = outOfStock ? "Out of stock" : "";

        if (stockInfo) {
            stockInfo.textContent = outOfStock
                ? "Out of stock"
                : `In stock: ${stock} (${currentInCart} in cart, ${maxAvailable} available)`;
        }
    }

    decreaseBtn.onclick = () => {
        let val = parseInt(qtyInput.value, 10);
        if (val > 1) {
            qtyInput.value = val - 1;
            updateQtyControls();
        }
    };
    increaseBtn.onclick = () => {
        let val = parseInt(qtyInput.value, 10);
        const stock = product.stock;
        const currentInCart = getCurrentQtyInCart();
        const maxAvailable = Math.max(stock - currentInCart, 0);
        if (val < maxAvailable) {
            qtyInput.value = val + 1;
            updateQtyControls();
        } else {
            showNotification
                ? showNotification(`Sorry, only ${maxAvailable} more can be added (already ${currentInCart} in cart).`)
                : alert(`Sorry, only ${maxAvailable} more can be added (already ${currentInCart} in cart).`);
        }
    };
    qtyInput.addEventListener('input', updateQtyControls);

    addBtn.onclick = () => {
        const qty = parseInt(qtyInput.value, 10) || 1;
        const stock = product.stock;
        const currentInCart = getCurrentQtyInCart();
        const maxAvailable = Math.max(stock - currentInCart, 0);

        if (stock === 0 || maxAvailable === 0) {
            showNotification
                ? showNotification("Sorry, this product is out of stock.")
                : alert("Sorry, this product is out of stock.");
            return;
        }
        if (qty > maxAvailable) {
            showNotification
                ? showNotification(`Sorry, only ${maxAvailable} more can be added (already ${currentInCart} in cart).`)
                : alert(`Sorry, only ${maxAvailable} more can be added (already ${currentInCart} in cart).`);
            qtyInput.value = maxAvailable;
            updateQtyControls();
            return;
        }
        addToCart(product, qty);
        showNotification
            ? showNotification(`${product.name} added to cart!`)
            : alert(`${product.name} added to cart!`);
        updateCartCountIcon && updateCartCountIcon();
        updateQtyControls();
    };

    updateQtyControls();
    updateCartCountIcon();
});