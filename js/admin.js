const baseUrl = "http://localhost:8080";

// Function to check if the user is logged in as admin
function checkLoginStatus() {
  const userId = sessionStorage.getItem('userId'); // Take the userId from session

  if (userId != "2679") { // 2679 is the admins userId
    alert('You must be an admin to access this page.');
    window.location.href = '../templates/login.html'; // Redirect to the login page
  }
}

// reusable function to handle API responses
const handleAPIError = (response) => {
  if (response.ok) {
    return response.json();
  }
  throw new Error(`HTTP error! Status: ${response.status}}`);
};

// add a book
document.querySelector("#form-add-book").addEventListener("submit", (e) => {
  e.preventDefault();

  // caching the things put in the form to avoid repeated interactions with the dom
  const form = e.target; // cache the form itself to access its fields better
  const title = form.bookTitle.value.trim();
  const authorId = form.addAuthor.value.trim();
  const publisherId = form.addPublisher.value.trim();
  const publishingYear = form.addPublishingYear.value.trim();

  // makes a formdata object to store the data in
  const formData = new FormData();
  formData.append("title", title);
  formData.append("author_id", authorId);
  formData.append("publisher_id", publisherId);
  formData.append("publishing_year", publishingYear);

  fetch(`${baseUrl}/admin/books`, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      // if the response is not ok display the error returned as json
      if (!response.ok) {
        return response.json().then((error) => {
          throw new Error(error.error || "An unknown error occurred");
        });
      }
      // return the json data if the request is successful
      return response.json();
    })
    .then((data) => {
      alert("Book added successfully!");
      form.reset(); // reset the form
    })
    .catch((error) => {
      alert(error.message); // display the error message as an alert
    });
});

// add an author
document.querySelector("#form-add-author").addEventListener("submit", (e) => {
  e.preventDefault();

  // caching the things put in the form to avoid repeated interactions with the dom
  const form = e.target; // cache the form itself to access its fields better
  const firstName = form.authorName.value.trim(); 
  const lastName = form.authorLastName.value.trim();

  // makes a formdata object to store the data in
  const formData = new FormData();
  formData.append("first_name", firstName);
  formData.append("last_name", lastName);

  fetch(`${baseUrl}/admin/authors`, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      // if the response is not ok throw an error
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // return the json data if the request is successful
      return response.json();
    })
    .then((data) => {
      alert("Author added successfully!");
      form.reset(); // reset the form
    })
    .catch((error) => {
      alert(`Error adding author: ${error.message}`); // display the error message as an alert
    });
});

// add a publisher
document.querySelector("#form-add-publisher").addEventListener("submit", (e) => {
  e.preventDefault();

  // caching the things put in the form to avoid repeated interactions with the dom
  const form = e.target; // cache the form itself to access its fields better
  const publisherName = form.publisherName.value.trim();

  // makes a formdata object to store the data in
  const formData = new FormData();
  formData.append("name", publisherName)

  fetch(`${baseUrl}/admin/publishers`, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      // if the response is not ok throw an error
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // return the json data if the request is successful
      return response.json();
    })
    .then((data) => {
      alert("Publisher added successfully!");
      form.reset(); // reset the form
    })
    .catch((error) => {
      alert(`Error adding publisher: ${error.message}`); // display the error message as an alert
    });
});

// Check login status when the page loads
document.addEventListener('DOMContentLoaded', checkLoginStatus);