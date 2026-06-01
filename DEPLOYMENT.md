# Studio Nalmé — Deployment & Go-Live Doc

The complete checklist to take the site from current staging state to live on `studionalme.com`. Read top to bottom; each section says clearly what's needed from you vs. what's already built.

---

## Current state (already done)

- All 9 pages built, designed, copy-edited, mobile-responsive
- 5 forms wired to Netlify Forms backend (ventures, contact, field-notes, venture-quick, workshop-host)
- Razorpay Standard Checkout overlay wired on 3 Light products (test-key placeholder)
- Branded thank-you page at `/thank-you.html`
- 404 page at `/404.html`
- Sitemap, robots, manifest, cache headers
- Cloudflare Pages Functions written for: server-side Razorpay order creation, form submissions via Resend
- Schema.org JSON-LD on every page (rich SEO)
- Self-hosted brand fonts (Friend, Kumbh Sans, Inter, Noto Sans Kannada)

---

## What I need from you — the master list

### 🔴 Critical (blocks launch)

1. **Domain registered at Cloudflare**
   - Register `studionalme.com` at https://dash.cloudflare.com/registrar
   - Cost: ~₹880/year, at-cost (no markup)
   - Then send me access (invite my email as a member) or do the connection together.

2. **Razorpay account + KYC complete**
   - Sign up at https://razorpay.com
   - Complete KYC (PAN, bank account, GST if applicable)
   - Generate API keys: Dashboard → Settings → API Keys
   - Send me: **`Key Id`** (starts with `rzp_live_…` or `rzp_test_…`) and **`Key Secret`**
   - The Key Id goes into `store.html`. The Key Secret goes into Cloudflare env vars (never in code).

3. **Resend account for form emails**
   - Sign up at https://resend.com (free tier: 3,000 emails/month, 100/day — plenty for the studio)
   - Add `studionalme.com` as a verified domain
   - Resend will give you DNS records (SPF, DKIM, DMARC) — these go into Cloudflare DNS
   - Generate an API key
   - Send me the API key and the verified sender address (e.g., `no-reply@studionalme.com`)

4. **Real WhatsApp / phone number**
   - Currently: `+91 9XXXXXXXXX` (placeholder everywhere)
   - Send me Tejaswini's actual WhatsApp number for the studio
   - I'll find-and-replace across all files

5. **Real email addresses**
   - `hello@studionalme.com` (general / contact form)
   - `ventures@studionalme.com` (lead-gen form)
   - `workshops@studionalme.com` (workshop hosting enquiries, optional — can also route to hello@)
   - These can be Gmail aliases, Cloudflare Email Routing forwards, or Google Workspace mailboxes
   - **Cheapest path: Cloudflare Email Routing** (free, forwards `*@studionalme.com` to any inbox)

6. **Final pricing approvals**
   - Confirm the 3 Light product prices (₹14,800 / ₹9,500 / ₹7,200) or adjust
   - Confirm all 12 placeholder prices in Cloth / Tiles / Wood / Cane categories (see store.html)
   - These are placeholders I picked to demonstrate the layout

7. **Tejaswini's signoff on copy**
   - Founder bio paragraph on About page (currently in the studio's voice but should be hers)
   - Practice section copy on About and homepage
   - Etymology / "what nalmé means" copy
   - Any other page-specific copy she wants tweaked

8. **Real photographs**
   - See `IMAGE-MANIFEST.md` for the complete catalogue of ~50 images needed for launch state
   - Drop them in a Drive folder, send the link, I'll do the bulk swap

### 🟡 Important but not blocking

9. **Press URLs**
   - The About page has 5 placeholder press features (AD India, STIRworld, Domus India, The Hindu, Goethe-Institut)
   - Replace with real published features as they come in (just send me the URL + publication name + date)
   - Easy to comment out the entire section if you'd rather not have placeholders showing

10. **Project details for the 27 Drive projects**
    - The Work index has tiles for 27 projects but only Wild Pour has a detail page
    - Each new project detail page is ~30–60 minutes of work (template exists)
    - Send me: project name, location, year, materials, brief story (1–2 paragraphs), 6–10 photos
    - We can do these in batches as time allows

11. **GST registration confirmation**
    - If GST-registered: the Store trust strip line `"Prices in INR · Excl. GST"` stays accurate
    - If not GST-registered (turnover under ₹40L): change to `"Prices in INR · All inclusive"`

12. **Studio postal address**
    - About page currently shows: "Bengaluru, Karnataka India · 560 0xx"
    - Replace with real (or keep generic if Tejaswini prefers privacy — postal addresses on architecture sites are optional)

13. **Newsletter platform decision** (Field Notes)
    - Currently routes to email via the form. For a real subscriber list with delivery:
      - **Buttondown** ($9/mo) — clean, writer-friendly, great for studios
      - **Mailchimp** (free up to 500 subscribers)
      - **Substack** (free, but Substack-branded URL)
      - **Beehiiv** (free up to 2,500 subscribers, generous tier)
    - For now the form just collects emails into your inbox. Migrate when subscriber count justifies a tool.

### 🟢 Optional / phase-2

14. **Decap CMS or alternative**
    - Tejaswini editing posts/products/projects herself, no code
    - Decap is git-based, free, works with Cloudflare
    - Tinkering with this needs the site converted to a static-site generator (Eleventy or Astro) — moderate refactor
    - Alternative: leave the site as hand-coded HTML and use Decap only for new journal articles
    - Decision pending; not blocking launch

15. **Analytics**
    - Cloudflare Web Analytics (free, privacy-respecting, no cookie banner needed) — recommended
    - Plus GA4 if you want deeper funnel analysis later
    - Plus Meta Pixel if you'll run Instagram/Facebook ads on the Ventures form

16. **Instagram embed on homepage**
    - A live feed of @studio_nalme posts on the homepage
    - Adds ~50kb to page weight, needs Instagram Basic Display API
    - Skip for launch, add later if it adds value

---

## Migration steps (when above is ready)

### Step 1 — Connect domain to Cloudflare
1. Domain registered at Cloudflare = DNS is already with Cloudflare. Good.
2. In Cloudflare dashboard → Pages → Create a project
3. Connect to GitHub repo where this folder lives (or upload the `to share/` folder directly)
4. Build settings: leave blank (it's static HTML)
5. Cloudflare Pages will give you `studionalme.pages.dev`
6. In Pages → Custom domains, add `studionalme.com` and `www.studionalme.com`
7. Cloudflare auto-creates the CNAME records, SSL certs auto-provision in 60 seconds

### Step 2 — Set Cloudflare Pages environment variables
In Pages project → Settings → Environment variables (Production), add:

```
RAZORPAY_KEY_ID         = rzp_live_xxx  (from Razorpay dashboard)
RAZORPAY_KEY_SECRET     = xxx           (from Razorpay dashboard)
RESEND_API_KEY          = re_xxx        (from Resend dashboard)
NOTIFY_TO               = hello@studionalme.com
NOTIFY_FROM             = Studio Nalmé <no-reply@studionalme.com>
```

### Step 3 — Configure DNS records for Resend
In Cloudflare DNS, add the records Resend provides during domain verification:
- TXT record for SPF
- 3 CNAME records for DKIM
- TXT record for DMARC

Wait ~10 minutes, click "Verify" in Resend dashboard.

### Step 4 — Flip the toggles
1. In `store.html`, find `const RZP_KEY = 'rzp_test_PLACEHOLDER…';` → replace with the live key.
2. Same file, find `const USE_SERVER_ORDER = false;` → change to `true`. This activates the server-side order creation (cannot be tampered with from devtools).
3. In all 5 forms across the site, change the fetch target from `/` (Netlify) to `/api/submit` (Cloudflare). I'll do this when we cut over — about 10 minutes of search-and-replace.

### Step 5 — Cloudflare Email Routing
In Cloudflare dashboard → Email → Email Routing:
- Add `studionalme.com`
- Create routing rules:
  - `hello@studionalme.com` → forwards to Tejaswini's personal inbox
  - `ventures@studionalme.com` → forwards to Tejaswini (or you, for triage)
  - `workshops@studionalme.com` → forwards as needed
  - `*@studionalme.com` (catch-all) → optional, forwards to a default

### Step 6 — Cloudflare Web Analytics
In Cloudflare dashboard → Analytics → Web Analytics:
- Add `studionalme.com`
- Cloudflare provides a small JS snippet to paste before `</body>` on each page
- I'll add it in one pass

### Step 7 — Test, then announce
- Submit a test form on each of the 5 forms; verify email arrives at hello@studionalme.com
- Run a test payment of ₹100 via the Kuri Pendant Order button (use a test card), confirm it lands in Razorpay dashboard and the thank-you page renders
- Check mobile rendering on actual devices
- Test the 404 page by visiting a fake URL
- Run a Lighthouse audit (target: 95+ on all four metrics)
- Submit sitemap to Google Search Console (`google.com/webmasters`)
- Announce on Instagram

---

## Cost summary (annual)

| Item | Cost |
|---|---|
| Domain (Cloudflare Registrar) | ₹880/year |
| Cloudflare Pages hosting | Free |
| Cloudflare Pages Functions (1M req/month free) | Free |
| Cloudflare DNS | Free |
| Cloudflare Email Routing | Free |
| Cloudflare Web Analytics | Free |
| Razorpay (per transaction) | 2% of sale price |
| Resend (3,000 emails/month free) | Free |
| **Total fixed cost** | **₹880/year (~$10)** |

Only variable cost is the Razorpay 2% transaction fee on real sales.

---

## Open questions to discuss

- **Decap CMS** — want to invest the refactor to enable Tejaswini-editable content? Or keep manual updates for now?
- **27 project pages** — do these in priority order (most important 5 first) or batch the lot?
- **Press section** — keep with placeholders + a "more coming soon" note, or hide until real features land?
- **Newsletter platform** — decide before or after launch?

---

## What to send me next

To unblock launch, send these in any order (oldest emails fine):

1. ✉️ Cloudflare account access / invite
2. ✉️ Razorpay `Key Id` + `Key Secret`
3. ✉️ Resend API key + verified sender email
4. ✉️ Tejaswini's WhatsApp number + studio postal address
5. ✉️ Drive folder link with ~50 photos for the launch swap
6. ✉️ Final pricing confirmations (or a CSV of all 15 prices)
7. ✉️ Tejaswini's signoff on the About bio + Practice copy
8. ✉️ Yes/no on the press placeholders showing

Once those are in, the migration + launch is roughly **3–4 hours of focused work** to take the site live with real keys, real photos, real domain.
