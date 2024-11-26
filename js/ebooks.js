// ######################################---Show/get 8 random books---#######################################
// Base URL for the API
const baseUrl = "http://localhost:8080";

// Wait for the HTML content to fully load before running the script
document.addEventListener("DOMContentLoaded", () => {
  const numberOfBooks = 8; // Define how many books to fetch
  fetchBooks(`${baseUrl}/books?n=${numberOfBooks}`); // Call fetchBooks function with the API URL in it
});

// Made a function to fetch books from the API URL
function fetchBooks(url) {
  fetch(url) // Send a GET request to the API
    .then((response) => {
      if (!response.ok) {
        // Check if the response is not okay
        throw new Error(`HTTP error! status: ${response.status}`); // in case it's not okay throw an error with the status code
      }
      return response.json(); // If everything worked fine we return the response as json
    })
    .then((books) => {
      // Once the books data is available we run the following
      const bookList = document.getElementById("bookList"); // Grab the section where the id is bookList
      bookList.innerHTML = ""; // Remove all previous content in the bookList so its empty; first DOM manipulation

      // Create a DocumentFragment to hold the book cards
      const fragment = document.createDocumentFragment();

      // Loop through each book and add it to the fragment
      books.forEach((book) => {
        // Create a div for the book card
        const bookCard = document.createElement("article");
        bookCard.classList.add("bookCard"); // Add a class to style the card

        // Add the HTML content for the book card
        bookCard.innerHTML = `
                    <h2>${book.title}</h2> <!-- Display the book's title -->
                    <h3>${book.author}</h3> <!-- Display the author's name -->
                    <p>${book.publishing_company}</p> <!-- Display the publishing company -->
                    <p>${book.publishing_year}</p> <!-- Display the year of publication -->
                    <button class="loanBook">Loan this book</button> <!-- Add a button for loaning the book -->
                `;

        // Append the book card to the fragment; this happens in memory, not in the DOM
        fragment.appendChild(bookCard);
      });

      // Append the entire fragment to the book list in one operation; second DOM manipulations
      bookList.appendChild(fragment);
    })
    .catch((error) => {
      // Handle any errors during the fetch
      console.error("Error fetching book data:", error); // Log the error in the console
    });
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

  // Once the books data is available we run the following
  const bookList = document.getElementById("bookList"); // Grab the section where the id is bookList
  bookList.innerHTML = ""; // Remove all previous content in the bookList so its empty; second DOM manipulation

  if (data.length > 0) {
    // Create a DocumentFragment to hold the book cards
    const fragment = new DocumentFragment();

    data.forEach((book) => {
      const bookCard = document.createElement("article");
      bookCard.classList.add("bookCard"); // Add a class to style the card

      // Here we create into the HTML what we want the div to contain
      bookCard.innerHTML = `
                   <h2>${book.title}</h2> <!-- Display the book's title -->
                   <h3>${book.author}</h3> <!-- Display the author's name -->
                   <p>${book.publishing_company}</p> <!-- Display the publishing company -->
                   <p>${book.publishing_year}</p> <!-- Display the year of publication -->
                   <button>Loan this book</button> <!-- Add a button for loaning the book -->
               `;

      // Appending to the fragment happens in memory; this happens in memory, not in the DOM
      fragment.appendChild(bookCard);
    });

    // Append all the elements in the fragment to the DOM at once; third DOM manipulation
    bookList.appendChild(fragment);
  } else {
    resultsDiv.innerHTML = "<p>No results found.</p>"; //Also a DOM manipulation
    resultsDiv.classList.add("space"); //Also a DOM manipulation
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
