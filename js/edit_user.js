document.addEventListener("DOMContentLoaded", async () => {
    // Base URL for the user API
    const API_BASE_URL = "http://127.0.0.1:8080/users";

    // Reference to the profile form
    const formProfile = document.getElementById("formProfile");

    // Retrieve the user ID from sessionStorage (stored after a user logs in or registers)
    const userId = sessionStorage.getItem("userId");

    // If no user ID is found, we stop and alert the user
    if (!userId) {
        alert("User ID not found in session storage.");
        return;
    }

    // Cache references to all form input elements to avoid repeated DOM lookups
    const profileInputs = {
        first_name: document.getElementById("profileName"),
        last_name: document.getElementById("profileLastName"),
        email: document.getElementById("profileEmail"),
        address: document.getElementById("profileAddress"),
        phone_number: document.getElementById("profileTel"),
        birth_date: document.getElementById("profileDob"),
    };

    // This will store the current user data fetched from the server
    let currentData = {};

    // Fetches user data from the server using the stored userId
    async function fetchUserData() {
        const response = await fetch(`${API_BASE_URL}/${userId}`);
        if (!response.ok) {
            // If the response is not OK, throw an error to be caught later
            throw new Error(`Failed to load user data: ${response.status} ${response.statusText}`);
        }
        // Parse and return the JSON response (user profile data)
        return response.json();
    }

    // Fills the form fields with the data received from the server
    function populateFormFields(data) {
        currentData = data; // Store the fetched data globally for later comparison
        Object.entries(profileInputs).forEach(([key, input]) => {
            // Set the input value to the corresponding data field or an empty string if missing
            input.value = currentData[key] || "";
        });
    }

    // Extracts data from form inputs and checks if any values have changed from currentData
    function collectFormData() {
        const formData = new FormData();
        let hasChanges = false;

        Object.entries(profileInputs).forEach(([key, input]) => {
            const newValue = input.value.trim();
            formData.append(key, newValue);

            // Compare the new value with the original currentData to detect changes
            if (newValue !== (currentData[key] || "")) {
                hasChanges = true;
            }
        });

        return { formData, hasChanges };
    }

    // Initial load: Fetch user data and populate form fields
    try {
        const userData = await fetchUserData();
        populateFormFields(userData);
    } catch (error) {
        console.error("Error fetching user data:", error);
        alert("An error occurred while loading user data. Please try again later.");
        return; // Stop if we cannot fetch the initial data
    }

    // Listen to the form submit event
    formProfile.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        // Collect the form data and check if any fields have been changed
        const { formData, hasChanges } = collectFormData();
        
        // If no changes are detected, alert the user and stop
        if (!hasChanges) {
            alert("No changes detected. Please update at least one field.");
            return;
        }

        try {
            // Send a PUT request with the new form data to update the user profile
            const response = await fetch(`${API_BASE_URL}/${userId}`, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) {
                // If update fails, parse the error response and alert the user
                const errorData = await response.json();
                console.error("Update error:", errorData);
                alert(`Failed to update profile: ${errorData.error || response.statusText}`);
                return;
            }

            // If update succeeds, let the user know
            alert("Profile updated successfully!");

            // Fetch the updated data from the server and refresh the form inputs
            const updatedData = await fetchUserData();
            populateFormFields(updatedData);

        } catch (error) {
            // If something unexpected goes wrong, log it and alert the user
            console.error("Error updating profile:", error);
            alert("An error occurred while updating the profile. Please try again.");
        }
    });
});
