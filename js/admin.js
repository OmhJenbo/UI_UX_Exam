// Check if the user is logged in and if they are the admin
const userEmail = sessionStorage.getItem("userEmail");

if (userEmail !== "admin.library@mail.com") {
    // If the user is not an admin, redirect them to the login page (or another page)
    window.location.href = "../templates/login.html"; // Change to your actual login page URL
}

// Event listener for form submission
document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();

    // Capture the form data
    const bookTitle = e.target.bookTitle.value.trim();
    const addAuthor = e.target.addAuthor.value.trim();
    const addPublisher = e.target.addPublisher.value.trim();
    const addPublishingYear = e.target.addPublishingYear.value.trim();

    // Prepare the data to send to the API
    const bookData = {
        title: bookTitle,
        author: addAuthor,
        publisher: addPublisher,
        publishingYear: addPublishingYear
    };

    // Make the POST request to the API to add a new book
    fetch(`${baseUrl}/admin/books`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json", // Sending JSON data
        },
        body: JSON.stringify(bookData) // Convert the data to JSON format
    })
    .then(response => response.json()) // Parse the response
    .then(data => {
        if (data.success) {
            // If the book was added successfully, show a success message
            alert("Book added successfully!");
            // Optionally, reset the form or redirect the admin to another page
            document.querySelector("form").reset(); // Reset the form fields
        } else {
            throw new Error(data.error); // Handle any errors returned by the API
        }
    })
    .catch(error => {
        // If there’s an error in the fetch request, show an error message
        alert(`Error: ${error.message}`);
    });
});
