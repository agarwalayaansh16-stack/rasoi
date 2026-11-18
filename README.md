# Rasoi Indian Restaurant — Landing Page

A static, dependency-free landing page (HTML + CSS + vanilla JavaScript) for Rasoi Indian Restaurant, Hoi An & Danang.

## Files

```
rasoi/
├── index.html          All sections, SEO metadata, Open Graph tags, schema.org data
├── css/styles.css      Design system (colors, type, spacing), layout, animations, responsive rules
├── js/config.js        ← Edit this: booking link, booking email, Facebook/Instagram URLs
├── js/main.js          Sticky header, mobile menu, scroll-spy, scroll reveals, booking form, image fallback
└── assets/favicon.svg  Brand icon
```

## Run it

No build step is needed.

- **Quickest:** double-click `index.html` to open it in a browser.
- **Local server** (recommended, closer to production):
  ```bash
  cd rasoi
  python3 -m http.server 8080      # then open http://localhost:8080
  # or: npx serve .
  ```
- **Go live:** upload the whole folder to any static host (Netlify drag-and-drop, Vercel, GitHub Pages, cPanel `public_html`, etc.).

## Configure (js/config.js)

| Setting | What it does |
|---|---|
| `bookingUrl` | If set (e.g. a TableCheck, Google Form or `https://wa.me/...` link), every "Book a Table" button opens it. If empty, the buttons scroll to the on-page booking form. |
| `bookingEmail` | Where the booking form sends requests. The form opens the visitor's email app with the request pre-filled. |
| `social.facebook` / `social.instagram` | Paste the real profile URLs. Each icon stays hidden until its URL is filled in. |

## Before launch — checklist

1. **Replace the stock photos with Rasoi's own photos** (real dishes, interiors and storefronts). The current images are free Unsplash photos used as placeholders. They are *not* Rasoi's restaurants. Search `images.unsplash.com` in `index.html` to find each one, and keep the `alt` text accurate.
   Tip: export photos as WebP or JPEG at about 1600px wide (hero 2000px), then save them in `assets/`.
2. Add the Facebook and Instagram URLs in `js/config.js`.
3. Optional: add a `bookingUrl` if you use an online reservation system.
4. Opening hours are intentionally **not** shown. Add them to the Locations cards and to the JSON-LD block in `index.html` once confirmed.
5. Set the real domain in `<link rel="canonical">` and the `og:image` tag.

## Notes

- Phone links use the international format: `tel:+84586915889` (Hoi An) and `tel:+84815960046` (Danang). The trunk "0" is dropped after +84 so they dial correctly from any phone. The numbers are displayed exactly as supplied.
- "Get Directions" opens Google Maps searches for each address.
- Testimonials are the four supplied reviews, with light spelling and grammar fixes only.
- Accessibility features: a skip link, semantic landmarks, alt text, a keyboard-operable menu (Esc closes it), visible focus styles and `prefers-reduced-motion` support.
- Performance: responsive `srcset` images, lazy loading below the fold and a preloaded hero image. If a photo ever fails to load, a branded pattern is shown instead of a broken-image icon.
