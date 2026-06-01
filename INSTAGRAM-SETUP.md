# Instagram Feed — Setup Guide

The "In the studio, lately" gallery on the About page pulls live posts from `@studio_nalme` automatically. This document explains how to wire it up.

---

## How it works

```
┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│  Instagram (your     │    │  Behold.so           │    │  scripts/            │
│  posts on            │ ─→ │  (Graph API wrapper, │ ─→ │  fetch-instagram.js  │
│  @studio_nalme)      │    │  free for 30 posts)  │    │  runs at build time  │
└──────────────────────┘    └──────────────────────┘    └──────────────────────┘
                                                                    │
                                                                    ▼
                                                        ┌──────────────────────┐
                                                        │  data/ig-posts.json  │
                                                        │  (committed to repo) │
                                                        └──────────────────────┘
                                                                    │
                                                                    ▼
                                                        ┌──────────────────────┐
                                                        │  About page renders  │
                                                        │  the gallery from    │
                                                        │  this JSON           │
                                                        └──────────────────────┘
```

The whole flow runs once per deploy. Visitors see static HTML — no client-side Instagram calls, no waiting, no rate-limit risk. If a deploy fails to fetch (Behold is down, token expires, etc.) the previous `ig-posts.json` stays in place and the gallery keeps working.

---

## One-time setup

### Step 1 — Create a Behold account

1. Go to **[behold.so](https://behold.so)** and sign up (free).
2. Click **Connect Instagram** → log in through Meta.
3. Pick `@studio_nalme` as the account to connect. Approve the requested permissions (read-only — Behold cannot post on your behalf).
4. Behold creates a feed for you. You'll see a dashboard with your recent posts.

### Step 2 — Copy your feed URL

In the Behold dashboard, find the **"Public JSON URL"** for your feed. It looks like:

```
https://feeds.behold.so/abc123xyz456
```

This URL returns JSON with your latest posts, refreshed hourly by Behold.

### Step 3 — Add the URL to Cloudflare Pages

After the site is on Cloudflare Pages:

1. Open Cloudflare dashboard → Pages → studionalme project → **Settings → Environment variables**.
2. Add a new variable:
   - **Name:** `BEHOLD_FEED_URL`
   - **Value:** the URL from Step 2
3. Save.

### Step 4 — Tell Cloudflare Pages to run the script at build time

In Pages → Settings → Builds & deployments → **Build command**, set:

```
npm install && npm run fetch:instagram
```

Save. The next deploy will fetch your latest posts and rebuild with them included.

### Step 5 — Trigger a rebuild

Either push a small change to the repo, or click **Retry deployment** in the Cloudflare Pages dashboard. After ~30 seconds, the site is live with your latest 8 posts in the gallery.

---

## Refreshing the feed

By default, the feed only refreshes when you **rebuild the site**. Options:

### Option A — Manual rebuilds (simplest)

When you post something on Instagram you want to feature, go to Cloudflare Pages → click **Retry deployment**. Takes 30 seconds. Free, no automation needed.

### Option B — Scheduled daily rebuilds (recommended once live)

A free Cloudflare Worker that triggers a rebuild once a day:

1. Cloudflare Pages → Settings → **Deploy hooks** → Create hook called *"Daily Instagram refresh"*. Copy the URL.
2. Cloudflare Workers → Create new Worker. Paste the code below. Replace `DEPLOY_HOOK_URL` with the URL from step 1.

```js
// Worker scheduled to run daily at 8am IST
export default {
  async scheduled(event, env, ctx) {
    await fetch(env.DEPLOY_HOOK_URL, { method: 'POST' });
  }
};
```

3. In the Worker → Settings → Triggers → Cron Triggers, add: `30 2 * * *` (that's 2:30 UTC = 8:00 AM IST).
4. Add `DEPLOY_HOOK_URL` as a Worker environment variable.

Now every morning at 8 AM, the site rebuilds with your latest posts.

### Option C — Rebuild on Instagram post (most automated, more setup)

Use **Zapier** or **IFTTT** — when a new post appears on `@studio_nalme`, POST to the Cloudflare deploy hook. Triggers a rebuild within minutes of posting. Free for up to a few rebuilds per month on the free tiers of either service.

---

## Featuring specific posts (curated row above)

The four curated posts in the section *above* the dynamic gallery (the "Currently · @studio_nalme" row) are **hand-edited** in `about.html`. To swap which posts are featured there, edit those four `<a>` tags directly with new URLs. They don't auto-refresh — they're meant to be the studio's chosen highlights.

This gives you a two-tier system:
- **Curated row** (4 cards) — featured posts you pick, edited manually
- **Lately gallery** (8 tiles) — most recent 8 posts, auto-fetched

---

## Alternative: skip Behold, use Instagram Graph API directly

If you don't want to use a third-party service, you can hit Instagram's Graph API directly. More setup, no recurring third-party dependency.

### What you'll need

1. An Instagram **Business or Creator** account (not Personal).
2. A Facebook Page linked to the Instagram account.
3. A Meta Developer App (free, [developers.facebook.com](https://developers.facebook.com)).
4. A **long-lived access token** (valid 60 days, refresh required).

### Setup

1. Create the Meta app, add the Instagram Graph API product.
2. Generate a User Access Token via the Graph API Explorer with permissions `instagram_basic` and `pages_show_list`.
3. Exchange for a long-lived token (60 days).
4. In `scripts/fetch-instagram.js`, uncomment the `fetchDirectFromInstagram()` path and set:
   - `INSTAGRAM_ACCESS_TOKEN` (env var)
   - `INSTAGRAM_USER_ID` (env var — your IG account ID, found via Graph API Explorer)
5. Set up a reminder every 50 days to refresh the token before it expires.

For Studio Nalmé's volume and Tejaswini's involvement level, Behold is significantly less hassle. Use direct API only if Behold ever becomes unworkable.

---

## What happens if the feed breaks

The script is built to fail gracefully:

| Failure mode | What happens |
|---|---|
| `BEHOLD_FEED_URL` env var missing | Script does nothing; previous JSON stays in place. |
| Behold returns an error / is down | Previous JSON stays in place. Site keeps working with the previous batch. |
| JSON file gets deleted | Site falls back to the static tiles hard-coded in `about.html`. |
| Client-side fetch fails | Static fallback tiles render. Visitors never see a broken state. |

The gallery is "live when it can be, static when it has to be." No deploy ever breaks because of an Instagram fetch.

---

## Running locally

To test the fetch script on your own machine:

```bash
cd "to share"
npm install         # nothing to install yet, but reserve the command
BEHOLD_FEED_URL="https://feeds.behold.so/abc123" node scripts/fetch-instagram.js
```

Output:
```
→ Fetching from Behold feed (limit: 8)
✓ Wrote 8 posts to data/ig-posts.json
```

Open `data/ig-posts.json` to inspect the result. Push when ready.
