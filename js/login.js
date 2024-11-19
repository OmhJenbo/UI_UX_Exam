import { baseUrl } from "./scripts.js";


const handleAPIError = (response) => {
    if (response.ok) {
        return response.json();
    }
    throw new Error('HTTP response error');
}

/* Handles an error in a fetch request's displaying an error message on the page */
export const handleFetchCatchError = (error) => {
    const errorSection = document.createElement('section');
    errorSection.innerHTML = `
        <header>    
            <h3>Error</h3>
        </header>
        <p>Dear user, we are truly sorry to inform that there was an error while getting the data</p>
        <p class="error">${error}</p>
    `;
    document.querySelector('main').append(errorSection);
}

document.querySelector("#formLogin").addEventListener("submit", (e) =>{
    e.preventDefault();

    // Trims the value of the input field
    const email = e.target.loginEmail.value.trim();
    const password = e.target.loginPassword.value.trim();

    const params = new URLSearchParams();
    params.append("email", email);
    params.append("password", password);

    fetch(`${baseUrl}/users/login`, {
        method: "post",
        body: params
    })
    .then(handleAPIError)
    .then(data => {
        //check for "user_id" in the response
        if (Object.keys(data).includes("user_id")) {
            sessionStorage.setItem("")

        } else {
            throw new Error(data.error);
        }
    })
    .catch(handleFetchCatchError)
});