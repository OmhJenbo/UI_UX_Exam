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
  const bookList = document.getElementById("bookList"); 
  if (!bookList) return;

  bookList.innerHTML = ""; // clear any existing books from the container

  const fragment = new DocumentFragment(); // create fragment so we only append once at the end

  books.forEach((book) => {
    if (!book.id && !book.book_id) {
      console.warn("Skipping book with missing ID:", book); // Warn if the book has no valid ID
      return;
    }

    const bookId = book.id || book.book_id; // Use the correct ID property

    const bookCard = document.createElement("div"); // create a new div for each book
    bookCard.classList.add("bookCard"); // add a class for the cards
    bookCard.setAttribute("data-book-id", bookId); // add the book's ID to the card

    // Add the book details and loan button to the card
    bookCard.innerHTML = `
      <h2>${book.title}</h2>
      <h3>${book.author}</h3>
      <p>${book.publishing_company}</p>
      <p>${book.publishing_year}</p>
      <button class="loanBook">Loan this book</button>
    `;

    fragment.appendChild(bookCard); // Add the card to the fragment
  });

  bookList.appendChild(fragment); // Add all book cards to the page at once to improve performance
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
    .then((response) => {
      if (!response.ok) {
        // make the error json
        return response.json().then((error) => {
          throw new Error(error.error || "Failed to loan the book");
        });
      }
      return response.json();
    })
    .then(() => {
      console.log(`user_id: ${userId} successfully loaned book_id: ${bookId}`); // to see which userid loaned which bookid in console

      // if no error is hit you get this message in alert
      alert("The book has been successfully loaned. Please check your email for the link to the e-book");
    })
    .catch((error) => {
      console.error(error.message);

      // changes teh error from postman to one that fits the user otherwise shows a generic message for other errors
      if (error.message === "This user has still this book on loan") {
        alert("You already have this book on loan.");
      } else {
        alert(error.message || "Failed to loan the book.");
      }
    });
}
