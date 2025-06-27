export function loadHTML(url, position = "beforeend", selector = "body") {
  return fetch(url)
    .then(response => response.text())
    .then(html => {
      document.querySelector(selector).insertAdjacentHTML(position, html);
    });
}