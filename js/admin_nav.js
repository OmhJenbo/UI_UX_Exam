document.addEventListener("DOMContentLoaded", () => {
  const navContainer = document.querySelector('.mini-nav');
  const navButtons = Array.from(document.querySelectorAll('.mini-nav button'));
  const forms = document.querySelectorAll('.form-container');

  if (navContainer) {
    navContainer.addEventListener('click', (event) => {
      const button = event.target.closest('button'); // Ensure the click is on a button
      if (!button) return;

      // Find the index of the clicked button
      const index = navButtons.indexOf(button);
      if (index === -1) return; // Safety check in case button isn't in navButtons

      // Only update the active states for the clicked button and associated form
      navButtons.forEach(btn => btn.classList.remove('active'));
      forms.forEach(form => form.classList.remove('active'));

      button.classList.add('active');
      forms[index]?.classList.add('active'); // Add active class to corresponding form (if exists)
    });
  }
});