import { baseUrl, handleAPIError } from "./utils.js";
const authorCache = {}; // Cache for authors by letter
const bookCache = {}; // Cache for books by author ID

// Initialize the app
function init() {
  // Attach a single event listener for letter buttons using event delegation
  document.getElementById("ul").addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const letter = e.target.dataset.letter;
      loadAuthors(letter);
    }
  });

  // Attach a single event listener for author buttons using event delegation
  document.getElementById("authorList").addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const authorId = e.target.dataset.authorId;
      const authorName = e.target.textContent;
      loadBooks(authorId, authorName);
    }
  });
}

// Helper function to set or update section headings
function setHeading(section, text) {
  let headingElement = section.querySelector("h2");
  if (!headingElement) {
    headingElement = document.createElement("h2");
    section.prepend(headingElement);
  }
  headingElement.textContent = text;
}

// Function to load authors whose names start with a specific letter
async function loadAuthors(letter) {
  const authorList = document.getElementById("authorList");
  const bookListByAuthor = document.getElementById("bookListByAuthor");
  const authorSection = document.getElementById("authorSection");
  const bookSection = document.getElementById("bookSection");

  bookListByAuthor.innerHTML = ""; // Clear the books list
  setHeading(bookSection, ""); // Clear the book section heading
  setHeading(authorSection, `Authors starting with "${letter}"`);

  // Check if authors for the letter are already cached
  if (authorCache[letter]) {
    console.log(`Cache hit for letter: ${letter}`, authorCache[letter]);
    displayAuthors(authorCache[letter], letter);
    return;
  }

  try {
    const response = await fetch(`${baseUrl}/authors`);
    const authors = await handleAPIError(response);

    // Validate and filter authors
    const filteredAuthors = Array.isArray(authors)
      ? authors.filter((author) => author.author_name?.startsWith(letter))
      : [];

    console.log(`Filtered authors for letter ${letter}:`, filteredAuthors);

    authorCache[letter] = filteredAuthors; // Cache the result
    displayAuthors(filteredAuthors, letter);
  } catch (error) {
    console.error("Error loading authors:", error);
    displayError(authorList, `Error loading authors for "${letter}".`);
  }
}

// Function to display authors in the list
function displayAuthors(authors, letter) {
  const authorList = document.getElementById("authorList");
  authorList.innerHTML =
    authors.length > 0
      ? authors
          .map((author) => `<li><button data-author-id="${author.author_id}">${author.author_name}</button></li>`)
          .join("")
      : `<li>No authors found for the selected letter "${letter}".</li>`;
}

// Function to load books by a specific author
async function loadBooks(authorId, authorName) {
  const bookListByAuthor = document.getElementById("bookListByAuthor");
  const bookSection = document.getElementById("bookSection");

  setHeading(bookSection, `Books by "${authorName}"`);

  // Check if books for the author are already cached
  if (bookCache[authorId]) {
    console.log(`Cache hit for author ID: ${authorId}`, bookCache[authorId]);
    displayBooks(authorName, bookCache[authorId]);
    return;
  }

  try {
    const response = await fetch(`${baseUrl}/books?a=${authorId}`);
    const books = await handleAPIError(response);

    const validatedBooks = Array.isArray(books) ? books : [];
    bookCache[authorId] = validatedBooks; // Cache the result
    displayBooks(authorName, validatedBooks);
  } catch (error) {
    console.error("Error loading books:", error);
    displayError(bookListByAuthor, `Error loading books for "${authorName}".`);
  }
}

// Function to display books in the list
function displayBooks(authorName, books) {
  const bookListByAuthor = document.getElementById("bookListByAuthor");
  bookListByAuthor.innerHTML =
    books.length > 0
      ? books.map((book) => `<li>${book.title}</li>`).join("")
      : `<li>No books found for "${authorName}".</li>`;
}

// Function to display error messages
function displayError(element, message) {
  element.innerHTML = `<li>${message}</li>`;
}

// Start the app
init();
