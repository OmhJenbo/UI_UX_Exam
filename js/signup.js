
import { baseUrl, handleAPIError, checkLoginStatus } from './utils.js';

document.addEventListener("DOMContentLoaded", () => {
    checkLoginStatus(null, "../templates/ebooks.html");

    const signupForm = document.querySelector("#formSignup");
    signupForm.addEventListener("submit", handleFormSubmit);
});

async function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const password = form.signupPassword.value.trim();
    const repeatPassword = form.signupRepeatPassword.value.trim();

    if (password !== repeatPassword) {
        alert("Passwords do not match");
        return;
    }

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
        }
    } catch (error) {
        alert(error.message);
    }
}
