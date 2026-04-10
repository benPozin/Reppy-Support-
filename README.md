# Reppy Support Site

Static support pages for the **Reppy** iOS app: homepage, FAQ, privacy policy, and a custom 404. No build step — plain HTML, CSS, and minimal JavaScript.

## File map

| File | Purpose |
|------|--------|
| `index.html` | Homepage: intro, support, feature requests, feature list, FAQ, link to privacy |
| `privacy.html` | Privacy Policy page |
| `terms.html` | Terms of Use page |
| `404.html` | “Page not found” (used automatically on Vercel for missing URLs) |
| `styles.css` | All layout, typography, and theme (colors in `:root` at the top) |
| `script.js` | Pet theme picker: click any pet with `data-pet-theme` → updates `html[data-theme]` + `localStorage` |
| `assets/*.png` | Reppy pet artwork (replace files, keep names, or update paths in HTML) |
| `README.md` | This file |

## Deploy to Vercel in under 2 minutes

Vercel does **not** offer a true “drop a folder in the browser” deploy for arbitrary static sites. The two supported paths below are both free and take about a minute after you have an account.

### Easiest if you don’t use Git: Vercel CLI (one command)

From this folder on your Mac:

```bash
cd "/path/to/Reppy Support"
npx vercel --prod
```

Sign in when prompted (browser). Accept defaults. No **Build Command** or **Output Directory** customization is required — this project is already static HTML at the root.

**Framework Preset:** choose **Other** if Vercel asks.

### Easiest for ongoing updates: GitHub → Vercel

1. Create a new GitHub repository and upload these files (you can drag files into the GitHub web UI when creating the repo, or use Git on your machine).
2. In Vercel: **Add New…** → **Project** → **Import** your repository.
3. **Framework Preset:** Other.
4. Leave **Build Command** empty. **Output Directory:** default (project root).
5. Deploy. Every `git push` to the connected branch can auto-deploy (default).

Vercel will serve `index.html` at `/`, `privacy.html` at `/privacy.html`, and use `404.html` for unknown URLs on static deployments.

There is **no build step** — Vercel serves the files as-is.

## Update copy or contact info later

- **Titles, paragraphs, FAQ, email:** Edit `index.html`. Search for `reppysupport@gmail.com` or read the `<!-- EDIT: ... -->` comments.
- **Privacy text / last updated date:** Edit `privacy.html` (top “Last updated” line and sections as needed).
- **404 message:** Edit `404.html`.
- **Colors / fonts / spacing:** Edit `styles.css` — start with the `:root { ... }` block at the top.
- **Page title and SEO description:** Change the `<title>` tag and `<meta name="description">` in each HTML file.

## Pet color themes

Click any pet image (or a pet card in “Your gym buddies”) to switch the whole site to that element’s palette (flame, water, air, earth, lightning). The choice is saved in **`localStorage`** as `reppy-support-theme` and restored on `privacy.html`, `terms.html`, and `404.html`. The big hero pet in the homepage header also changes to match the selected theme. To change theme keys or colors, edit **`styles.css`** (`html[data-theme="…"]` blocks) and **`script.js`** (`THEMES` + `THEME_COLORS` + `THEME_HERO_IMAGES`).

## Local preview

Open `index.html` in a browser (double-click or **File → Open**). Links to `privacy.html` and `styles.css` work when files stay in the same folder. Fonts load from Google Fonts when online. Use a local server if you want `file://` quirks avoided; pet themes work either way if JS is enabled.

## App Store note

Use the deployed HTTPS URL in App Store Connect for **Privacy Policy URL** and **Support URL** as needed.
