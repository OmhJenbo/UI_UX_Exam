window.onload = function () {
  window.scrollTo(0, document.body.scrollHeight);
};
// #####################################################
const BASE_URL = "http://localhost:8080"; // Replace with your actual API base URL
const authorCache = {}; // Cache for authors by letter
const bookCache = {}; // Cache for books by author ID

// Attach event listeners to letter buttons
document.querySelectorAll("#ul button").forEach((button) => {
  button.addEventListener("click", () => {
    const letter = button.dataset.letter;
    loadAuthors(letter);
  });
});

// Function to load authors whose names start with a specific letter
async function loadAuthors(letter) {
  const authorList = document.getElementById("authorList");
  const bookListByAuthor = document.getElementById("bookListByAuthor");
  bookListByAuthor.innerHTML = ""; // Clear the books list when a new letter is clicked

  // Check if authors for the letter are already cached
  if (authorCache[letter]) {
    console.log(`Cache hit for letter: ${letter}`, authorCache[letter]);
    displayAuthors(authorCache[letter]);
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/authors?letter=${letter}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch authors for letter: ${letter}`);
    }

    const authors = await response.json(); // Assume this returns an array of authors
    console.log(`Fetched authors for letter ${letter}:`, authors);

    if (!Array.isArray(authors)) {
      throw new Error(`Unexpected response format. Expected an array, got: ${typeof authors}`);
    }

    // Filter authors on the client side if API doesn't filter
    const filteredAuthors = authors.filter((author) => author.author_name && author.author_name.startsWith(letter));

    console.log(`Filtered authors for letter ${letter}:`, filteredAuthors);

    authorCache[letter] = filteredAuthors; // Cache the result
    displayAuthors(filteredAuthors);
  } catch (error) {
    console.error(error);
    authorList.innerHTML = `<li>Error loading authors for "${letter}".</li>`;
  }
}

// Function to display authors in the list
function displayAuthors(authors) {
  const authorList = document.getElementById("authorList");

  if (authors.length === 0) {
    authorList.innerHTML = `<li>No authors found for the selected letter.</li>`;
    return;
  }

  authorList.innerHTML = authors.map((author) => `<li><button data-author-id="${author.author_id}">${author.author_name}</button></li>`).join("");

  // Attach click event to each author
  document.querySelectorAll("#authorList li button").forEach((authorItem) => {
    authorItem.addEventListener("click", () => {
      const authorId = authorItem.dataset.authorId;
      const authorName = authorItem.textContent;
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
      throw new Error(`Failed to fetch books for author ID: ${authorId}`);
    }

    const books = await response.json(); // Assume this returns an array of books
    console.log(`Fetched books for author ID ${authorId}:`, books);

    if (!Array.isArray(books)) {
      throw new Error(`Unexpected response format. Expected an array, got: ${typeof books}`);
    }

    bookCache[authorId] = books; // Cache the result
    displayBooks(authorName, books);
  } catch (error) {
    console.error(error);
    bookListByAuthor.innerHTML = `<li>Error loading books for "${authorName}".</li>`;
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
