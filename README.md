# Furniture Shop Website

A modern furniture e-commerce website built with HTML, CSS, and JavaScript.

## Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Product Catalog**: Browse furniture by categories (Dining, Living, Bedroom)
- **Search Functionality**: Search products by name
- **Shopping Cart**: Add items to cart and manage quantities
- **Product Details**: Detailed product pages with images and descriptions
- **User Authentication**: Login and registration pages
- **Contact Form**: Get in touch with customer support

## File Structure

```
├── index.html              # Main homepage (GitHub Pages entry point)
├── assets/                 # Images and product data
│   ├── images/            # Product and UI images
│   └── products.json      # Product catalog data
├── styles/                # CSS stylesheets
├── scripts/               # JavaScript functionality
└── templates/             # HTML page templates
    ├── category.html      # Product category page
    ├── product_details.html # Individual product page
    ├── cart.html          # Shopping cart
    ├── checkout.html      # Checkout process
    ├── login.html         # User login
    ├── register.html      # User registration
    ├── contact.html       # Contact page
    ├── about_us.html      # About us page
    ├── header.html        # Navigation header
    └── footer.html        # Site footer
```

## GitHub Pages Setup

This website is configured to work with GitHub Pages. The main entry point is `index.html` in the root directory.

### Key Changes Made for GitHub Pages:

1. **Moved index.html to root**: The main homepage is now at the root level for GitHub Pages compatibility
2. **Updated all relative paths**: All CSS, JavaScript, and image paths have been updated to work from the root directory
3. **Fixed navigation links**: All internal links now point to the correct template locations

### Navigation Structure:

- **Home**: `index.html` (root)
- **Categories**: `templates/category.html`
- **Product Details**: `templates/product_details.html`
- **Cart**: `templates/cart.html`
- **Checkout**: `templates/checkout.html`
- **Login**: `templates/login.html`
- **Register**: `templates/register.html`
- **Contact**: `templates/contact.html`
- **About Us**: `templates/about_us.html`

## Local Development

To run this website locally:

1. Clone the repository
2. Open `index.html` in your web browser
3. Or use a local server (recommended for full functionality):

   ```bash
   # Using Python 3
   python -m http.server 8000

   # Using Node.js
   npx serve .
   ```

## Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Styling and responsive design
- **JavaScript (ES6+)**: Interactive functionality
- **JSON**: Product data storage

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is for educational purposes.
