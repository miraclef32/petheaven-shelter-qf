# PetHeaven — React SPA

This SPA mirrors your existing pages and styling **without changing your original CSS**. Routes:

- `/` — Home (hero, stats, about, services, adopt carousel)
- `/adoption` — Filterable grid + appointment modal
- `/releasing` — 4-step release wizard
- `/contact` — Details + contact form (EmailJS-ready)
- `/login` — Login/Signup tabs with demo credentials

## Dev

```bash
npm i
npm run dev
```

## Notes

- We copied your `styles.css` **verbatim** into `/public/styles.css` and only added a **now imported from `src/styles.css` via `main.jsx`** for React-only helpers (non-destructive).
- Contact form uses EmailJS if you fill in `YOUR_PUBLIC_KEY`, `YOUR_SERVICE_ID`, `YOUR_TEMPLATE_ID` in `src/pages/Contact.jsx` (script tag already included in `index.html`).
- All classNames and structure are preserved to keep your layout intact.
