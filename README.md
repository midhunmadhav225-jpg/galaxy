# Galaxy — Site README

This repository contains a simple static marketing site for the Galaxy product line.

What's included

- index.html — main site (uses placeholders in /assets)
- styles.css, script.js — site styles and interactions
- /assets — placeholder images, gallery, and assets metadata

How to preview locally

1. Clone the repo:
   git clone https://github.com/midhunmadhav225-jpg/galaxy.git
2. Open `index.html` in your browser, or serve it with a simple static server:
   - Python 3: `python -m http.server 8000` then visit `http://localhost:8000`

Replace placeholders with real images

- Upload your real images into `/assets` and name them `product-1.jpg` (hero) and `product-2.jpg` (showcase) or update `index.html` to point to your filenames.
- Update `/assets/assets.json` with filenames and alt text if needed.

Publish with GitHub Pages

1. Go to your repository on GitHub → Settings → Pages.
2. Select the `main` branch and `/ (root)` as the folder.
3. Save — your site will be published at `https://<your-username>.github.io/galaxy/`.

Next steps I can take for you

- Replace the placeholder SVGs with the four images you provided (I'll upload them for you and optimize/responsive versions).
- Add automated image optimization (GitHub Action) to create WebP/resized variants on push.
- Improve accessibility and run Lighthouse audits.

Tell me which of the next steps you'd like me to run and I will proceed.
