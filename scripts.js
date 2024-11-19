const baseUrl = "http://localhost:8080";

document.addEventListener("DOMContentLoaded", () => {
    const numberOfBooks = 12;
    fetchBooks(`${baseUrl}/books?n=${numberOfBooks}`);
});

function fetchBooks(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(books => {
            const bookList = document.getElementById("bookList");
            bookList.innerHTML = "";

            books.forEach(book => {
                const bookCard = document.createElement("div.bookCard");
                bookCard.classList.add("bookCard");

                bookCard.innerHTML = `
                    <h2>${book.title}</h2>
                    <h3>${book.author}</h3>
                    <p>${book.publishing_company}</p>
                    <p>${book.publishing_year}</p>
                    <button>Loan this book</button
                `;

                bookList.append(bookCard);
            });
        })
        .catch(error => {
            console.error("Error fetching book data:", error);
        });
}
