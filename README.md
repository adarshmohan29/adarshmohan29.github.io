# adarshmohan29.github.io

Personal portfolio of **Adarsh Mohankumar Gundagal**. Live at https://adarshmohan29.github.io

Plain HTML/CSS/JS, no build step, hosted on GitHub Pages.

## Editing
- **Projects:** edit `projects.js`. Each object's `repo` is the GitHub repo name. Clicking a card loads that repo's README live from GitHub.
  To add Gatekeeper, uncomment the template at the bottom of `projects.js` and fill it in.
- **Text (experience, skills, education):** edit `index.html`.
- **Photo:** replace `assets/photo.jpg`.

Then commit and push. GitHub Pages redeploys in about a minute.

## Preview locally
```
python3 -m http.server 8000
```
and open http://localhost:8000
