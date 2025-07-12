// import { loadHTML } from "../scripts/utils.js";
import { showNotification } from './notification.js';
import { addToCart, updateCartCountIcon, getCart } from './cart-utils.js';
import { setupSearch } from './search-utils.js';
import { init } from './search-utils.js';

const mostPopularGrid = document.querySelector('.most-popular-grid');
const categoryProductsGrid = document.querySelector('.category-products-grid');

function attachAddToCartListeners(products, gridElement) {
	gridElement.querySelectorAll('.add-to-cart').forEach(btn => {
		btn.addEventListener('click', function (event) {
			event.stopPropagation();
			const card = btn.closest('.product-card');
			const productId = card.getAttribute('data-product-id');
			const product = products.find(p => String(p.id) === String(productId));
			if (product) {
				const cart = getCart();
				const cartItem = cart.find(item => item.id === product.id);
				const currentQty = cartItem ? cartItem.quantity : 0;

				if (product.stock === 0) {
					showNotification
						? showNotification('Sorry, this product is out of stock.')
						: alert('Sorry, this product is out of stock.');
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

function renderProductCards(products, gridElement) {
	gridElement.innerHTML = '';
	products.forEach(product => {
		let badgeHTML = '';
		if (product.discount) {
			const discountPercentage = Math.round(
				((parseFloat(product.discount.replace(/[^0-9.-]+/g, '')) -
					parseFloat(product.price.replace(/[^0-9.-]+/g, ''))) /
					parseFloat(product.discount.replace(/[^0-9.-]+/g, ''))) *
					100
			);
			badgeHTML = `<div class="product-badge discount">${discountPercentage}%</div>`;
		} else {
			badgeHTML = `<div class="product-badge new">New</div>`;
		}

		const productCard = document.createElement('div');
		productCard.classList.add('product-card');
		productCard.setAttribute('data-product-id', product.id);
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
							: ''
					}
        </p>
      </div>
      <button class="add-to-cart" ${
				product.stock === 0 ? "disabled title='Out of stock'" : ''
			}>
        ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    `;
		gridElement.appendChild(productCard);
	});

	gridElement.querySelectorAll('.product-card').forEach(card => {
		card.addEventListener('click', function (event) {
			if (
				event.target.closest('.add-to-cart') ||
				event.target.closest('.product-link')
			) {
				return;
			}
			const productId = card.getAttribute('data-product-id');
			if (productId) {
				window.location.href = `templates/product_details.html?id=${productId}`;
			}
		});
	});

	attachAddToCartListeners(products, gridElement);
}

fetch('../assets/products.json')
	.then(response => response.json())
	.then(data => {
		const products = data.products;

		setupSearch(products);

		const mostPopularProducts = products.filter(
			product => product.IsMostPopular
		);
		renderProductCards(mostPopularProducts.slice(0, 8), mostPopularGrid);

		function filterAndRenderCategory(categoryName) {
			const filtered = products.filter(
				product =>
					product.category &&
					product.category.toLowerCase() === categoryName.toLowerCase()
			);
			renderProductCards(filtered, categoryProductsGrid);
		}

		document.getElementById('dining-room-btn')?.addEventListener('click', e => {
			e.preventDefault();
			filterAndRenderCategory('dining-room');
		});
		document.getElementById('living-room-btn')?.addEventListener('click', e => {
			e.preventDefault();
			filterAndRenderCategory('living-room');
		});
		document.getElementById('bedroom-btn')?.addEventListener('click', e => {
			e.preventDefault();
			filterAndRenderCategory('bedroom');
		});
	})
	.catch(error => console.error('Error fetching product data:', error));

init();
