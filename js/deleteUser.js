const baseUrl = "http://127.0.0.1:8080";

// Function to check if the user is logged in
function checkLoginStatus() {
  const userId = sessionStorage.getItem('userId'); // Retrieve user ID
  const userEmail = sessionStorage.getItem('userEmail'); // Retrieve user email

  if (!userEmail) {
    alert('You must be logged in to access this page.');
    window.location.href = '../templates/login.html'; // Redirect to the login page
  }
}

// Function to delete the user's account
function deleteUser() {
  const userId = sessionStorage.getItem('userId'); // Retrieve user ID
  if (!userId) {
    alert('User ID not found. Please log in.');
    return;
  }

  const apiUrl = `${baseUrl}/users/${userId}`; // Construct the DELETE API URL

  fetch(apiUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then((response) => {
      if (response.ok) {
        alert('Your profile has been successfully deleted.');
        // Clear session storage after successful deletion
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('userEmail');

        // Redirect to the homepage or login page
        window.location.href = '../index.html';
      } else {
        throw new Error(`Failed to delete profile. Status: ${response.status}`);
      }
    })
    .catch((error) => {
      console.error('Error deleting profile:', error);
      alert('An error occurred while trying to delete your profile.');
    });
}

// Attach delete function to the delete button
document.getElementById('deleteButton').addEventListener('click', () => {
  const confirmDeletion = confirm('Are you sure you want to delete your profile? This action CANNOT be undone!');
  if (confirmDeletion) {
    deleteUser();
  }
});

// Check login status when the page loads
document.addEventListener('DOMContentLoaded', checkLoginStatus);
