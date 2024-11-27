const baseUrl = "http://localhost:8080"; // The base URL for your API

// Add event listener to the form
document.getElementById("searchForm").addEventListener("submit", performSearch);

// Function to perform the search
function performSearch(event) {
  event.preventDefault(); // Prevent the default form submission

  const query = document.getElementById("searchInput").value.trim();

  if (query) {
    fetchBookById(query); // Fetch book from the API by ID
  }
}

// Function to fetch a book by ID from the API
function fetchBookById(book_Id) {
  fetch(`${baseUrl}/admin/books/${book_Id}`)
    .then((response) => {
      // Check if the response is OK (status code in the range 200-299)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Book not found.");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Parse the response JSON and return it
      return response.json();
    })
    .then((book) => {
      // Display the single book fetched from the API
      console.log("Fetched book:", book);
      displayBook(book);
    })
    .catch((error) => {
      // Handle errors
      console.error("Error fetching book data:", error);
      displayError(error.message);
    });
}

function displayBook(book) {
  const resultsDiv = document.getElementById("searchResult");
  resultsDiv.innerHTML = ""; // Clear previous results

  // Create a parent container for book cover and details
  const bookInfoContainer = document.createElement("div");
  bookInfoContainer.classList.add("book-info");

  // Create the book cover container
  const bookCoverContainer = document.createElement("div");
  bookCoverContainer.classList.add("cover-container");
  const bookCover = document.createElement("img");
  bookCover.src = book.cover; // Assign the image URL
  bookCover.alt = `${book.title} cover`; // Add an alt attribute for accessibility
  bookCoverContainer.appendChild(bookCover);
  bookInfoContainer.appendChild(bookCoverContainer);

  // Create a container div for book details and loan history
  const bookDetailsContainer = document.createElement("div");
  bookDetailsContainer.classList.add("book-details");

  // Add book details paragraphs to the container
  const bookTitle = document.createElement("p");
  bookTitle.textContent = `Title: ${book.title}`;
  bookDetailsContainer.appendChild(bookTitle);

  const bookAuthor = document.createElement("p");
  bookAuthor.textContent = `Author: ${book.author}`;
  bookDetailsContainer.appendChild(bookAuthor);

  const bookPublisher = document.createElement("p");
  bookPublisher.textContent = `Published by: ${book.publishing_company}`;
  bookDetailsContainer.appendChild(bookPublisher);

  const bookYear = document.createElement("p");
  bookYear.textContent = `Year: ${book.publishing_year}`;
  bookDetailsContainer.appendChild(bookYear);

  // Add loan history to the book details container
  if (book.loans && book.loans.length > 0) {
    const loanHistoryHeader = document.createElement("h3");
    loanHistoryHeader.textContent = "Loan History:";
    bookDetailsContainer.appendChild(loanHistoryHeader);
    
    const loanList = document.createElement("ul");
    book.loans.forEach((loan) => {
      const loanItem = document.createElement("li");
      loanItem.textContent = `User ID: ${loan.user_id}, Loan Date: ${loan.loan_date}`;
      loanList.appendChild(loanItem);
    });
    bookDetailsContainer.appendChild(loanList);
  } else {
    const noLoans = document.createElement("p");
    noLoans.textContent = "No loan history available.";
    bookDetailsContainer.appendChild(noLoans);
  }
  // Append the book details container to the book info container
  bookInfoContainer.appendChild(bookDetailsContainer);
  // Append the book info container to the main results div
  resultsDiv.appendChild(bookInfoContainer);
}
