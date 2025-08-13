export const loadHTML = (url, position) => {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML(position, data);
        })
        .catch(error => console.error(`Error loading ${url}:`, error));
};