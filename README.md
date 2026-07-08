# Global Pao — Company Website

Static website for **Global Pao** (reg. no. RO26652709), an earthworks contractor:
excavation, earthmoving, demolition, landscape adjustments and road works.

## Structure

The site is bilingual: **Romanian by default**, with an RO/EN switch in the nav.
The choice is remembered in `localStorage`. All translations live in `assets/js/i18n.js`.

- `index.html` — the whole site (single page: hero, stats, services, fleet, about, game, contact)
- `assets/css/style.css` — styling, animations, responsive layout
- `assets/js/i18n.js` — RO/EN dictionaries and the language switcher
- `assets/js/main.js` — nav, scroll-reveal animations, stat counters
- `assets/js/game.js` — "The Little Excavator" canvas mini-game
- `assets/img/` — AI-generated imagery (OpenAI `gpt-image-1`)
- `tools/generate-images.mjs` — one-shot script that regenerates the imagery

## Run locally

It's a fully static site — open `index.html` in a browser, or serve it:

```powershell
npx serve .
```

## Regenerate images

Requires the `OPENAI_API_KEY` environment variable:

```powershell
node --use-system-ca tools/generate-images.mjs
```

(`--use-system-ca` is needed on machines where HTTPS is intercepted by a local proxy/antivirus.)

## Contact details

- Phone: +40 755 590 639
- Email: globalpaog@gmail.com

## Things to update before going live

- Working hours if different from Mon–Sat 07:00–18:00
- The stats (years, projects, m³) — currently reasonable estimates
