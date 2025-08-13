# Furniture Shop Website

A modern furniture e-commerce website built with HTML, CSS, and JavaScript.

## Features

- Responsive design
- Dynamic product loading
- Shopping cart functionality
- Search functionality
- Category-based browsing
- Product details pages

## Structure

- `index.html` - Main homepage (root directory for GitHub Pages)
- `src/` - Source code directory
  - `assets/` - Images and data files
  - `scripts/` - JavaScript functionality
  - `styles/` - CSS styling
  - `templates/` - HTML template files

## GitHub Pages

This project is configured to work with GitHub Pages. The main entry point is `index.html` in the root directory, which dynamically loads the header and footer components.

## Local Development

To run this project locally, you'll need a local web server due to CORS restrictions when loading local files. You can use:

- Python: `python -m http.server 8000`
- Node.js: `npx serve .`
- VS Code Live Server extension

## Pages

- Homepage (`index.html`)
- Categories (`src/templates/category.html`)
- Product Details (`src/templates/product_details.html`)
- Cart (`src/templates/cart.html`)
- Checkout (`src/templates/checkout.html`)
- Login (`src/templates/login.html`)
- Register (`src/templates/register.html`)
- Contact (`src/templates/contact.html`)
- About Us (`src/templates/about_us.html`)
