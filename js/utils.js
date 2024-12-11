export const baseUrl = "http://localhost:8080";

export const handleAPIError = (response) => {
    if (response.ok) { // if everything goes perfectly display the message we get from the api (can see it in postman)
        return response.json();
    }

    return response.json().then((data) => {
        throw new Error(data.error || `There was an error try again in a moment`); // otherwise display the response from the api, since the error messages already describe what happens well.
    }); // if we can't for any reason get that data we have our own defined error message
};


export function checkLoginStatus(expectedUserId, redirectPage) {
    const userId = sessionStorage.getItem("userId");
    if (userId != expectedUserId) {
        alert("You must be authorized to access this page.");
        window.location.href = redirectPage;
    }
}