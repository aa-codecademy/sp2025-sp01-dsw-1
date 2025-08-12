export const loadHTML = (url, position) => {
  console.log(`Loading HTML from ${url} into ${position}`);

  // Detect if we're in templates directory or root directory
  const currentPath = window.location.pathname;
  const isInTemplates = currentPath.includes("/src/templates/");
  const isInRoot = currentPath === "/" || currentPath === "/index.html";

  // Adjust the URL based on current location
  let adjustedUrl = url;
  if (isInTemplates && url.startsWith("../")) {
    // If we're in templates and URL starts with ../, keep it as is
    adjustedUrl = url;
  } else if (isInTemplates && url.startsWith("./src/")) {
    // If we're in templates and URL starts with ./src/, change to ../
    adjustedUrl = url.replace("./src/", "../");
  } else if (!isInTemplates && url.startsWith("../")) {
    // If we're in root and URL starts with ../, change to ./src/
    adjustedUrl = url.replace("../", "./src/");
  }

  console.log(`Adjusted URL: ${adjustedUrl}`);

  fetch(adjustedUrl)
    .then((response) => {
      console.log(`Response status: ${response.status}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((data) => {
      console.log(`HTML loaded, length: ${data.length}`);

      // Adjust paths in the loaded HTML based on current context
      if (isInRoot) {
        // If we're on the home page, adjust paths to work from root
        data = data.replace(/href="\.\.\//g, 'href="./src/');
        data = data.replace(/src="\.\.\//g, 'src="./src/');
      } else if (isInTemplates) {
        // If we're in templates, keep the paths as ../assets/ etc.
        // No changes needed
      }

      if (position === "afterbegin") {
        // Insert header at the beginning of body
        document.body.insertAdjacentHTML(position, data);
        console.log("Header inserted at beginning of body");
      } else if (position === "beforeend") {
        // Insert footer before the end of body
        document.body.insertAdjacentHTML(position, data);
        console.log("Footer inserted at end of body");
      } else if (position === "header-container") {
        // Insert header into the header container
        const headerContainer = document.getElementById("header-container");
        if (headerContainer) {
          headerContainer.innerHTML = data;
          console.log("Header inserted into header-container");
        } else {
          console.error("Header container not found!");
        }
      } else if (position === "footer-container") {
        // Insert footer into the footer container
        const footerContainer = document.getElementById("footer-container");
        if (footerContainer) {
          footerContainer.innerHTML = data;
          console.log("Footer inserted into footer-container");
        } else {
          console.error("Footer container not found!");
        }
      } else {
        // Default behavior - try to find element by ID
        const targetElement = document.getElementById(position);
        if (targetElement) {
          targetElement.innerHTML = data;
          console.log(`HTML inserted into ${position}`);
        } else {
          console.error(`Target element ${position} not found, falling back to body insertion`);
          // Fallback to body insertion
          document.body.insertAdjacentHTML("beforeend", data);
        }
      }
    })
    .catch((error) => {
      console.error(`Error loading ${adjustedUrl}:`, error);
    });
};
