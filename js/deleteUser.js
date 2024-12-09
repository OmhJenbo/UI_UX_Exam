import { baseUrl, handleAPIError, checkLoginStatus } from './utils.js';

const userId = sessionStorage.getItem('userId');
const userEmail = sessionStorage.getItem('userEmail');

// Use the checkLoginStatus utility
function checkLoginStatusWrapper() {
  if (!userEmail) {
    checkLoginStatus(userId, '../templates/login.html');
  }
}

async function deleteUser() {
  try {
    if (!userId) {
      alert('User ID not found. Please log in.');
      return;
    }

    const apiUrl = `${baseUrl}/users/${userId}`;

    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Use handleAPIError for error handling
    await handleAPIError(response);

    alert('Your profile has been successfully deleted.');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userEmail');
    window.location.replace('../index.html');
  } catch (error) {
    console.error('Error deleting profile:', error);
    alert(error.message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  checkLoginStatusWrapper();
  const deleteButton = document.getElementById('deleteButton');
  if (deleteButton) {
    deleteButton.addEventListener('click', async () => {
      const confirmDeletion = confirm('Are you sure you want to delete your profile? This action CANNOT be undone!');
      if (confirmDeletion) {
        await deleteUser();
      }
    });
  }
});
