# CMS — Setup, Access, and Editing Guide

Studio Nalmé's website is editable through a built-in admin panel at **studionalme.com/admin**. This document covers the one-time setup, day-to-day editing, and what's editable vs. what isn't.

---

## What's editable (Phase 1)

| Section | Editable | Where |
|---|---|---|
| **Studio contact** — phone, email, address, Instagram handle | ✓ | Site Settings |
| **Store products** — name, price, material, image, lead time, description, availability | ✓ | Products collection (15 items) |
| **Workshops** — upcoming + past, dates, descriptions, RSVP links | ✓ | Workshops collection |
| **Featured Instagram** — 4 curated posts shown on About + homepage strip | ✓ | Featured Instagram |
| **Press & Affiliations** — Anna Heringer mentorship, BASEhabitat, etc. | ✓ | Press & Affiliations |
| **Venture cases** — the 3 hospitality/education/wellness cards | ✓ | Venture Cases |
| **Atmospheric videos** — hero loop + manifesto loop (upload, toggle on/off) | ✓ | Atmospheric Videos |
| **Store trust strip** — the 4 chips (Made to order · Ships across India etc.) | ✓ | Store Trust Strip |
| **Media library** — upload images and videos, reusable across collections | ✓ | Inside any "image" field |

### What stays in HTML for now (Phase 2 candidates)

Evergreen copy that we iterated together and shouldn't churn weekly:
- Page hero copy (homepage, About, Ventures, etc.)
- Manifesto + Philosophy descriptions
- Founder bio
- Practice paragraphs
- Etymology block
- FAQ entries on Ventures
- Seasonal timeline table

These can be moved into the CMS in Phase 2 if you find yourself wanting to edit them often. For now they live in the HTML and a developer change is needed.

---

## One-time setup (developer task — ~30 minutes)

Before Tejaswini can log in, three things need to happen on the developer side.

### Step 1 — Push the site to a GitHub repo

The CMS commits edits to a git repo. Create a private repo on GitHub:

1. github.com → New repository → name it `website` under the `studionalme` organisation (or your username)
2. Push the entire `to share/` folder contents to the `main` branch
3. In `admin/config.yml`, line 8, replace `studionalme/website` with the actual `<owner>/<repo>` path

### Step 2 — Create a GitHub OAuth App

GitHub needs to know our site is allowed to ask Tejaswini for permissions.

1. github.com → Settings → Developer settings → **OAuth Apps** → New OAuth App
2. **Application name:** `Studio Nalmé CMS`
3. **Homepage URL:** `https://studionalme.com`
4. **Authorization callback URL:** `https://studionalme.com/oauth/callback`
5. Click **Register application**
6. **Copy the Client ID** — visible immediately
7. Click **Generate a new client secret** → **copy the secret** (you'll only see it once)

### Step 3 — Add the credentials to Cloudflare Pages

1. Cloudflare dashboard → Pages → studionalme project → **Settings → Environment variables**
2. Add two **Production** variables:
   - `GITHUB_CLIENT_ID` = the Client ID from Step 2
   - `GITHUB_CLIENT_SECRET` = the Client Secret from Step 2
3. Save. Trigger a fresh deploy from the Deployments tab.

Setup complete. Tejaswini can now log in.

---

## Day-to-day editing (Tejaswini's workflow)

### Logging in

1. Go to **studionalme.com/admin**
2. Click **Log in with GitHub**
3. Authorize the Studio Nalmé CMS app (only the first time)
4. You're in.

### Editing existing content

The left sidebar shows all collections. Click into any one:

- **Site Settings** — single form with phone, email, etc. Edit, click *Publish*.
- **Store Products** — list of 15 items. Click any to edit. Save creates a draft; *Publish* makes it live.
- **Workshops** — same as products. Toggle `status` between `upcoming` and `past` to move workshops between the two lists.
- **Featured Instagram** — the 4 cards on About and homepage. Edit URL, caption, swap thumbnail image.
- **Press & Affiliations** — toggle `show` to hide one without deleting it.
- **Atmospheric Videos** — upload an mp4/webm/poster, toggle Enabled.

### Adding a new product (or workshop, press item)

1. Click into the collection (e.g., Products)
2. Click **New Product**
3. Fill in all the fields. The most important: `category`, `name`, `id` (URL slug, no spaces), `price_paise` (rupees × 100 — ₹14,800 = `1480000`), `price_display`, `image`
4. Click **Save → Publish**
5. Within ~30 seconds, Cloudflare Pages rebuilds the site with your new item

### Uploading an image

Every `image` field has a *Choose an image* button. Two paths:

- **Use existing** — pick from anything previously uploaded
- **Upload new** — drag a file in or browse from your computer

Uploaded images live in `/assets/images/uploads/` in the repo. They're served from Cloudflare's edge so they load fast for everyone.

**Image guidance:**
- Product photos: portrait orientation, ~1000×1250, WebP or JPG, under 250KB
- Workshop hero images (if used): landscape, 1200×800, under 250KB
- Instagram thumbnails: square, 600×600, under 100KB
- Hero/Manifesto videos: under 800KB each, see `/assets/video/README.md` for compression

### Editing site contact (phone, email, address)

This is the easiest one — *Site Settings* in the sidebar. Edit any of the fields, click *Publish*. Within 30 seconds, every page footer + contact section + WhatsApp link across the entire site updates to the new value.

This is the move to make right after launch — replace the placeholder phone number with the real one.

---

## How it works (the architecture, in plain words)

When you click *Publish* in the admin:

1. Decap CMS writes your changes as a commit to the GitHub repo
2. GitHub notifies Cloudflare Pages that the repo updated
3. Cloudflare Pages downloads the latest code, runs the build script, publishes the result to the global CDN
4. The site visitors see your changes within ~30 seconds

The CMS doesn't modify a live database. It edits the JSON files in `/data/` and commits them to git. Every edit is version-controlled and reversible.

If you ever want to undo a change — go to the GitHub repo → Commits → find the commit → click the *Revert* button.

---

## Editing locally (if you have a developer collaborating)

The same JSON files can be edited in any code editor on a laptop. After editing:

```bash
git commit -am "Update store prices"
git push
```

Cloudflare Pages auto-rebuilds. Useful for bulk updates a developer can do more efficiently.

---

## What happens if the admin is unreachable

If GitHub OAuth is down, or Cloudflare is having an outage, or the admin URL won't load:

- **The site itself keeps working perfectly.** The admin and the site are entirely separate. Visitors are never affected by admin outages.
- **Last-published content stays live.** Whatever was published before the outage continues to serve.
- **Edits get queued.** Once the admin is reachable again, you can complete pending edits.

The website has zero dependence on the admin being up.

---

## Phase 2 — what could come next

If after a month of using the CMS you find yourself wanting to edit the longer-form copy too (hero paragraphs, manifesto descriptions, founder bio), Phase 2 brings those in:

- Each page becomes a Decap document with `intro`, `body`, `closing` fields
- The HTML still ships statically — Decap edits a markdown/JSON file, the build renders it into HTML
- Roughly 1 day of developer work to migrate

Until you actually want this, the current Phase 1 setup covers the high-velocity content — prices, dates, photos, IG posts — which is where most editing happens day-to-day.

---

## Help, support, and what to do when something feels stuck

- **A field is missing or feels wrong** — `admin/config.yml` defines every field. A developer can edit it.
- **A change isn't showing on the live site** — check the Cloudflare Pages → Deployments tab. The most recent deploy should show as "Success." If it shows "Failed," click into it for the error log.
- **You broke something and want to undo** — GitHub → Commits → find the commit → Revert. Cloudflare re-deploys automatically.
- **The admin won't load** — check the GitHub OAuth App still exists at github.com/settings/applications, and the secrets in Cloudflare Pages match.

When in doubt, reach out — the system is designed to fail safely. Visitors to the site will never see a broken state because of an editing issue.
