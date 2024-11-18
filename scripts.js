const baseUrl = "http://localhost:8080";

document.addEventListener("DOMContentLoaded", () => {
    const bookId = 1251;
    fetchBooks(`${baseUrl}/books/${bookId}`);
});

function fetchBooks(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(book => {
            const bookList = document.getElementById("bookList");
            bookList.innerHTML = "";

            const bookCard = document.createElement("div");
            bookCard.classList.add("bookCard");

            bookCard.innerHTML = `
                <img src="${book.cover}" alt="${book.title}">
                <h2>${book.title}</h2>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Publisher:</strong> ${book.publishing_company}</p>
                <p><strong>Year:</strong> ${book.publishing_year}</p>
            `;

            bookList.append(bookCard);
        })
        .catch(error => {
            console.error("Error fetching book data:", error);
        });
}
