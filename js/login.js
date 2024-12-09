import { baseUrl, handleAPIError } from "./utils.js";

// Function to check if the user is logged in
function checkLoginStatus() {
    const userId = sessionStorage.getItem('userId'); // Retrieve user ID
    // If the user is already in session, it will be redirected to the ebooks page instead
    if (userId) {
        window.location.href = '../templates/ebooks.html'; // Redirect to ebooks
    }
}

document.querySelector("#formLogin").addEventListener("submit", (e) => {
    e.preventDefault(); // prevent the form from refreshing the page (default)

    const email = e.target.loginEmail.value.toLowerCase().trim(); // toLowerCase converts everything to lower case and trim cuts spaces before and after
    const password = e.target.loginPassword.value.trim();

    // Create a URLSearchParams object to send form-encoded data
    const params = new URLSearchParams();
    params.append("email", email);
    params.append("password", password);

    fetch(`${baseUrl}/users/login`, {
        method: "POST",
        body: params
    })
    .then(handleAPIError) // Use reusable error handling function
    .then((data) => {
        // If response contains the user_id, login will be successful
        if (data.user_id) {
            console.log(data);

            // Save the user's email and user_id in sessionStorage
            sessionStorage.setItem("userEmail", email);
            sessionStorage.setItem("userId", data.user_id);

            // Redirect to a different page on successful login depending on the role of the user
            if (email === "admin.library@mail.com") {
                window.location.href = "../templates/admin.html";
            } else {
                window.location.href = "../templates/ebooks.html";
            }
        } else {
            // If the response has an error message, throw an error
            throw new Error(data.error || "An unknown error occurred");
        }
    })
    .catch((error) => {
        // Display the error message as an alert (e.g., wrong password)
        alert(error.message);
    });
});

// Check login status when the page loads
document.addEventListener('DOMContentLoaded', checkLoginStatus);
