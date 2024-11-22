// JavaScript for Admin Mini Navigation

      const navButtons = document.querySelectorAll('.mini-nav button');
      const forms = document.querySelectorAll('.form-container');

      navButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
          // Remove active class from all buttons and forms
          navButtons.forEach(btn => btn.classList.remove('active'));
          forms.forEach(form => form.classList.remove('active'));

          // Add active class to the clicked button and the corresponding form
          button.classList.add('active');
          forms[index].classList.add('active');
        });
      });
    