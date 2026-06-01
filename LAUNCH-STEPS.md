# Studio Nalmé — Launch Steps

A clean, ordered checklist for taking the site from local files to **studionalme.com**.

Three phases: **today** (90 min, site live), **this week** (2 hr, full backend), **ongoing** (real content).

---

## Phase 1 · Get the site live (90 min today)

- [ ] **1.** github.com → Sign up (free) → verify email
- [ ] **2.** GitHub → **+ → New repository** → name: `studionalme-website` → Private → Create
- [ ] **3.** On the empty repo page → click **uploading an existing file** → drag everything from `to share/` → commit message `Initial site` → Commit changes
- [ ] **4.** dash.cloudflare.com → Sign up → verify email
- [ ] **5.** Cloudflare → **Domain Registration → Register Domains** → search `studionalme.com` → buy (~₹880/yr)
- [ ] **6.** Cloudflare → **Workers & Pages → Create application → Pages → Connect to Git** → pick `studionalme-website` repo
   - Project name: `studionalme`
   - Production branch: `main`
   - Framework preset: **None**
   - Build command: `npm install && npm run build`
   - Build output directory: *(blank)*
   - Save and Deploy
- [ ] **7.** Pages project → **Custom domains → Set up a custom domain** → enter `studionalme.com` → activate. Repeat for `www.studionalme.com`. SSL auto-provisions.

**Result:** Site live at studionalme.com. Phone number, prices, Razorpay key — all still placeholders, fixed in Phase 2.

---

## Phase 2 · Wire the backend (~2 hours this week)

### Emails

- [ ] **8.** resend.com → Sign up → **Domains → Add Domain** → `studionalme.com`
   - Resend shows DNS records → add each one in Cloudflare DNS → click **Verify** in Resend
   - **API Keys → Create API Key** → copy
- [ ] **9.** Cloudflare Pages → **Settings → Environment variables** → add three Production vars:
   - `RESEND_API_KEY` = key from Step 8
   - `NOTIFY_TO` = `hello@studionalme.com`
   - `NOTIFY_FROM` = `Studio Nalmé <no-reply@studionalme.com>`
   - Retry deployment after saving
- [ ] **10.** Cloudflare → studionalme.com → **Email → Email Routing → Get started** → accept MX records
   - **Routes → Create address** → `hello` → forward to real inbox (verify via email)
   - Repeat for `ventures`

### Payments

- [ ] **11.** razorpay.com → Sign up → start KYC (1-3 day approval)
   - While waiting, generate **Test API Key** → copy ID + Secret
   - Cloudflare Pages → Environment variables → add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
   - Ping me to swap the placeholder Key ID in `store.html`

### Instagram

- [ ] **12.** behold.so → Sign up → Connect Instagram → pick `@studio_nalme` → copy **Public JSON feed URL**
   - Cloudflare Pages → Environment variables → add `BEHOLD_FEED_URL`

### Spam protection

- [ ] **13.** Cloudflare → **Turnstile → Add site** → name `studionalme.com`, hostname `studionalme.com`, Managed mode → copy Site Key + Secret
   - Cloudflare Pages → Environment variables → add `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET`
   - Ping me to wire widgets into the 5 forms

### CMS

- [ ] **14.** GitHub → **Settings (top right) → Developer settings → OAuth Apps → New OAuth App**
   - Application name: `Studio Nalmé CMS`
   - Homepage URL: `https://studionalme.com`
   - Authorization callback URL: `https://studionalme.com/oauth/callback`
   - Register → copy **Client ID** → **Generate client secret** → copy immediately
   - Cloudflare Pages → Environment variables → add `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`
- [ ] **15.** Edit `admin/config.yml` on GitHub → line 8 → change `repo: studionalme/website` to your real `<username>/<repo>` → commit
- [ ] **16.** Visit **studionalme.com/admin** → log in with GitHub → authorize app → editor opens
   - First edit: **Site Settings** → update phone, address, emails → Publish
   - Refresh studionalme.com → every page footer should show real values

**Result:** Forms send real emails. Payments process. Instagram refreshes. Tejaswini can edit through the admin.

---

## Phase 3 · Real content (ongoing)

- [ ] **17.** Confirm/update the 15 product prices via admin → Products
- [ ] **18.** search.google.com/search-console → Add property `studionalme.com` → verify via Cloudflare DNS → submit `sitemap.xml`
- [ ] **19.** Optional daily Instagram refresh:
   - Cloudflare Pages → Deployments → **Deploy hooks** → Add → name "Daily IG" → copy URL
   - Cloudflare Workers → Create Worker → paste:
     ```js
     export default {
       async scheduled(event, env, ctx) {
         await fetch(env.DEPLOY_HOOK_URL, { method: 'POST' });
       }
     };
     ```
   - Worker → Settings → Variables → add `DEPLOY_HOOK_URL`
   - Worker → Settings → Triggers → Cron → add `30 2 * * *` (8 AM IST)
- [ ] **20.** Real photography — Tejaswini uploads through admin media library. Phased per `IMAGE-MANIFEST.md`. Homepage hero + founder + work tiles + product photos first (~50 images).
- [ ] **21.** Announce on Instagram once site reflects the studio properly.

---

## When you need me back in the loop

- After **Step 11** (Razorpay keys ready) — one-line Key ID swap in store.html
- After **Step 13** (Turnstile keys ready) — wire widgets into 5 forms
- After **Step 16** (admin works) — final smoke test of every form + payment overlay + page rendering

---

## Annual cost summary

| Item | Cost |
|---|---|
| Domain (Cloudflare Registrar) | ~₹880 |
| Cloudflare Pages hosting | Free |
| Cloudflare Pages Functions (1M req/mo free) | Free |
| Cloudflare DNS + Email Routing + Analytics + Turnstile | Free |
| Resend (3,000 emails/mo free) | Free |
| Behold.so (free tier, 30 IG posts) | Free |
| GitHub private repo | Free |
| **Total fixed** | **~₹880/yr (~$10)** |
| Razorpay | 2% per real sale |

That's it.
