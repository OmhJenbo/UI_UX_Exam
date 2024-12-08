const baseUrl = "http://localhost:8080"; // The base URL for your API

// Add an event listener to the search form, so when it's submitted,
// we'll execute the `performSearch` function.
document.getElementById("searchForm").addEventListener("submit", performSearch);

// This function is triggered when the search form is submitted.
// It prevents the default form submission (page reload) and initiates a book search.
function performSearch(event) {
  event.preventDefault(); // Prevent the page from reloading on form submission

  // Get the search query (book ID) from the input field and trim extra spaces
  const query = document.getElementById("searchInput").value.trim();

  // If a book ID is provided, fetch the corresponding book from the API
  if (query) {
    fetchBookById(query);
  } else {
    // If no valid input is provided, show an error message
    displayError("Please enter a valid book ID.");
  }
}

// Fetches a book by its ID from the API.
// It sends a GET request to the endpoint, checks for errors, and processes the response.
function fetchBookById(book_Id) {
  fetch(`${baseUrl}/admin/books/${book_Id}`)
    .then((response) => {
      // If the response is not OK (e.g., 404 not found, 500 server error), handle accordingly
      if (!response.ok) {
        if (response.status === 404) {
          // If the book doesn't exist, throw a specific error
          throw new Error("Book not found.");
        }
        // Otherwise, throw a generic HTTP error
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // If successful, parse the response body as JSON and return it
      return response.json();
    })
    .then((book) => {
      // Once the book is fetched and parsed, display it on the page
      displayBook(book);
    })
    .catch((error) => {
      // If any errors occur (network issues, server errors),
      // display the error message to the user
      displayError(error.message);
    });
}

// Displays the fetched book details on the page.
// Dynamically creates HTML elements to show the book's cover, title, author, etc.
function displayBook(book) {
  // Check if book data is valid
  if (!book || typeof book !== "object") {
    displayError("Unable to display book details.");
    return;
  }

  const resultsDiv = document.getElementById("searchResult");
  if (!resultsDiv) {
    return; // If there's no results container, exit silently
  }

  resultsDiv.innerHTML = ""; // Clear any previous results

  // Create a document fragment to build the book content efficiently
  const fragment = document.createDocumentFragment();

  // Main container for the book information
  const bookInfoContainer = document.createElement("div");
  bookInfoContainer.classList.add("book-info");

  // Container for the book cover
  const bookCoverContainer = document.createElement("div");
  bookCoverContainer.classList.add("cover-container");
  
  // Create and append the book cover image
  const bookCover = document.createElement("img");
  bookCover.src = book.cover || "placeholder.jpg"; // Default cover if not provided
  bookCover.alt = `${book.title || "Unknown"} cover`;
  bookCoverContainer.appendChild(bookCover);
  bookInfoContainer.appendChild(bookCoverContainer);

  // Container for book details (title, author, publisher, etc.)
  const bookDetailsContainer = document.createElement("div");
  bookDetailsContainer.classList.add("book-details");

  // Helper function to append a detail line, such as "Title: The Great Book"
  const appendDetail = (label, value) => {
    const detail = document.createElement("p");
    detail.textContent = `${label}: ${value || "N/A"}`;
    bookDetailsContainer.appendChild(detail);
  };

  // Add each book detail line
  appendDetail("Title", book.title);
  appendDetail("Author", book.author);
  appendDetail("Published by", book.publishing_company);
  appendDetail("Year", book.publishing_year);

  // If the book has a loan history, display it as a list
  if (book.loans && book.loans.length > 0) {
    const loanHistoryHeader = document.createElement("h3");
    loanHistoryHeader.textContent = "Loan History:";
    bookDetailsContainer.appendChild(loanHistoryHeader);

    const loanList = document.createElement("ul");
    const loanListFragment = document.createDocumentFragment();

    // For each loan entry, create a list item showing user ID and loan date
    book.loans.forEach((loan) => {
      const loanItem = document.createElement("li");
      loanItem.textContent = `User ID: ${loan.user_id}, Loan Date: ${loan.loan_date}`;
      loanListFragment.appendChild(loanItem);
    });

    // Append all loan items at once for efficiency
    loanList.appendChild(loanListFragment);
    bookDetailsContainer.appendChild(loanList);
  } else {
    // If there's no loan history, indicate that
    const noLoans = document.createElement("p");
    noLoans.textContent = "No loan history available.";
    bookDetailsContainer.appendChild(noLoans);
  }

  // Add the details container to the main book container
  bookInfoContainer.appendChild(bookDetailsContainer);

  // Add the entire book container to the fragment
  fragment.appendChild(bookInfoContainer);

  // Finally, append the completed fragment to the results div
  resultsDiv.appendChild(fragment);
}

// Displays an error message in the results area.
// Clears any existing content and shows a red error message.
function displayError(message) {
  const resultsDiv = document.getElementById("searchResult");
  if (!resultsDiv) return; // If no result area is found, exit gracefully

  resultsDiv.innerHTML = ""; // Clear previous results or errors
  const errorElement = document.createElement("p");
  errorElement.textContent = message;
  errorElement.style.color = "red"; // Styling the error message in red for visibility
  resultsDiv.appendChild(errorElement);
}
