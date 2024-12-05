//gets the userid from sessionStorage
const userId = () => {
    return sessionStorage.getItem("userId") || 0;
}
// function where it removes the userId and userEmail, and redirects to index.html
const logout = () => {
    sessionStorage.removeItem("userId"); // Remove user ID
    sessionStorage.removeItem("userEmail"); // Remove user email

    window.location.href = "../templates/login.html";
}

// Listens if the user is logged in or not, and whether the logout button should be displayed or not
if (userId() == 0) {
    document.querySelector("#login").classList.remove("hidden");
    document.querySelector("#signup").classList.remove("hidden");
    document.querySelector("#logout").classList.add("hidden");
} else {
    document.querySelector("#login").classList.add("hidden");
    document.querySelector("#signup").classList.add("hidden");
    document.querySelector("#logout").classList.remove("hidden");
}
// When the logout button is clicked it goes to the function logout
document.getElementById("logout").addEventListener("click", () => logout());