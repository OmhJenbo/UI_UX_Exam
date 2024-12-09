import { baseUrl } from './scripts.js';

const userId = sessionStorage.getItem('userId');
const userEmail = sessionStorage.getItem('userEmail');

function checkLoginStatus() {
  if (!userEmail) {
    alert('You must be logged in to access this page.');
    window.location.replace('../templates/login.html');
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

    if (!response.ok) {
      throw new Error(`Failed to delete profile. Status: ${response.status}`);
    }

    alert('Your profile has been successfully deleted.');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userEmail');
    // replace() replaces the current page with the home page, this will keep the user from being able to press back button 
    // and access the profile page again
    window.location.replace('../index.html');
  } catch (error) {
    console.error('Error deleting profile:', error);
    alert('An error occurred while trying to delete your profile.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  checkLoginStatus();
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
