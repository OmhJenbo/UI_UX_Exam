# Hurtige git kommandoer:

- git checkout 'branch_name' // skifter branch til den angivne branch.
- git add . // tilføjer alle filer til din git cache og gør det muligt at commite dem.
- git commit -m "commit besked" // gør dine filer klar til push og tilføjer en besked, som fortæller hvad dit commit indeholder
- git push // pusher dit commit op på den branch du står i.

- git fetch //kontrollere om der er sket nogen ændringer i den branch du står i (altså om din fil er up to date med repositoriet), hvis din fil ikke er, så gør den klar til et pull
- git pull //puller ændringerne som ligger i repositoriet ned, og opdaterer dine filer med ændringerne.


> opgave beskrivelse
# Functionalities

### Users can:

- Sign up
- Log in
- See a list of random books
- Search for books based on the title or part of the title
- See the books by a specific author
- See information for a specific book
### Only if logged in:
- Loan a book for a period of 30 days
- Only if the user does not have an existing loan on this book
- If the process is successful, the user will see a message explaining that an access link to the e-book will be sent to his/her email address (notice, though, that this functionality is not implemented in the back-end)
- Edit his/her information
- The password and membership date cannot be changed
- Remove his/her user
- Log out
### The admin can:

- Log in (user “admin.library@mail.com”, password “WebUdvikling24!”)
- Only when logged in:
- See information for a specific book, including loan history
- Add a new book
- Add a new author
- Add a new publisher
- Log out

## Backend

##### The information about books, authors, publishers, and users will be gathered from the Library API (https://github.com/arturomorarioja/py_library_api_v2). Find the list of endpoints in the repository’s README.md file.

> Feel free to organise the information architecture of the application as you see fit, as long as all requirements are met.

### Users

- When signing up, the application will require the user’s email, password, and repeating the password. A valid email address is expected. The password must have more than 8 characters, and contain lowercase and uppercase letters, numbers, and special characters. Both passwords must match.

- When logging in, the user must introduce his/her email and password.

- Upon correct log in, the application will store the user’s email address in sessionStorage. Upon log out, said email will be removed from sessionStorage.

- To redirect from one page to another in JavaScript, this source can be handy.

### Code

> The application will be developed with HTML5, CSS3 and JavaScript.

> No further front-end libraries (e.g., Bootstrap, Tailwind), JavaScript libraries (e.g., jQuery) or JavaScript frameworks (e.g., React, Angular, Vue, Svelte) are allowed. If in doubt about the use of tools, ask your teacher.

> All HTML, CSS and JavaScript paths must be relative.

> Semantic HTML must be used, with especial attention to landmark elements.

> HTML5, not XHTML, syntax must be used.

> The application’s entry point will be index.html. Avoid different names for the sake of deployability.

> <"em"> and <"strong"> will be used instead of <"i"> and <"b">, respectively.
<"br"> must be avoided.

>All CSS colours and font families will be declared as custom properties (CSS variables). No colour or font family must be hardcoded.

> Pixel units must be avoided except for breakpoints, fixed sizes (e.g., images) and maybe 1px border sizes.

> Fonts must be loaded in CSS, never in HTML.

> The page must be fully responsive (i.e., it must adapt to all viewport widths). Use whatever tools you find appropriate for that purpose (e.g., media queries, float, flexbox, grid).

#### Accessibility will be enforced:
> Colour contrast for all textual elements on the page
Avoidance of complex fonts
Keyboard-only accessibility for the whole site
Use of ARIA labels
Use of appropriate HTML form input types
Semantic use of <"a"> and <"button">
Minimum size of touch elements
Attention must be paid to the performance of the web application:
Image format, size and resolution
Loading of external fonts
Deferred CSS load, if applicable
Lazy loading of JavaScript, if applicable
Use of JavaScript modules, or JavaScript file load with async or defer
Use of const and let in JavaScript
However, the code will not be prepared for deployment (e.g., minification, bundling), as it must be legible for your teacher.