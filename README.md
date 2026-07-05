# VOLT — Sports Gear Store

A fully responsive sports e-commerce landing page built from scratch with **pure HTML, CSS & vanilla JavaScript** — no frameworks, no dependencies, no build tools.

![HTML5](https://img.shields.io/badge/HTML-5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS-3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/license-MIT-green)

## Live Demo

🔗 [View Live Site](https://hany-zamalkawy.github.io/-VOLT-Sports/)

## Preview

A bold, energetic athletic brand identity — off-white background, deep black, an electric "volt" lime accent, and a flame-red highlight for sales — paired with a condensed display typeface and skewed marquee banners as the signature visual element.

## Features

- 🎯 **Hero section** with animated organic shape and bold typography
- 🏷️ **Signature marquee banners** — skewed, auto-scrolling ticker strips (inspired by stadium signage)
- 🧭 **Sticky header** with search overlay and mobile menu
- 📦 **Shop by category** grid (Running, Basketball, Training, Football, Outdoor)
- 🛍️ **Product grid** with live category filtering (no page reload)
- ⏱️ **Flash sale countdown timer** (days / hours / minutes / seconds)
- 🛒 **Full shopping cart** — slide-in drawer, quantity controls, remove items, live subtotal calculation
- ✅ **Checkout confirmation modal** + toast notifications
- 📧 **Newsletter signup form**
- 📱 **Fully responsive** — optimized for desktop, tablet, and mobile
- ♿ **Accessible** — visible focus states, semantic markup, `prefers-reduced-motion` support

## Tech Stack

- **HTML5** — semantic structure
- **CSS3** — custom properties, Flexbox, CSS Grid, keyframe animations
- **Vanilla JavaScript** — DOM manipulation, event delegation, no dependencies
- **Google Fonts** — [Anton](https://fonts.google.com/specimen/Anton) (display) & [Inter](https://fonts.google.com/specimen/Inter) (body)

## Project Structure

```
VOLT-Sports/
├── index.html      # Page structure & markup
├── style.css       # All styling (organized by section with a table of contents)
├── script.js       # Store logic: product data, cart, filters, countdown, events
└── README.md       # Project documentation
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Hany-Zamalkawy/-VOLT-Sports.git
   ```
2. Open the project folder and make sure all three files (`index.html`, `style.css`, `script.js`) stay together in the same directory.
3. Open `index.html` directly in your browser, or serve it locally:
   ```bash
   npx serve .
   ```
   or with the VS Code **Live Server** extension.

> ⚠️ The site must be opened as a proper local/live server or with all three files side by side — opening a misplaced `index.html` alone will load unstyled HTML.

## How It Works

- **Product data** lives in a single array (`PRODUCTS`) in `script.js` — add, remove, or edit products by editing this array; the UI updates automatically.
- **Cart state** is held in memory (a JavaScript array) for the session. It resets on page refresh since this is a front-end demo with no backend or database.
- **Filtering** re-renders the product grid based on the selected category — both the shop filter bar and the homepage category cards use the same filter function.
- **Countdown timer** calculates a target date two days from page load and updates every second.

## Customization

- **Colors & fonts:** edit the CSS custom properties at the top of `style.css` (`:root { --bg; --ink; --volt; --flame; ... }`).
- **Products:** edit the `PRODUCTS` array at the top of `script.js`.
- **Copy/content:** update text directly in `index.html`.

## Deploy with GitHub Pages

1. Push the repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Source**, select the `main` branch and `/ (root)` folder, then **Save**.
4. Your store goes live at:
   ```
   https://hany-zamalkawy.github.io/-VOLT-Sports/
   ```

## License

Open-sourced for learning and personal/commercial use. Attribution appreciated but not required.
