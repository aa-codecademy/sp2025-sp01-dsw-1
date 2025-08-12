import { loadHTML } from "./utils.js";

export function setupSearch(products) {
  const searchBtn = document.getElementById("searchBtn");
  const searchContainer = document.getElementById("search-container");
  const searchInput = document.getElementById("search-input");

  if (!searchBtn || !searchInput || !searchContainer) return;

  const suggestionBox = document.createElement("ul");
  suggestionBox.classList.add("search-suggestions");
  suggestionBox.style.position = "absolute";
  suggestionBox.style.top = "100%";
  suggestionBox.style.left = "0";
  suggestionBox.style.right = "0";
  suggestionBox.style.background = "#fff";
  suggestionBox.style.border = "1px solid #ccc";
  suggestionBox.style.borderTop = "none";
  suggestionBox.style.zIndex = "1000";
  suggestionBox.style.listStyle = "none";
  suggestionBox.style.margin = "0";
  suggestionBox.style.padding = "0";
  suggestionBox.style.maxHeight = "300px";
  suggestionBox.style.overflowY = "auto";
  suggestionBox.style.display = "none";
  suggestionBox.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
  searchContainer.style.position = "relative"; // Ensure relative container
  searchContainer.appendChild(suggestionBox);

  searchBtn.addEventListener("click", () => {
    searchContainer.style.display = searchContainer.style.display === "none" ? "block" : "none";
    searchInput.focus();
  });

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim().toLowerCase();
    suggestionBox.innerHTML = "";

    if (query.length === 0) {
      suggestionBox.style.display = "none";
      return;
    }

    const matches = products.filter((p) => p.name.toLowerCase().includes(query));

    if (matches.length === 0) {
      suggestionBox.innerHTML = `<li style="padding: 10px; border-bottom: 1px solid #eee;">No results found</li>`;
      suggestionBox.style.display = "block";
      return;
    }

    matches.forEach((product) => {
      const li = document.createElement("li");
      li.style.display = "flex";
      li.style.alignItems = "center";
      li.style.padding = "8px";
      li.style.borderBottom = "1px solid #eee";
      li.style.cursor = "pointer";
      li.style.transition = "background 0.2s";
      li.addEventListener("mouseover", () => (li.style.background = "#f0f0f0"));
      li.addEventListener("mouseout", () => (li.style.background = "#fff"));

      const img = document.createElement("img");

      // Fix the image path to work from both contexts
      const currentPath = window.location.pathname;
      const isInRoot = currentPath === "/" || currentPath === "/index.html";
      const imgSrc = isInRoot ? product.image.replace("../assets/", "src/assets/") : product.image.replace("../assets/", "../assets/");

      img.src = imgSrc;
      img.alt = product.name;
      img.style.width = "40px";
      img.style.height = "40px";
      img.style.objectFit = "cover";
      img.style.marginRight = "10px";
      img.style.borderRadius = "4px";

      const name = document.createElement("span");
      name.textContent = product.name;
      name.style.fontSize = "14px";
      name.style.color = "#333";

      li.appendChild(img);
      li.appendChild(name);
      li.addEventListener("click", () => {
        // Use correct path based on current location
        const productUrl = isInRoot ? `./src/templates/product_details.html?id=${product.id}` : `product_details.html?id=${product.id}`;
        window.location.href = productUrl;
      });

      suggestionBox.appendChild(li);
    });

    suggestionBox.style.display = "block";
  });

  document.addEventListener("click", (e) => {
    if (!searchContainer.contains(e.target)) {
      suggestionBox.style.display = "none";
    }
  });
}

export async function init() {
  // Remove the header/footer loading from here since it's handled in homepage.js
  // Just setup search if products are available
  try {
    const response = await fetch("./src/assets/products.json");
    const data = await response.json();
    const products = data.products;
    setupSearch(products);
  } catch (error) {
    console.log("Products not loaded yet, search will be set up later");
  }
}
