const baseUrl = "http://localhost:8080";

// Function to check if the user is logged in as admin
function checkLoginStatus() {
  const userId = sessionStorage.getItem('userId'); // Retrieve user ID

  if (userId != "2679") {
    alert('You must be an admin to access this page.');
    window.location.href = '../templates/login.html'; // Redirect to the login page
  }
}

// Reusable function to handle API responses
const handleAPIError = (response) => {
  if (response.ok) {
    return response.json();
  }
  throw new Error(`HTTP error! Status: ${response.status}}`);
};

export const handleFetchCatchError = (error) => {
  const errorSection = document.createElement("section");
  errorSection.innerHTML = `
    <header>
      <h3>Error</h3>
    </header>
    <p>There was an error while processing your request:</p>
    <p class="error">${error.message}</p>
  `;
  document.querySelector("main").append(errorSection);
};

document.querySelector("#form-add-book").addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("title", e.target.bookTitle.value.trim());
  formData.append("author_id", e.target.addAuthor.value.trim());
  formData.append("publisher_id", e.target.addPublisher.value.trim());
  formData.append("publishing_year", e.target.addPublishingYear.value.trim());

  fetch(`${baseUrl}/admin/books`, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.error}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Book added successfully:", data);
      alert("Book added successfully!");
      e.target.reset();
    })
    .catch((error) => {
      console.error("Error adding book:", error);
      alert(`Error adding book: ${error.message}`);
    });
});

// add an author
document.querySelector("#form-add-author").addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("first_name", e.target.authorName.value.trim());
  formData.append("last_name", e.target.authorLastName.value.trim());

  fetch(`${baseUrl}/admin/authors`, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Author added successfully:", data);
      alert("Author added successfully!");
      e.target.reset();
    })
    .catch((error) => {
      console.error("Error adding author:", error);
      alert(`Error adding author: ${error.message}`);
    });
});

// add a publisher
document.querySelector("#form-add-publisher").addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", e.target.publisherName.value.trim());

  fetch(`${baseUrl}/admin/publishers`, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Publisher added successfully:", data);
      alert("Publisher added successfully!");
      e.target.reset();
    })
    .catch((error) => {
      console.error("Error adding publisher:", error);
      alert(`Error adding publisher: ${error.message}`);
    });
});

// Check login status when the page loads
document.addEventListener('DOMContentLoaded', checkLoginStatus);