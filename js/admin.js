const baseUrl = "http://localhost:8080";

// Reusable function to handle API responses
const handleAPIError = (response) => {
  if (response.ok) {
    return response.json();
  }
  throw new Error(`HTTP error! Status: ${response.status}}`);
};

export const handleFetchCatchError = (error) => {
  const errorSection = document.createElement("section");
  errorSection.innerHTML = `
    <header>
      <h3>Error</h3>
    </header>
    <p>There was an error while processing your request:</p>
    <p class="error">${error.message}</p>
  `;
  document.querySelector("main").append(errorSection);
};

document.querySelector("#addBookForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("title", e.target.bookTitle.value.trim());
  formData.append("author_id", e.target.addAuthor.value.trim());
  formData.append("publisher_id", e.target.addPublisher.value.trim());
  formData.append("publishing_year", e.target.addPublishingYear.value.trim());

  fetch(`${baseUrl}/admin/books`, {
    // Remove misplaced parenthesis
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.error}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Book added successfully:", data);
      alert("Book added successfully!");
      e.target.reset();
    })
    .catch((error) => {
      console.error("Error adding book:", error);
      alert(`Error adding book: ${error.message}`);
    });
});
