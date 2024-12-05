// Base URL for the API
const baseUrl = "http://localhost:8080";

// Wait for the page to fully load before running the script
document.addEventListener("DOMContentLoaded", () => {
  const numberOfBooks = 12; // Define how many books to fetch
  fetchBooks(`${baseUrl}/books?n=${numberOfBooks}`); // Fetch books from the API when the page loads

  const bookList = document.getElementById("bookList");
  if (bookList) {
    // Add a single event listener to handle clicks on loan buttons
    bookList.addEventListener("click", handleLoanClick);
  }
});

// Function to fetch books from the API and display them
function fetchBooks(url) {
  fetch(url) // Send a GET request to the API
    .then((response) => {
      if (!response.ok) {
        // If the response is not successful, throw an error
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Parse the response as JSON
    })
    .then((books) => {
      displayBooks(books); // Call the function to display books on the page
    })
    .catch((error) => {
      console.error("Error fetching book data:", error); // Log any errors that occur
    });
}

// Function to display books on the page
function displayBooks(books) {
  const bookList = document.getElementById("bookList"); // Find the book list container
  if (!bookList) return; // Exit if the container doesn't exist

  bookList.innerHTML = ""; // Clear any existing books from the container

  const loanedBooks = JSON.parse(sessionStorage.getItem("loanedBooks")) || {}; // Get loaned books from session storage
  const fragment = new DocumentFragment(); // Use a fragment for better performance when adding multiple elements

  books.forEach((book) => {
    // Skip books without an ID
    if (!book.id && !book.book_id) {
      console.warn("Skipping book with missing ID:", book);
      return;
    }

    const bookId = book.id || book.book_id; // Use the correct ID property
    const loanTimestamp = loanedBooks[bookId]; // Check if the book is loaned
    const isLoaned = loanTimestamp && Date.now() - loanTimestamp < 2592000000; // Check if loan is within 30 days

    const bookCard = document.createElement("div"); // Create a new div for each book
    bookCard.classList.add("bookCard"); // Add a class for styling
    bookCard.setAttribute("data-book-id", bookId); // Add the book's ID to the card

    // Set the button text and style based on the loan status
    const buttonText = isLoaned ? "Loaned" : "Loan this book";
    const buttonClass = isLoaned ? "loanBook loanedButton" : "loanBook";

    // Remove expired loans from session storage
    if (!isLoaned && loanTimestamp) {
      delete loanedBooks[bookId];
      sessionStorage.setItem("loanedBooks", JSON.stringify(loanedBooks));
    }

    // Add the book details and loan button to the card
    bookCard.innerHTML = `
      <h2>${book.title}</h2>
      <h3>${book.author}</h3>
      <p>${book.publishing_company}</p>
      <p>${book.publishing_year}</p>
      <button class="${buttonClass}">${buttonText}</button>
    `;

    fragment.appendChild(bookCard); // Add the card to the fragment
  });

  bookList.appendChild(fragment); // Add all book cards to the page at once
}

// Function to handle clicks on loan buttons
function handleLoanClick(e) {
    if (!e.target.classList.contains("loanBook")) return; // Only handle clicks on loan buttons
  
    e.preventDefault();
    const button = e.target;
  
    if (button.textContent === "Loaned") {
      alert("This book is already loaned.");
      return;
    }
  
    const userId = sessionStorage.getItem("userId");
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
    fetch(loanUrl, { method: "POST" }) // Send a POST request to loan the book
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text || "Failed to loan the book");
          });
        }
        return response.json();
      })
      .then(() => {
        button.textContent = "Loaned"; // Update the button text
        button.classList.add("loanedButton"); // Add a class for styling
  
        // Save the loaned book to session storage
        const loanedBooks = JSON.parse(sessionStorage.getItem("loanedBooks")) || {};
        loanedBooks[bookId] = Date.now(); // Save the current timestamp
        sessionStorage.setItem("loanedBooks", JSON.stringify(loanedBooks));
  
        console.log(`Book with ID ${bookId} successfully loaned by user ${userId}`);
  
        // Display a message to the user
        alert("The book has been successfully loaned. Please check your email for further details.");
      })
      .catch((error) => {
        console.error(error.message);
        alert(error.message || "Failed to loan the book."); // Show an error alert
      });
  }
  