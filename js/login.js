// Importing the base URL for the API from another JavaScript file
import { baseUrl } from "./scripts.js";

// Function to check if the user is logged in
function checkLoginStatus() {
    const userId = sessionStorage.getItem('userId'); // Retrieve user ID
    //If the user is already in session, it will be redirected to the ebooks page instead
    if (userId) {
        window.location.href = '../templates/ebooks.html'; // Redirect to ebooks
    }
}

// This function handles the API response and checks if the request was successful
const handleAPIError = (response) => {
    if (response.ok) {
        return response.json();
    }
    // Parse the error message from the API response and throw it
    return response.json().then((data) => {
        throw new Error(data.error || "An unknown error occurred");
    });
};

// Event listener for the form submission (when the user clicks the "Login" button)
document.querySelector("#formLogin").addEventListener("submit", (e) => {
    e.preventDefault(); 

    const email = e.target.loginEmail.value.toLowerCase().trim();
    const password = e.target.loginPassword.value.trim();

    const params = new URLSearchParams();
    params.append("email", email);
    params.append("password", password);

    // Make the POST request to the login endpoint
    fetch(`${baseUrl}/users/login`, {
        method: "post",
        body: params
    })
    .then(handleAPIError) // Check if the API response is successful
    .then(data => {
        // If the response contains "user_id", the login is successful
        if (Object.keys(data).includes("user_id")) {
            console.log(data);

            // Save the user's email in sessionStorage for later use (on the same browser session)
            sessionStorage.setItem("userEmail", email);
            // also saves the user_id in sessionStorage, used for loaning a book.
            sessionStorage.setItem("userId", data.user_id);

            // Redirects to a different page on successful login depending on the role of the user
            if (email === "admin.library@mail.com") {
                window.location.href = "../templates/admin.html";
            } else {
                window.location.href = "../templates/ebooks.html";
            }

        } else {
            throw new Error(data.error); // If the response has an error, throw an error
        }
    })
    .catch((error) => {
        // Display the error message as an alert (on wrong pw for example it will diplay wrong credentials)
        alert(error.message);
    });
});

// Check login status when the page loads
document.addEventListener('DOMContentLoaded', checkLoginStatus);
