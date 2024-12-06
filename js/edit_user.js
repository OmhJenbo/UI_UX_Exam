document.addEventListener("DOMContentLoaded", async () => {
    const formProfile = document.getElementById("formProfile");

    const userId = sessionStorage.getItem("userId");

    if (!userId) {
        alert("User ID not found in session storage.");
        return;
    }

    // Define currentData in the outer scope
    let currentData = {};

    // Fetch existing user data for input placeholders
    try {
    // await pauses execution until the fetch resolves.
        const response = await fetch(`http://127.0.0.1:8080/users/${userId}`);
        if (response.ok) {
            currentData = await response.json();

            // Pre-fill the form with current user data
            document.getElementById("profileName").value = currentData.first_name || "";
            document.getElementById("profileLastName").value = currentData.last_name || "";
            document.getElementById("profileEmail").value = currentData.email || "";
            document.getElementById("profileAddress").value = currentData.address || "";
            document.getElementById("profileTel").value = currentData.phone_number || "";
            document.getElementById("profileDob").value = currentData.birth_date || "";
        } else {
            alert("Could not load user data. Please try again later.");
        }
    } catch (error) {
        alert("An error occurred while loading user data.");
    }

    formProfile.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Collect updated data
        const updatedData = {
            email: document.getElementById("profileEmail")?.value.trim(),
            first_name: document.getElementById("profileName")?.value.trim(),
            last_name: document.getElementById("profileLastName")?.value.trim(),
            address: document.getElementById("profileAddress")?.value.trim(),
            phone_number: document.getElementById("profileTel")?.value.trim(),
            birth_date: document.getElementById("profileDob")?.value.trim(),
        };

        // Check if any fields have been 
        // .some returns true if at least one element in the array opfylder? the condition
        const hasChanges = Object.keys(updatedData).some(
            (key) => updatedData[key] !== currentData[key]
        );
        // If no fields changed, then make an alert and abort the submission
        if (!hasChanges) {
            alert("No changes detected. Please update at least one field.");
            return;
        }

        // Create FormData object
        // keys are the field names, values are the field values
        const formData = new FormData();
        Object.keys(updatedData).forEach((key) => {
            formData.append(key, updatedData[key]);
        });

        try {
            const response = await fetch(`http://127.0.0.1:8080/users/${userId}`, {
                method: "PUT",
                body: formData, // makes sure that formData is sent, since that's what the API expects
            });

            if (response.ok) {
                alert("Profile updated successfully!");
            } else {
                const errorData = await response.json();
                alert(`Failed to update profile: ${errorData.error || response.statusText}`);
            }
        } catch (error) {
            alert(`An error occurred: ${error.message}`);
        }
    });
});
