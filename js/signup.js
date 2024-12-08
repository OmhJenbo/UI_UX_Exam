// The base URL for API requests
const baseUrl = "http://localhost:8080";

// Redirects the user to a specified URL
const redirectTo = (url) => {
  window.location.href = url;
};

// Shows a modal dialog for user messages or errors
const showModal = (selector) => {
  const modal = document.querySelector(selector);
  if (modal) modal.showModal();
};

// Closes a displayed modal dialog
const closeModal = (selector) => {
  const modal = document.querySelector(selector);
  if (modal) modal.close();
};

// Checks if the user is already logged in by looking for a userId in session storage.
// If found, the user is redirected to the ebooks page.
const checkLoginStatus = () => {
  if (sessionStorage.getItem("userId")) {
    redirectTo("../templates/ebooks.html");
  }
};

// Handles API responses by checking for success or throwing an error if something went wrong.
// On success, parses and returns the JSON response; on error, retrieves the message and throws it.
const handleAPIError = async (response) => {
  if (response.ok) return response.json();
  const errorData = await response.json();
  throw new Error(errorData.error || "An unknown error occurred");
};

// Handles the submission of the signup form.
// It ensures that both password fields match, prepares the data, and sends it to the server.
// On successful signup, redirects the user to the login page.
const handleFormSubmit = (event) => {
  event.preventDefault(); // Prevent default form submission behavior

  const form = event.target;
  const password = form.signupPassword.value.trim();
  const repeatPassword = form.signupRepeatPassword.value.trim();

  // Check if the passwords match; if not, show an error modal
  if (password !== repeatPassword) {
    showModal("#passwordError");
    return;
  }

  // Convert form data into URL-encoded parameters
  const formData = new URLSearchParams(
    Array.from(new FormData(form)).reduce((acc, [key, value]) => {
      acc[key] = value.trim();
      return acc;
    }, {})
  );

  // Send a POST request to the API to create a new user
  fetch(`${baseUrl}/users`, {
    method: "POST",
    body: formData,
  })
    .then(handleAPIError)
    .then((data) => {
      // If a user_id is returned, signup was successful; redirect to the login page
      if (data.user_id) {
        console.log("Signup successful, redirecting...");
        redirectTo("../templates/login.html");
      } else {
        // If no user_id is returned, throw an error
        throw new Error(data.error || "Unexpected response structure");
      }
    })
    // If any error occurs, alert the user
    .catch((error) => alert(error.message));
};

// Sets up event listeners for the signup form and modal close buttons
const initializeEventListeners = () => {
  const signupForm = document.querySelector("#formSignup");
  if (signupForm) signupForm.addEventListener("submit", handleFormSubmit);

  // Add click event listeners to any element with the ".close" class to close the error modal
  document.querySelectorAll(".close").forEach((button) =>
    button.addEventListener("click", () => closeModal("#passwordError"))
  );
};

// When the page finishes loading:
// 1. Check if the user is already logged in
// 2. Initialize form and modal event listeners
document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();
  initializeEventListeners();
});
