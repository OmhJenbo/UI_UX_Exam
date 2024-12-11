import { baseUrl, handleAPIError } from "./utils.js";

// Wait for the page to fully load before running the script
document.addEventListener("DOMContentLoaded", () => {
  const numberOfBooks = 12; // define how many books to fetch
  fetchBooks(`${baseUrl}/books?n=${numberOfBooks}`); // fetch books from the API

  const bookList = document.getElementById("bookList");
  if (bookList) {
    // add a single event listener to handle clicks on loan buttons
    bookList.addEventListener("click", handleLoanClick);
  }
});

// Function to fetch books from the API and display them
function fetchBooks(url) {
  fetch(url) // send a GET request to the API
    .then(handleAPIError) // Use handleAPIError for cleaner response handling
    .then((books) => {
      displayBooks(books); // call the function to display books on the page
      // this calls the function that will render all the books on the page
    })
    .catch((error) => {
      console.error("error fetching book data:", error);
    });
}

// function to display books on the page
function displayBooks(books) {
  // this function is responsible for creating and adding book elements to the page
  const bookList = document.getElementById("bookList");
  if (!bookList) return;

  bookList.innerHTML = ""; // clear any existing books from the container

  const fragment = new DocumentFragment(); // create fragment so we only append once at the end

  books.forEach((book) => {
    if (!book.id && !book.book_id) {
      console.warn("skipping book with missing id:", book); // warn if the book has no valid id
      return;
    }

    const bookId = book.id || book.book_id; // use the correct id property

    const bookCard = document.createElement("article"); // create a new article for each book
    bookCard.classList.add("bookCard"); // add a class for the cards
    bookCard.setAttribute("data-book-id", bookId); // add the book's id to the card

    // add the book details and loan button to the card
    bookCard.innerHTML = `
      <h2>${book.title}</h2>
      <h3>${book.author}</h3>
      <p>${book.publishing_company}</p>
      <p>${book.publishing_year}</p>
      <button class="loanBook">loan this book</button>
    `;

    fragment.appendChild(bookCard); // add the card to the fragment
  });

  bookList.appendChild(fragment); // add all book cards to the page at once to improve performance
}

// loan book
function handleLoanClick(e) {
  if (!e.target.classList.contains("loanBook")) return;

  e.preventDefault();
  const button = e.target;

  const userId = sessionStorage.getItem("userId"); // get userid from session to put in the fetch
  if (!userId) {
    window.location.href = "../templates/login.html"; // Redirect to login if no user ID
    return;
  }

  const bookCard = button.closest(".bookCard");
  const bookId = bookCard?.getAttribute("data-book-id");

  if (!bookId) {
    console.error("Book ID not found.");
    return;
  }

  const loanUrl = `${baseUrl}/users/${userId}/books/${bookId}`;
  fetch(loanUrl, { method: "POST" })
    .then(handleAPIError) // Use handleAPIError to handle response validation
    .then(() => {
      console.log(`user_id: ${userId} successfully loaned book_id: ${bookId}`); // to see which userid loaned which bookid in console

      // if no error is hit you get this message in alert
      alert("The book has been successfully loaned. Please check your email for the link to the e-book");
    })
    .catch((error) => {
      console.error(error.message);

      // changes the error from Postman to one that fits the user otherwise shows a generic message for other errors
      if (error.message === "This user has still this book on loan") {
        alert("You already have this book on loan.");
      } else {
        alert(error.message || "Failed to loan the book.");
      }
    });
}
