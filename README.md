# Dice Roller

A lightweight, zero-dependency dice roller with animated 3D dice, multiple themes, and roll history. Built with plain HTML, CSS, and JavaScript — no build step required.

## Features

- **3D animated dice** — CSS `transform-style: preserve-3d` with realistic roll animation that lands on the correct face
- **1–6 dice** — roll multiple dice at once and see the total
- **5 themes** — Classic, Neon, Wood, Ice, Obsidian
- **Dark / light mode** — auto-detects system preference, persists across sessions
- **Roll history** — last 50 rolls with individual values, total, and timestamp
- **Keyboard shortcut** — `Space` or `Enter` to roll
- **Responsive** — scales down for small screens

## Getting Started

No dependencies, no build step. Just open the file:

```bash
open src/index.html
```

Or serve it locally (required if you hit CORS issues):

```bash
# Python
python3 -m http.server 8080 --directory src

# Node (npx)
npx serve src
```

Then visit `http://localhost:8080`.

## Project Structure

```
src/
├── index.html   # App shell and markup
├── app.js       # State, dice logic, animations, history
└── style.css    # Layout, 3D dice, themes, dark/light tokens
```

## Hosting Online

Since this is a static site (pure HTML/CSS/JS), any static hosting service works:

### GitHub Pages (free, easiest)
1. Push the repo to GitHub
2. Go to **Settings → Pages**
3. Set source to the `main` branch and folder to `/src` (or `/` if you move files to root)
4. Your site is live at `https://<username>.github.io/<repo-name>`

### Netlify (free, drag-and-drop)
1. Go to [netlify.com](https://netlify.com) and sign up
2. Drag the `src/` folder onto the Netlify dashboard
3. Done — you get a live URL instantly, with a custom domain option

### Vercel (free)
```bash
npx vercel
```
Point it at the `src/` directory when prompted.

### Cloudflare Pages (free)
1. Connect your GitHub repo at [pages.cloudflare.com](https://pages.cloudflare.com)
2. Set the build output directory to `src`
3. No build command needed
