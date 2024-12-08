const baseUrl = "http://localhost:8080";

// Function to check if the user is logged in
function checkLoginStatus() {
  const userId = sessionStorage.getItem('userId'); // Retrieve user ID
  //If the user is already in session, it will be redirected to the ebooks page instead
  if (userId) {
      window.location.href = '../templates/ebooks.html'; // Redirect to ebooks
  }
}

/**
 * Handles the first .then() in a fetch request,
 * raising an error if the response code is not a 2xx
 */
const handleAPIError = (response) => {
  console.log("Raw response:", response);
  if (response.ok) {
    return response.json();
  }
  // Parse the error message from the response JSON and throw it
  return response.json().then((data) => {
    throw new Error(data.error || "An unknown error occurred");
  });
};

document.querySelector("#formSignup").addEventListener("submit", (e) => {
  e.preventDefault();

  // Validate password, both must match
  const password = e.target.signupPassword.value.trim();
  const repeatPassword = e.target.signupRepeatPassword.value.trim();

  // If the passwords don't match
  if (password !== repeatPassword) {
    document.querySelector("#passwordError").showModal();
    return false;
  }

  // Sign up in the API
  const firstName = e.target.signupName.value.trim();
  const lastName = e.target.signupLastName.value.trim();
  const email = e.target.signupEmail.value.trim();
  const address = e.target.signupAddress.value.trim();
  const phone_number = e.target.signupTel.value.trim();
  const birth_date = e.target.signupDOB.value.trim();
  const passworded = e.target.signupPassword.value.trim();

  const params = new URLSearchParams();
  params.append("email", email);
  params.append("password", passworded);
  params.append("first_name", firstName);
  params.append("last_name", lastName);
  params.append("address", address);
  params.append("phone_number", phone_number);
  params.append("birth_date", birth_date);

  console.log("Params er", params);

  fetch(`${baseUrl}/users`, {
    method: "POST",
    body: params,
  })
    .then(handleAPIError)
    .then((data) => {
      console.log("Parsed data:", data);
      // Check for key "user_id" in response
      if (Object.keys(data).includes("user_id")) {
        console.log("Signup successful, redirecting...");
        window.location.href = "../templates/login.html";
      } else {
        console.warn("Unexpected response structure:", data);
        throw new Error(data.error);
      }
    })
    .catch((error) => {
      // Display the API error as an alert
      alert(error.message);
    });
});

// Function to close the dialog
document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("passwordError").close(); // Closes the dialog
});

// Check login status when the page loads
document.addEventListener('DOMContentLoaded', checkLoginStatus);
