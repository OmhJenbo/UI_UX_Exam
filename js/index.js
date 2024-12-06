// Export the base URL for the API so it can be reused
const baseUrl = "http://localhost:8080";

// Wait for the HTML content to fully load before running the script
document.addEventListener("DOMContentLoaded", () => {
  const numberOfBooks = 12; // Define how many books to fetch
  fetchBooks(`${baseUrl}/books?n=${numberOfBooks}`); // Fetch the books from the API

  const bookList = document.getElementById("bookList");
  if (bookList) {
    bookList.addEventListener("click", handleLoanClick); // Add event listener for loaning books
  }
});

// Function to fetch books from the API and render them
function fetchBooks(url) {
  fetch(url)
    .then(handleResponse)
    .then((books) => {
      displayBooks(books); // Display the fetched books
    })
    .catch((error) => {
      console.error("Error fetching book data:", error); // Log any errors during the fetch
    });
}

// Function to handle the loan button click
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
  fetch(loanUrl, { method: "POST" })
    .then(handleResponse)
    .then(() => {
      button.textContent = "Loaned"; // Change button text
      button.classList.add("loanedButton"); // Add the loaned style

      // Save the loan timestamp in sessionStorage
      const loanedBooks = JSON.parse(sessionStorage.getItem("loanedBooks")) || {};
      loanedBooks[bookId] = Date.now(); // Store the current timestamp
      sessionStorage.setItem("loanedBooks", JSON.stringify(loanedBooks));
    })
    .catch((error) => {
      console.error(error.message);
      alert(error.message || "Failed to loan the book."); // Show an error alert
    });
}

// Function to display books and handle their loaned state
function displayBooks(books) {
    const bookList = document.getElementById("bookList");
    if (!bookList) return;
  
    bookList.innerHTML = ""; // Clear the existing book list
  
    const loanedBooks = JSON.parse(sessionStorage.getItem("loanedBooks")) || {}; // Retrieve loaned books from sessionStorage
    const fragment = new DocumentFragment(); // Create a DocumentFragment for better performance
  
    books.forEach((book) => {
      // Debugging log
      console.log("Processing book:", book);
  
      // Validate that the book has a valid identifier
      const bookId = book.book_id || book.id; // Adjust this based on your API response
      if (!bookId) {
        console.warn("Skipping book with missing ID:", book);
        return;
      }
  
      const bookCard = document.createElement("article");
      bookCard.classList.add("bookCard");
      bookCard.setAttribute("data-book-id", bookId); // Use the correct book identifier
  
      // Check if the book is loaned and if 30 days have passed
      const loanTimestamp = loanedBooks[bookId];
      const isLoaned = loanTimestamp && (Date.now() - loanTimestamp < 2592000000); // 30 days in milliseconds
      const buttonText = isLoaned ? "Loaned" : "Loan this book";
      const buttonClass = isLoaned ? "loanBook loanedButton" : "loanBook";
  
      // Remove expired loans from sessionStorage
      if (!isLoaned && loanTimestamp) {
        delete loanedBooks[bookId];
        sessionStorage.setItem("loanedBooks", JSON.stringify(loanedBooks));
      }
  
      bookCard.innerHTML = `
        <h2>${book.title}</h2>
        <h3>${book.author}</h3>
        <p>${book.publishing_company}</p>
        <p>${book.publishing_year}</p>
        <button class="${buttonClass}">${buttonText}</button>
      `;
  
      fragment.appendChild(bookCard); // Add each bookCard to the fragment
    });
  
    bookList.appendChild(fragment); // Append all book cards to the DOM at once
  }
  