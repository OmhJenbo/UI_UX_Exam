export const baseUrl = "http://localhost:8080";


export const handleAPIError = (response) => {
    if (response.ok) {
        return response.json();
    }

    // Attempt to parse the response JSON for an error message
    return response.json().then((data) => {
        const errorMessage = data.error || `HTTP error! Status: ${response.status}`;
        // Throw specific errors based on status codes
        if (response.status === 404) {
            throw new Error("Resource not found."); // Specific for 404
        }
        throw new Error(errorMessage); // Generic error
    });
};

export function checkLoginStatus(expectedUserId, redirectPage) {
    const userId = sessionStorage.getItem("userId");
    if (userId != expectedUserId) {
        alert("You must be authorized to access this page.");
        window.location.href = redirectPage;
    }
}