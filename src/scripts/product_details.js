import { loadHTML } from './utils.js';
import { showNotification } from './notification.js';
import { addToCart, updateCartCountIcon } from './cart-utils.js';

loadHTML("/header.html", "afterbegin");
loadHTML("/footer.html", "beforeend");

async function fetchProducts() {
    const response = await fetch('../assets/products.json');
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
}

document.addEventListener('DOMContentLoaded', async () => {
    const products = await fetchProducts();
    const productId = getProductIdFromUrl();
    const product = products.find(p => p.id === productId) || products[0];

    renderProduct(product);

    const qtyInput = document.getElementById('product-qty');
    document.getElementById('decrease-qty').onclick = () => {
        let val = parseInt(qtyInput.value, 10);
        if (val > 1) qtyInput.value = val - 1;
    };
    document.getElementById('increase-qty').onclick = () => {
        let val = parseInt(qtyInput.value, 10);
        qtyInput.value = val + 1;
    };

    document.getElementById('add-to-cart-btn').onclick = () => {
        const qty = parseInt(qtyInput.value, 10) || 1;
        addToCart(product, qty);
        showNotification(`${product.name} added to cart!`);
    };

    updateCartCountIcon();
});