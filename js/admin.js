// Import shared utilities from utils.js
import { baseUrl, handleAPIError } from './utils.js';

// Function to check if the user is logged in as admin
function checkLoginStatus() {
  const userId = sessionStorage.getItem('userId'); // Take the userId from session

  if (userId != "2679") { // 2679 is the admin's userId
    alert('You must be an admin to access this page.');
    window.location.href = '../templates/login.html'; // Redirect to the login page
  }
}

// Add a book
document.querySelector("#form-add-book").addEventListener("submit", (e) => {
  e.preventDefault();

  // Caching the things put in the form to avoid repeated interactions with the DOM
  const form = e.target; // Cache the form itself to access its fields better
  const title = form.bookTitle.value.trim();
  const authorId = form.addAuthor.value.trim();
  const publisherId = form.addPublisher.value.trim();
  const publishingYear = form.addPublishingYear.value.trim();

  // Makes a FormData object to store the data in
  const formData = new FormData();
  formData.append("title", title);
  formData.append("author_id", authorId);
  formData.append("publisher_id", publisherId);
  formData.append("publishing_year", publishingYear);

  fetch(`${baseUrl}/admin/books`, {
    method: "POST",
    body: formData,
  })
    .then(handleAPIError) // Use reusable function to handle the API response
    .then((data) => {
      alert("Book added successfully!");
      form.reset(); // Reset the form
    })
    .catch((error) => {
      alert(error.message); // Display the error message as an alert
    });
});

// Add an author
document.querySelector("#form-add-author").addEventListener("submit", (e) => {
  e.preventDefault();

  // Caching the things put in the form to avoid repeated interactions with the DOM
  const form = e.target; // Cache the form itself to access its fields better
  const firstName = form.authorName.value.trim();
  const lastName = form.authorLastName.value.trim();

  // Makes a FormData object to store the data in
  const formData = new FormData();
  formData.append("first_name", firstName);
  formData.append("last_name", lastName);

  fetch(`${baseUrl}/admin/authors`, {
    method: "POST",
    body: formData,
  })
    .then(handleAPIError) // Use reusable function to handle the API response
    .then((data) => {
      alert("Author added successfully!");
      form.reset(); // Reset the form
    })
    .catch((error) => {
      alert(`Error adding author: ${error.message}`); // Display the error message as an alert
    });
});

// Add a publisher
document.querySelector("#form-add-publisher").addEventListener("submit", (e) => {
  e.preventDefault();

  // Caching the things put in the form to avoid repeated interactions with the DOM
  const form = e.target; // Cache the form itself to access its fields better
  const publisherName = form.publisherName.value.trim();

  // Makes a FormData object to store the data in
  const formData = new FormData();
  formData.append("name", publisherName);

  fetch(`${baseUrl}/admin/publishers`, {
    method: "POST",
    body: formData,
  })
    .then(handleAPIError) // Use reusable function to handle the API response
    .then((data) => {
      alert("Publisher added successfully!");
      form.reset(); // Reset the form
    })
    .catch((error) => {
      alert(`Error adding publisher: ${error.message}`); // Display the error message as an alert
    });
});

// Check login status when the page loads
document.addEventListener('DOMContentLoaded', checkLoginStatus);
