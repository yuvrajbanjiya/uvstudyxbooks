# UVstudyX — GitHub Pages

## Deploy on GitHub Pages
1. Create a GitHub repository (for example `UVstudyX`).
2. Upload **all files in this folder** to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select your branch (usually `main`) and folder **`/ (root)`**.
6. Save and wait for GitHub Pages to publish the site.

The site is plain HTML/CSS/JavaScript, so no Node.js build step is required.

## Firebase
The public book catalogue uses the Firebase project configured in `script.js`.

### Important admin note
The current admin screen uses a client-side password, but the supplied Firestore rules require an authenticated Firebase user whose UID has an `admins/{uid}` document. Therefore, **public visitors can read books, but the current password-only admin UI will not be able to write to Firestore until Firebase Authentication/admin authorization is configured**.

Do not make Firestore writes publicly accessible just to bypass this; that would allow anyone to modify/delete the book database.

## Files
- `index.html` — main website
- `style.css` — styling
- `script.js` — website + Firebase logic
- `assets/` — logo/assets
- `firestore.rules` — Firestore security rules
- `.nojekyll` — GitHub Pages compatibility marker
- `404.html` — fallback page

## Telegram
https://t.me/class11freebook
