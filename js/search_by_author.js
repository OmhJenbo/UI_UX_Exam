// const BASE_URL = "http://localhost:8080"; // Replace with your actual API base URL
// const authorCache = {}; // Cache for authors by letter
// const bookCache = {}; // Cache for books by author ID

// // Initialize the app
// function init() {
//   // Attach event listeners to letter buttons using delegation
//   document.getElementById("ul").addEventListener("click", (event) => {
//     if (event.target.tagName === "BUTTON") {
//       const letter = event.target.dataset.letter;
//       loadAuthors(letter);
//     }
//   });
// }

// // Function to load authors whose names start with a specific letter
// async function loadAuthors(letter) {
//   const authorList = document.getElementById("authorList");
//   const bookListByAuthor = document.getElementById("bookListByAuthor");
//   bookListByAuthor.innerHTML = ""; // Clear the books list when a new letter is clicked

//   // Check if authors for the letter are already cached
//   if (authorCache[letter]) {
//     console.log(`Cache hit for letter: ${letter}`, authorCache[letter]);
//     displayAuthors(authorCache[letter], letter);
//     return;
//   }

//   try {
//     const response = await fetch(`${BASE_URL}/authors`);
//     if (!response.ok) {
//       throw new Error(`Failed to fetch authors. Status: ${response.status}`);
//     }

//     const authors = await response.json();
//     if (!Array.isArray(authors)) {
//       throw new Error(`Unexpected response format. Expected an array, got: ${typeof authors}`);
//     }

//     // Filter authors on the client side if needed
//     const filteredAuthors = authors.filter((author) => author.author_name && author.author_name.startsWith(letter));

//     console.log(`Filtered authors for letter ${letter}:`, filteredAuthors);

//     authorCache[letter] = filteredAuthors; // Cache the result
//     displayAuthors(filteredAuthors, letter);
//   } catch (error) {
//     console.error(error);
//     displayError(authorList, `Error loading authors for "${letter}".`);
//   }
// }

// // Function to display authors in the list
// function displayAuthors(authors, letter) {
//   const authorList = document.getElementById("authorList");

//   if (authors.length === 0) {
//     authorList.innerHTML = `<li>No authors found for the selected letter "${letter}".</li>`;
//     return;
//   }

//   authorList.innerHTML = authors.map((author) => `<li><button data-author-id="${author.author_id}">${author.author_name}</button></li>`).join("");

//   // Attach click event to author buttons using delegation
//   authorList.addEventListener("click", (event) => {
//     if (event.target.tagName === "BUTTON") {
//       const authorId = event.target.dataset.authorId;
//       const authorName = event.target.textContent;
//       loadBooks(authorId, authorName);
//     }
//   });
// }

// // Function to load books by a specific author
// async function loadBooks(authorId, authorName) {
//   const bookListByAuthor = document.getElementById("bookListByAuthor");

//   // Check if books for the author are already cached
//   if (bookCache[authorId]) {
//     console.log(`Cache hit for author ID: ${authorId}`, bookCache[authorId]);
//     displayBooks(authorName, bookCache[authorId]);
//     return;
//   }

//   try {
//     const response = await fetch(`${BASE_URL}/books?a=${authorId}`);
//     if (!response.ok) {
//       throw new Error(`Failed to fetch books for author ID: ${authorId}. Status: ${response.status}`);
//     }

//     const books = await response.json();
//     if (!Array.isArray(books)) {
//       throw new Error(`Unexpected response format. Expected an array, got: ${typeof books}`);
//     }

//     bookCache[authorId] = books; // Cache the result
//     displayBooks(authorName, books);
//   } catch (error) {
//     console.error(error);
//     displayError(bookListByAuthor, `Error loading books for "${authorName}".`);
//   }
// }

// // Function to display books in the list
// function displayBooks(authorName, books) {
//   const bookListByAuthor = document.getElementById("bookListByAuthor");

//   if (books.length === 0) {
//     bookListByAuthor.innerHTML = `<li>No books found for "${authorName}".</li>`;
//     return;
//   }

//   bookListByAuthor.innerHTML = books.map((book) => `<li>${book.title}</li>`).join("");
// }

// // Function to display error messages
// function displayError(element, message) {
//   element.innerHTML = `<li>${message}</li>`;
// }

// // Start the app
// init();

// ####################################The code above works##################################################

const BASE_URL = "http://localhost:8080"; // Replace with your actual API base URL
const authorCache = {}; // Cache for authors by letter
const bookCache = {}; // Cache for books by author ID

// Initialize the app
function init() {
  // Attach individual event listeners to letter buttons
  document.querySelectorAll("#ul button").forEach((button) => {
    button.addEventListener("click", () => {
      const letter = button.dataset.letter;
      loadAuthors(letter);
    });
  });
}

// Function to load authors whose names start with a specific letter
async function loadAuthors(letter) {
  const authorList = document.getElementById("authorList");
  const bookListByAuthor = document.getElementById("bookListByAuthor");
  bookListByAuthor.innerHTML = ""; // Clear the books list when a new letter is clicked

  // Check if authors for the letter are already cached
  if (authorCache[letter]) {
    console.log(`Cache hit for letter: ${letter}`, authorCache[letter]);
    displayAuthors(authorCache[letter], letter);
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/authors`);
    if (!response.ok) {
      throw new Error(`Failed to fetch authors. Status: ${response.status}`);
    }

    const authors = await response.json();
    if (!Array.isArray(authors)) {
      throw new Error(`Unexpected response format. Expected an array, got: ${typeof authors}`);
    }

    // Filter authors on the client side if needed
    const filteredAuthors = authors.filter((author) => author.author_name && author.author_name.startsWith(letter));

    console.log(`Filtered authors for letter ${letter}:`, filteredAuthors);

    authorCache[letter] = filteredAuthors; // Cache the result
    displayAuthors(filteredAuthors, letter);
  } catch (error) {
    console.error(error);
    displayError(authorList, `Error loading authors for "${letter}".`);
  }
}

// Function to display authors in the list
function displayAuthors(authors, letter) {
  const authorList = document.getElementById("authorList");

  if (authors.length === 0) {
    authorList.innerHTML = `<li>No authors found for the selected letter "${letter}".</li>`;
    return;
  }

  authorList.innerHTML = authors.map((author) => `<li><button data-author-id="${author.author_id}">${author.author_name}</button></li>`).join("");

  // Attach individual click events to author buttons
  document.querySelectorAll("#authorList button").forEach((button) => {
    button.addEventListener("click", () => {
      const authorId = button.dataset.authorId;
      const authorName = button.textContent;
      loadBooks(authorId, authorName);
    });
  });
}

// Function to load books by a specific author
async function loadBooks(authorId, authorName) {
  const bookListByAuthor = document.getElementById("bookListByAuthor");

  // Check if books for the author are already cached
  if (bookCache[authorId]) {
    console.log(`Cache hit for author ID: ${authorId}`, bookCache[authorId]);
    displayBooks(authorName, bookCache[authorId]);
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/books?a=${authorId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch books for author ID: ${authorId}. Status: ${response.status}`);
    }

    const books = await response.json();
    if (!Array.isArray(books)) {
      throw new Error(`Unexpected response format. Expected an array, got: ${typeof books}`);
    }

    bookCache[authorId] = books; // Cache the result
    displayBooks(authorName, books);
  } catch (error) {
    console.error(error);
    displayError(bookListByAuthor, `Error loading books for "${authorName}".`);
  }
}

// Function to display books in the list
function displayBooks(authorName, books) {
  const bookListByAuthor = document.getElementById("bookListByAuthor");

  if (books.length === 0) {
    bookListByAuthor.innerHTML = `<li>No books found for "${authorName}".</li>`;
    return;
  }

  bookListByAuthor.innerHTML = books.map((book) => `<li>${book.title}</li>`).join("");
}

// Function to display error messages
function displayError(element, message) {
  element.innerHTML = `<li>${message}</li>`;
}

// Start the app
init();
