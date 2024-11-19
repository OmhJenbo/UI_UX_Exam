// The search function is partially made with ChatGPT and knowlegde from classes

const baseUrl = "http://localhost:8080"; // The base URL for your API

// Add event listener to the form
document.getElementById("searchForm").addEventListener("submit", performSearch);

// Function to perform the search
function performSearch(event) {
  event.preventDefault(); // Prevent the default form submission

  const query = document.getElementById("searchInput").value.trim().toLowerCase();

  if (query) {
    fetchBooksFromApi(query); // Fetch books from the API
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
  resultsDiv.innerHTML = ""; // Clear previous results

  // Create a DocumentFragment to hold the elements temporarily
  const fragment = new DocumentFragment();

  if (data.length > 0) {
    data.forEach((book) => {
      const p = document.createElement("p");
      p.className = "result";
      p.textContent = `${book.title} by ${book.author}. Published by ${book.publishing_company} in ${book.publishing_year}`;
      fragment.appendChild(p); // Append to the fragment, not directly to the DOM
    });

    // Append all the elements in the fragment to the DOM at once
    resultsDiv.appendChild(fragment);
  } else {
    resultsDiv.innerHTML = "<p>No results found.</p>";
  }
}
