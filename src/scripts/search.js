// Search functionality for the header
export function initSearch() {
  console.log("Initializing search functionality...");

  // Add event listeners after DOM is ready
  const searchBtn = document.getElementById("searchBtn");
  const searchContainer = document.getElementById("search-container");
  const searchInput = document.getElementById("search-input");

  if (searchBtn) {
    searchBtn.addEventListener("click", toggleSearch);
    console.log("Search button event listener added");
  } else {
    console.error("Search button not found");
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => handleSearch(e.target.value));
    console.log("Search input event listener added");
  } else {
    console.error("Search input not found");
  }

  // Close search results when clicking outside
  document.addEventListener("click", function (e) {
    const searchWrapper = document.querySelector(".search-wrapper");
    if (searchWrapper && !searchWrapper.contains(e.target)) {
      if (searchContainer) {
        searchContainer.style.display = "none";
        const searchResults = document.getElementById("search-results");
        if (searchResults) {
          searchResults.style.display = "none";
        }
      }
    }
  });
}

function toggleSearch() {
  console.log("toggleSearch called");
  const searchContainer = document.getElementById("search-container");
  const searchInput = document.getElementById("search-input");

  if (!searchContainer || !searchInput) {
    console.error("Search elements not found");
    return;
  }

  if (searchContainer.style.display === "none" || searchContainer.style.display === "") {
    // Show search container
    searchContainer.style.display = "block";

    // Add a small delay to ensure the container is visible before expanding
    setTimeout(() => {
      searchContainer.classList.add("expanded");
      searchInput.focus();
      console.log("Search container shown and expanded");
    }, 50);
  } else {
    // Hide search container
    searchContainer.classList.remove("expanded");

    // Wait for transition to complete before hiding
    setTimeout(() => {
      searchContainer.style.display = "none";
      const searchResults = document.getElementById("search-results");
      if (searchResults) {
        searchResults.style.display = "none";
      }
      console.log("Search container hidden");
    }, 300); // Match the CSS transition duration
  }
}

function handleSearch(query) {
  console.log("handleSearch called with:", query);
  const searchResults = document.getElementById("search-results");

  if (!searchResults) {
    console.error("Search results container not found");
    return;
  }

  if (!query.trim()) {
    searchResults.style.display = "none";
    return;
  }

  // Fetch products and search
  const currentPath = window.location.pathname;
  const isInRoot = currentPath === "/" || currentPath === "/index.html";
  const productsPath = isInRoot ? "src/assets/products.json" : "../assets/products.json";

  console.log("Fetching products from:", productsPath);

  fetch(productsPath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const products = data.products;
      const matches = products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()));

      console.log("Found matches:", matches.length);
      displaySearchResults(matches);
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
      searchResults.innerHTML = '<div style="padding: 10px; text-align: center; color: #666;">Error loading products</div>';
      searchResults.style.display = "block";
    });
}

function displaySearchResults(products) {
  const searchResults = document.getElementById("search-results");

  if (!searchResults) {
    console.error("Search results container not found");
    return;
  }

  if (products.length === 0) {
    searchResults.innerHTML = '<div style="padding: 10px; text-align: center; color: #666;">No products found</div>';
    searchResults.style.display = "block";
    return;
  }

  let html = "";
  products.forEach((product) => {
    const currentPath = window.location.pathname;
    const isInRoot = currentPath === "/" || currentPath === "/index.html";
    const imgSrc = isInRoot ? product.image.replace("../assets/", "src/assets/") : product.image.replace("../assets/", "../assets/");

    const productUrl = isInRoot ? `./src/templates/product_details.html?id=${product.id}` : `product_details.html?id=${product.id}`;

    html += `
      <div onclick="window.location.href='${productUrl}'" style="display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #eee; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
        <img src="${imgSrc}" alt="${product.name}" style="width: 40px; height: 40px; object-fit: cover; margin-right: 10px; border-radius: 4px;">
        <div>
          <div style="font-weight: bold; color: #333;">${product.name}</div>
          <div style="font-size: 12px; color: #666;">${product.description}</div>
        </div>
      </div>
    `;
  });

  searchResults.innerHTML = html;
  searchResults.style.display = "block";
}
