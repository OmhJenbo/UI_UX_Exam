
// Burger menu
document.addEventListener("DOMContentLoaded", () => {
    const burgerMenu = document.querySelector(".burger-menu");
    const navLinks = document.querySelector("#navlinks");

    burgerMenu.addEventListener("click", () => {
        burgerMenu.classList.toggle("active");
        navLinks.classList.toggle("active");
    });
});

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

/// Logout ///
// Listens if the user is logged in or not, and whether the logout button should be displayed or not
if (userId() == 0) {
  document.querySelector("#login").classList.remove("hidden");
  document.querySelector("#signup").classList.remove("hidden");
  document.querySelector("#signup").classList.add("borderTop");
  document.querySelector("#logout").classList.add("hidden");
  document.querySelector("#settings").classList.add("hidden");
} 
else if (userId() == "2679") {
  document.querySelector("#login").classList.add("hidden");
  document.querySelector("#signup").classList.add("hidden");
  document.querySelector("#logout").classList.add("borderTop");
  document.querySelector("#logout").classList.remove("hidden");
  document.querySelector("#settings").classList.remove("hidden");
  document.querySelector("#admin").classList.remove("hidden");
}

else {
  document.querySelector("#login").classList.add("hidden");
  document.querySelector("#signup").classList.add("hidden");
  document.querySelector("#logout").classList.add("borderTop");
  document.querySelector("#logout").classList.remove("hidden");
  document.querySelector("#settings").classList.remove("hidden");
}
// When the logout button is clicked it goes to the function logout
document.getElementById("logout").addEventListener("click", () => logout());
