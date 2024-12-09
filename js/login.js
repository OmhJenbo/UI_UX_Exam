import { baseUrl } from "./scripts.js";

// Function to check if the user is logged in
function checkLoginStatus() {
    const userId = sessionStorage.getItem('userId'); // Retrieve user ID
    //If the user is already in session, it will be redirected to the ebooks page instead
    if (userId) {
        window.location.href = '../templates/ebooks.html'; // Redirect to ebooks
    }
}

// reusable function to handle API responses
const handleAPIError = (response) => {
    if (response.ok) {
        return response.json();
    }
    // gets teh error message from the API response and throws it
    return response.json().then((data) => {
        throw new Error(data.error || "An unknown error occurred");
    });
};

document.querySelector("#formLogin").addEventListener("submit", (e) => {
    e.preventDefault(); // prevent the form from refreshing the page (default)

    const email = e.target.loginEmail.value.toLowerCase().trim(); // tolowercase converts everything to lower case and trim cuts spaces before and after
    const password = e.target.loginPassword.value.trim();

    // create a urlsearchparams object to send form-encoded data
    // urlsearchparams works like a "form data container," where key-value pairs are added
    // i tried converting to json, didnt work im unsure if its because we pass it like that in signup. Do we have to do that because of hte api???
    const params = new URLSearchParams();
    params.append("email", email);
    params.append("password", password);

    fetch(`${baseUrl}/users/login`, {
        method: "post",
        body: params
    })
    .then(handleAPIError) // using the reponse chec kfunction from above
    .then(data => {
        // if response contains the user_id login will be successful
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
