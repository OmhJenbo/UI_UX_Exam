// Export the base URL for the API so it can be reused
export const baseUrl = "http://localhost:8080";

// Wait for the HTML content to fully load before running the script
document.addEventListener("DOMContentLoaded", () => {
    const numberOfBooks = 12; // Define how many books to fetch
    fetchBooks(`${baseUrl}/books?n=${numberOfBooks}`); // Call fetchBooks function with the API URL in it
});

// Made a function to fetch books from the API URL
function fetchBooks(url) {
    fetch(url) // Send a GET request to the API
        .then(response => {
            if (!response.ok) { // Check if the response is not okay
                throw new Error(`HTTP error! status: ${response.status}`); // in case it's not okay throw an error with the status code
            }
            return response.json(); // If everything worked fine we return the response as json
        })
        .then(books => { // Once the books data is available we run the following
            const bookList = document.getElementById("bookList"); // Grab the section where the id is bookList
            bookList.innerHTML = ""; // Remove all previous content in the bookList so its empty

            // Loop through each book and do the following for each of them
            books.forEach(book => {
                // Create a div for the book card
                const bookCard = document.createElement("div");
                bookCard.classList.add("bookCard"); // Add a class to style the card

                // Here we create into the HTML what we want the div to contain
                bookCard.innerHTML = `
                    <h2>${book.title}</h2> <!-- Display the book's title -->
                    <h3>${book.author}</h3> <!-- Display the author's name -->
                    <p>${book.publishing_company}</p> <!-- Display the publishing company -->
                    <p>${book.publishing_year}</p> <!-- Display the year of publication -->
                    <button>Loan this book</button> <!-- Add a button for loaning the book -->
                `;

                // Then we append so the bookList gets all the books
                bookList.append(bookCard);
            });
        })
        .catch(error => { // Handle any errors during the fetch
            console.error("Error fetching book data:", error); // Log the error in the console
        });
}
