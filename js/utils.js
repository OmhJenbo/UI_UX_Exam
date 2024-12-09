export const baseUrl = "http://localhost:8080";


export const handleAPIError = (response) => {
    if (response.ok) {
        return response.json();
    }
    // gets teh error message from the API response and throws it
    return response.json().then((data) => {
        throw new Error(data.error || "An unknown error occurred");
    });
};