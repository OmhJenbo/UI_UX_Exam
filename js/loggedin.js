// Base URL for the API
const baseUrl = "http://localhost:8080";

document.addEventListener("DOMContentLoaded", () => {
  const numberOfBooks = 8;
  fetchBooks(`${baseUrl}/books?n=${numberOfBooks}`);

  // Add event delegation for loanBook buttons
  const bookList = document.getElementById("bookList");
  if (bookList) {
      bookList.addEventListener("click", (e) => {
          if (e.target.classList.contains("loanBook")) {
              e.preventDefault();

              const userId = sessionStorage.getItem("userId"); // Retrieve logged-in user's ID
              if (!userId) {
                  console.log("User not logged in");
                  window.location.href = "../templates/login.html";
                  return;
              }

              // Extract the book ID from the book card
              const bookCard = e.target.closest(".bookCard");
              const bookId = bookCard.getAttribute("data-book-id"); // Add `data-book-id` in HTML

              if (!bookId) {
                  console.error("Book ID not found");
                  return;
              }

              // Make the API call to loan the book
              fetch(`${baseUrl}/users/${userId}/books/${bookId}`, {
                  method: "POST",
              })
                  .then((response) => {
                      if (!response.ok) {
                          return response.text().then((text) => {
                              throw new Error(text || "Failed to loan the book");
                          });
                      }
                      return response.json();
                  })
                  .then((data) => {
                      console.log(data.message || "Book loaned successfully");
                      alert(data.message || "Book loaned successfully");
                  })
                  .catch((error) => {
                      console.error(error.message);
                      alert(error.message || "Failed to loan the book");
                  });
          }
      });
  }
});

function fetchBooks(url) {
  fetch(url)
      .then((response) => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      })
      .then((books) => {
          const bookList = document.getElementById("bookList");
          if (bookList) {
              bookList.innerHTML = "";

              books.forEach((book) => {
                  const bookCard = document.createElement("div");
                  bookCard.classList.add("bookCard");

                  // Add a `data-book-id` attribute to store the book's ID
                  bookCard.setAttribute("data-book-id", book.id); // Assuming `book.id` is the ID

                  bookCard.innerHTML = `
                      <h2>${book.title}</h2>
                      <h3>${book.author}</h3>
                      <p>${book.publishing_company}</p>
                      <p>${book.publishing_year}</p>
                      <button class="loanBook">Loan this book</button>
                  `;

                  bookList.append(bookCard);
              });
          }
      })
      .catch((error) => {
          console.error("Error fetching book data:", error);
      });
}