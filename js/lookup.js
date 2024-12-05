document.addEventListener("DOMContentLoaded", async () => {
    const BASE_URL = "http://localhost:8080";

    const endpoints = {
        books: `${BASE_URL}/books?n=5000`,
        authors: `${BASE_URL}/authors`,
        publishers: `${BASE_URL}/publishers`,
    };

    const containers = {
        books: document.getElementById("books"),
        authors: document.getElementById("authors"),
        publishers: document.getElementById("publishers"),
    };

    const fetchAndDisplay = async (url, container, idKey, labelKey) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error fetching data: ${response.statusText}`);
            const data = await response.json();

            // sort the lists by the ID number
            data.sort((a, b) => a[idKey] - b[idKey]);
            // create the fragment so we can end up appending only once
            const fragment = document.createDocumentFragment();
            //push the data to the fragment
            data.forEach(item => {
                const div = document.createElement("div");
                div.className = "item";
                div.textContent = `ID: ${item[idKey]} - ${labelKey}: ${item[labelKey]}`;
                fragment.appendChild(div);
            });

            // Append the fragment once to avoid multiple appends
            container.appendChild(fragment);
        } catch (error) {
            console.error(error);
        }
    };

    // wait for one fetch to finish before starting the next to avoid unpredictable behavior if they run at the same time
    await fetchAndDisplay(endpoints.books, containers.books, "book_id", "title");
    await fetchAndDisplay(endpoints.authors, containers.authors, "author_id", "author_name");
    await fetchAndDisplay(endpoints.publishers, containers.publishers, "publisher_id", "publisher_name");
});
