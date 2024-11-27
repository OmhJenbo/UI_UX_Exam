// Importing the base URL for the API from another JavaScript file
import { baseUrl } from "./scripts.js";

// This function handles the API response and checks if the request was successful
const handleAPIError = (response) => {
    if (response.ok) {
        return response.json();
    }
    throw new Error('HTTP response error');
}

// This function handles any fetch errors (like network issues) and displays them on the page
export const handleFetchCatchError = (error) => {
    const errorSection = document.createElement('section'); // Create a new section element where the rror goes
    errorSection.innerHTML = `
        <header>    
            <h3>Error</h3> <!-- Display a header for the error message -->
        </header>
        <p>Dear user, we are truly sorry to inform that there was an error while getting the data</p>
        <p class="error">${error}</p> <!-- Show the specific error message -->
    `;
    document.querySelector('main').append(errorSection);
}

// Event listener for the form submission (when the user clicks the "Login" button)
document.querySelector("#formLogin").addEventListener("submit", (e) => {
    e.preventDefault(); 

    const email = e.target.loginEmail.value.trim();
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

            // Redirects to a different page on succesful login depending on the role of the user
            if (email === "admin.library@mail.com") {
                window.location.href = "../templates/admin.html";
            } else {
                window.location.href = "../index.html";
            }

        } else {
            throw new Error(data.error); // If the response has an error, throw an error
        }
    })
    .catch(handleFetchCatchError); // If there's an error in the fetch request, handle it here
});