import {baseUrl} from './scripts.js';

// Check if the user is logged in and redirect if so
function checkLoginStatus() {
  const userId = sessionStorage.getItem('userId');
  if (userId) {
    window.location.href = '../templates/ebooks.html';
  }
}

// Handle API errors in a unified manner
async function handleAPIError(response) {
  if (response.ok) {
    return response.json();
  }
  const errorData = await response.json();
  throw new Error(errorData.error || "An unknown error occurred");
}

// Handle form submission using async/await for clarity
async function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const password = form.signupPassword.value.trim();
  const repeatPassword = form.signupRepeatPassword.value.trim();
  const passwordErrorDialog = document.querySelector("#passwordError");

  // Validate matching passwords
  if (password !== repeatPassword) {
    alert("Passwords do not match");
    return;
  }

  // Prepare form data
  const formData = new URLSearchParams({
    email: form.signupEmail.value.toLowerCase().trim(),
    password,
    first_name: form.signupName.value.trim(),
    last_name: form.signupLastName.value.trim(),
    address: form.signupAddress.value.trim(),
    phone_number: form.signupTel.value.trim(),
    birth_date: form.signupDOB.value.trim(),
  });

  try {
    const response = await fetch(`${baseUrl}/users`, {
      method: "POST",
      body: formData,
    });

    const data = await handleAPIError(response);

    if (data.user_id) {
      window.location.href = "../templates/login.html";
    } else {
      throw new Error(data.error || "An unknown error occurred");
    }
  } catch (error) {
    alert(error.message);
  }
}

// Initialize all event listeners once the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();

  const signupForm = document.querySelector("#formSignup");
  if (signupForm) {
    signupForm.addEventListener("submit", handleFormSubmit);
  }

  const closeButton = document.querySelector(".close");
  const passwordErrorDialog = document.getElementById("passwordError");
  if (closeButton && passwordErrorDialog) {
    closeButton.addEventListener("click", () => passwordErrorDialog.close());
  }
});
