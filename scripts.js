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
                const bookCard = document.createElement("div");
                bookCard.classList.add("bookCard");

                const coverImage = book.cover ? book.cover : "https://dummyimage.com/150x200/cccccc/000000&text=No+Cover";

                bookCard.innerHTML = `
                    <img src="${coverImage}" alt="${book.title}">
                    <h2>${book.title}</h2>
                    <p><strong>Author:</strong> ${book.author}</p>
                    <p><strong>Publisher:</strong> ${book.publishing_company}</p>
                    <p><strong>Year:</strong> ${book.publishing_year}</p>
                    <button>Loan this book</button
                `;

                bookList.append(bookCard);
            });
        })
        .catch(error => {
            console.error("Error fetching book data:", error);
        });
}

