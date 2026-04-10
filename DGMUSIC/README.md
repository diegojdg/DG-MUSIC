# Portfolio Online - Diego Jaques // DSGN

Welcome to the source code for the **Diego Jaques Portfolio**. This project is a highly immersive, futuristic graphic design and motion gallery built to wow visitors with rich aesthetics, seamless animations, and top-tier layout architecture.

## 🚀 Tech Stack

This project strictly follows modern web standards and is built as a highly optimized static site:

- **HTML5**: Semantic and accessible DOM structure.
- **Tailwind CSS**: Served via a customized standalone CDN script with extended tokens for *Dark Mode*, *Neon Effects*, and *Glassmorphism*.
- **JavaScript (ES6)**: Vanilla JS handles intricate modal gallery states and a live translation engine. No bulky frameworks required!
- **GSAP (GreenSock)**: Used to orchestrate professional scroll and load animations (fade in, text reveal, parallax emulation).
- **CSS Grid/Flexbox**: Built for total fluid responsiveness on desktop, ultrabooks, and mobile.

## 🎨 Design Philosophy

### The "Cyberpunk Elegance" Vibe
- **Color Palette**: Pitch Black (`#050505`) base contrasted against vivid Cyan / Neon Blue (`#00FFFF`), establishing visual punch.
- **Typography Orbitron & Inter**: A dynamic hierarchy using *Orbitron* for stylized cyberpunk headings and *Inter* for legible paragraphs.
- **Micro-Animations**: Shimmering buttons, reactive floating cards, and animated ambient gradient blobs give life to the background without the overhead of heavy 3D canvases.

## 📁 System Architecture

The file tree has been pre-configured for instant deployment:

```
/
├── index.html        # Main landing page & visual logic root
├── README.md         # Architecture & Deployment instructions
├── css/
│   └── style.css     # Bespoke style overrides, shimmers, & custom utilities
├── js/
│   └── main.js       # Core interactivity (Modal controller, i18n Translation)
└── assets/           # Media & visual dependencies
    ├── images/       # Extensively compressed WebP image clusters
    └── videos/       # Hero ambient renders & looping backgrounds
```

## 🛠️ Translation Engine (`i18n`)

A built-in lightweight localizer sits at the bottom of the `main.js` file. Users can instantly switch the website content locally between:
- 🇧🇷 Portuguese (PT)
- 🇬🇧 English (EN)
- 🇪🇸 Spanish (ES)

*It runs without reloading the DOM using `data-lang-btn` and `data-i18n` triggers.*

## 🌩️ Deployment

Because parsing dependencies organically occurs via static entry files, this workspace is ready for **zero-configuration deployments**.

**Recommended Deployment Platforms:**

### Vercel / Netlify
1. Initialize a Git repository and push this to Github/Gitlab.
2. Link the repository to your Vercel or Netlify dashboard.
3. Configure **Build Command** as `Enforced Empty` (No build command).
4. Configure **Publish Directory** as `.` (root directory) or `DGMUSIC` if deployed as a sub-folder.
5. Deploy.

### GitHub Pages / Hostinger / Apache Server
Drag and drop the contents of this folder directly into your root directory or `public_html`. The `index.html` file will bootstrap the assets natively.

---
*Created meticulously to turn visual design into pure emotion.*

