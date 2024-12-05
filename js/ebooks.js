// ######################################---Show/get 8 random books---#######################################
// Base URL for the API
const baseUrl = "http://localhost:8080";

document.addEventListener("DOMContentLoaded", () => {
  const numberOfBooks = 8;
  fetchBooks(`${baseUrl}/books?n=${numberOfBooks}`);

  const bookList = document.getElementById("bookList");
  if (bookList) {
    bookList.addEventListener("click", handleLoanClick);
  }
});

// Handle click event for loaning a book
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
      
      // Keeping the Loaned button as loaned even after u search for new books or refetch the same books. saved in sessionstorage
      const loanedBooks = JSON.parse(sessionStorage.getItem("loanedBooks")) || {};
      loanedBooks[bookId] = Date.now(); // save the timestamp of the loan so we can remove the class for loaned after 30 days
      sessionStorage.setItem("loanedBooks", JSON.stringify(loanedBooks));

      console.log(`user_id: ${userId} successfully loaned book_id: ${bookId}`);

    // Alert to diplsay to the user to check email
    alert("The book has been successfully loaned. Please check your email for further details.");
    })
    .catch((error) => {
      console.error(error.message);
      alert(error.message || "Failed to loan the book.");
    });
}

// Fetch books and render them
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

  bookList.innerHTML = ""; // Clear existing content

  books.forEach((book) => {
    if (!book.book_id) {
      console.warn("Skipping book with missing ID:", book);
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

// Handle API response
function handleResponse(response) {
  if (!response.ok) {
    return response.text().then((text) => {
      throw new Error(text || "An error occurred.");
    });
  }
  return response.json();
}

// ######################################---Search function---#######################################

// The search function is partially made with ChatGPT and knowlegde from classes

// Add event listener to the form
document.getElementById("searchForm").addEventListener("submit", performSearch);

// Function to perform the search
function performSearch(event) {
  event.preventDefault(); // Prevent the default form submission

  const query = document.getElementById("searchInput").value.trim().toLowerCase();

  if (query) {
    fetchBooksFromApi(query); // Fetch books from the API
    // fetchBooksFromApiByAuthor(query); // Fetch books from the API by auhtor
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
      // Check if the response is OK (status code in the range 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Parse the response JSON and return it
      return response.json();
    })
    .then((data) => {
      // Handle the data (display books)
      console.log("Fetched books:", data);
      displayBooks(data); // Display the books fetched from API
    })
    .catch((error) => {
      // Handle errors
      console.error("Error fetching book data:", error);
    });
}

function displayBooks(data) {
  const resultsDiv = document.getElementById("searchResults");
  resultsDiv.innerHTML = ""; // Clear previous results; first DOM manipulation

  // Once the books data is available, we run the following
  const bookList = document.getElementById("bookList"); // Grab the section where the id is bookList
  bookList.innerHTML = ""; // Remove all previous content in the bookList so it's empty; second DOM manipulation

  const loanedBooks = JSON.parse(sessionStorage.getItem("loanedBooks")) || {};

  if (data.length > 0) {
    // Create a DocumentFragment to hold the book cards
    const fragment = new DocumentFragment();

    data.forEach((book) => {
      const bookCard = document.createElement("article"); // Create an article element for each book
      bookCard.classList.add("bookCard"); // Add a class to style the card
      bookCard.setAttribute("data-book-id", book.book_id); // Set the book's unique ID as a data attribute

      // get the timestamp of when the book was loaned from sessionStorage
      const loanTimestamp = loanedBooks[book.book_id];

      // check if the book is still loaned by verifying the timestamp exists and if less than 30 days have passed
      const isLoaned = loanTimestamp && (Date.now() - loanTimestamp < 2592000000); // 2592000000 ms = 30 days

      // set the button text based on whether the book is loaned or not
      const buttonText = isLoaned ? "Loaned" : "Loan this book";

      // set the button's CSS class based on whether the book is loaned or not
      const buttonClass = isLoaned ? "loanBook loanedButton" : "loanBook";

      // if the book was loaned but 30 days have passed, remove it from sessionStorage
      if (!isLoaned && loanTimestamp) {
        delete loanedBooks[book.book_id]; // Remove the expired loan from the loanedBooks object
        sessionStorage.setItem("loanedBooks", JSON.stringify(loanedBooks)); // Save the updated loanedBooks object back to sessionStorage
      }

      // Here we create into the HTML what we want the div to contain
      bookCard.innerHTML = `
        <h2>${book.title}</h2> <!-- Display the book's title -->
        <h3>${book.author}</h3> <!-- Display the author's name -->
        <p>${book.publishing_company}</p> <!-- Display the publishing company -->
        <p>${book.publishing_year}</p> <!-- Display the year of publication -->
        <button class="${buttonClass}">${buttonText}</button> <!-- Add a button for loaning the book -->
      `; // Added the classes to the button here so it works after the search too

      // Appending to the fragment happens in memory; this happens in memory, not in the DOM
      fragment.appendChild(bookCard);
    });

    // Append all the elements in the fragment to the DOM at once; third DOM manipulation
    bookList.appendChild(fragment);
  } else {
    resultsDiv.innerHTML = "<p>No results found.</p>"; // If no books are found, display a message
    resultsDiv.classList.add("space"); // Add a CSS class for spacing
  }
}

// ##################################--Working on search by Author--##########################################

// // Function to fetch books from API based on search query
// function fetchBooksFromApiByAuthor(query) {
//   fetch(`${baseUrl}/books?a=${query}`)
//     .then((response) => {
//       // Check if the response is OK (status code in the range 200-299)
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       // Parse the response JSON and return it
//       return response.json();
//     })
//     .then((data) => {
//       // Handle the data (display books)
//       console.log("Fetched books:", data);
//       displayBooks(data); // Display the books fetched from API
//     })
//     .catch((error) => {
//       // Handle errors
//       console.error("Error fetching book data:", error);
//     });
// }

// function displayBooks(data) {
//   const resultsDiv = document.getElementById("searchResults");
//   resultsDiv.innerHTML = ""; // Clear previous results; first DOM manipulation

//   // Once the books data is available we run the following
//   const bookList = document.getElementById("bookList"); // Grab the section where the id is bookList
//   bookList.innerHTML = ""; // Remove all previous content in the bookList so its empty; second DOM manipulation

//   if (data.length > 0) {
//     // Create a DocumentFragment to hold the book cards
//     const fragment = new DocumentFragment();

//     data.forEach((book) => {
//       const bookCard = document.createElement("article");
//       bookCard.classList.add("bookCard"); // Add a class to style the card

//       // Here we create into the HTML what we want the div to contain
//       bookCard.innerHTML = `
//                    <h2>${book.title}</h2> <!-- Display the book's title -->
//                    <h3>${book.author}</h3> <!-- Display the author's name -->
//                    <p>${book.publishing_company}</p> <!-- Display the publishing company -->
//                    <p>${book.publishing_year}</p> <!-- Display the year of publication -->
//                    <button>Loan this book</button> <!-- Add a button for loaning the book -->
//                `;

//       // Appending to the fragment happens in memory; this happens in memory, not in the DOM
//       fragment.appendChild(bookCard);
//     });

//     // Append all the elements in the fragment to the DOM at once; third DOM manipulation
//     bookList.appendChild(fragment);
//   } else {
//     resultsDiv.innerHTML = "<p>No results found.</p>"; //Also a DOM manipulation
//     resultsDiv.classList.add("space"); //Also a DOM manipulation
//   }
// }
