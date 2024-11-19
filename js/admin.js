// Check if the user is logged in and if they are the admin
const userEmail = sessionStorage.getItem("userEmail");

if (userEmail !== "admin.library@mail.com") {
    // If the user is not an admin, redirect them to the login page (or another page)
    window.location.href = "../templates/login.html"; // Change to your actual login page URL
}