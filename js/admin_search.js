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
  
    // Create a paragraph for the book details
    const bookDetails = document.createElement("p");
    bookDetails.className = "result";
    bookDetails.textContent = `${book.title} by ${book.author}. Published by ${book.publishing_company} in ${book.publishing_year}.`;
  
    resultsDiv.appendChild(bookDetails);
  
    // Create a section for the loan history
    if (book.loans && book.loans.length > 0) {
      const loanHistoryHeader = document.createElement("h3");
      loanHistoryHeader.textContent = "Loan History:";
      resultsDiv.appendChild(loanHistoryHeader);
  
      const loanList = document.createElement("ul"); // Use an unordered list for better formatting
      book.loans.forEach((loan) => {
        const loanItem = document.createElement("li");
        loanItem.textContent = `User ID: ${loan.user_id}, Loan Date: ${loan.loan_date}`;
        loanList.appendChild(loanItem);
      });
  
      resultsDiv.appendChild(loanList);
    } else {
      const noLoans = document.createElement("p");
      noLoans.textContent = "No loan history available.";
      resultsDiv.appendChild(noLoans);
    }
  }
  