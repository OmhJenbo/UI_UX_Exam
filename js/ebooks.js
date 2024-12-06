const baseUrl = "http://localhost:8080";

document.addEventListener("DOMContentLoaded", () => {
  const numberOfBooks = 8;
  fetchBooks(`${baseUrl}/books?n=${numberOfBooks}`);

  const bookList = document.getElementById("bookList");
  if (bookList) {
    bookList.addEventListener("click", handleLoanClick);
  }
});

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

function fetchBooks(url) {
  fetch(url)
    .then(handleResponse)
    .then((books) => {
      renderBooks(books);
    })
    .catch((error) => console.error("Error fetching books:", error));
}

// Render books to the page
function renderBooks(books) {
  const bookList = document.getElementById("bookList");
  if (!bookList) return;

  bookList.innerHTML = "";

  books.forEach((book) => {
    if (!book.book_id) {
      console.warn("Skipping book with missing ID:", book); // dont fetch a book if the id is missing in the API
      return;
    }

    const bookCard = document.createElement("div");
    bookCard.classList.add("bookCard");
    bookCard.setAttribute("data-book-id", book.book_id);

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

// error from api
function handleResponse(response) {
  if (!response.ok) {
    return response.text().then((text) => {
      throw new Error(text || "An error occurred.");
    });
  }
  return response.json();
}

// ######################################---Search function---#######################################

// Add event listener to the form
document.getElementById("searchForm").addEventListener("submit", performSearch);

// Function to perform the search
function performSearch(event) {
  event.preventDefault(); // Prevent the default form submission

  const query = document.getElementById("searchInput").value.trim().toLowerCase();

  if (query) {
    fetchBooksFromApi(query); // Fetch books from the API
  } else {
    const numberOfBooks = 8; // Define how many books to fetch
    fetchBooks(`${baseUrl}/books?n=${numberOfBooks}`); // Fetch a default number of books
    document.getElementById("searchResults").innerHTML = "";
  }
}

// Function to fetch books from API based on search query
function fetchBooksFromApi(query) {
  fetch(`${baseUrl}/books?s=${query}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Fetched books:", data); // Log fetched books
      displayBooks(data); // Display the books fetched from API
    })
    .catch((error) => {
      console.error("Error fetching book data:", error); // Log errors
    });
}

function displayBooks(data) {
  const resultsDiv = document.getElementById("searchResults");
  resultsDiv.innerHTML = ""; // Clear previous results

  const bookList = document.getElementById("bookList"); // Grab the section where the id is bookList
  bookList.innerHTML = ""; // Remove all previous content in the bookList

  if (data.length > 0) {
    const fragment = new DocumentFragment();

    data.forEach((book) => {
      const bookCard = document.createElement("article");
      bookCard.classList.add("bookCard");
      bookCard.setAttribute("data-book-id", book.book_id);

      bookCard.innerHTML = `
        <h2>${book.title}</h2>
        <h3>${book.author}</h3>
        <p>${book.publishing_company}</p>
        <p>${book.publishing_year}</p>
        <button class="loanBook">Loan this book</button>
      `;

      fragment.appendChild(bookCard);
    });

    bookList.appendChild(fragment);
  } else {
    resultsDiv.innerHTML = "<p>No results found.</p>";
    resultsDiv.classList.add("space");
  }
}
