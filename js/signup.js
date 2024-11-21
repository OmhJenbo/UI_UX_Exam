import { baseUrl } from "../js/scripts.js";

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

document.querySelector("#formSignup").addEventListener("submit", e => {
    e.preventDefault();
    
    //Validate password, both must match
    const password = e.target.signupPassword.value.trim();
    const repeatPassword = e.target.signupRepeatPassword.value.trim();
    
    // If the password dont match
    if (password !== repeatPassword) {
        document.querySelector("#passwordError").showModal();
        return false;
    }

    //Sign up
    const firstName = e.target.signupName.value.trim();
    const lastName = e.target.signupLastName.value.trim();
    const email = e.target.signupEmail.value.trim();
    const adress = e.target.signupAdress.value.trim();
    const phone_number = e.target.signupTel.value.trim();
    const birth_date = e.target.signupDOB.value.trim();

    const params = new URLSearchParams();
    params.append("email", email);
    params.append("last_name", lastName);
    params.append("first_name", firstName);
    params.append("adress", adress);
    params.append("phone_number", phone_number);
    params.append("birth_date", birth_date);


    fetch(`${baseUrl}/users`, {
        method: "POST",
        body: params
    })
    .then(handleAPIError)
    .then(data => {
        if (Object.keys(data).includes("user_id")) {
            window.location.href = "../templates/login.html";
        } else {
            throw new Error(data.error);
        }
    })
    .catch(handleFetchCatchError);
    
});
// document.querySelector('.close').addEventListener('click', handleCloseDialogButton);