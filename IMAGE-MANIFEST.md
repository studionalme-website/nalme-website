# Studio Nalmé — Image Manifest

A single ledger of every photograph that needs to be replaced with real Studio Nalmé photography. Each entry includes file location, current placeholder source, suggested replacement subject, and recommended alt text.

Tejaswini's brief: **all photographs across the site will be replaced**. This doc is the master list for that bulk operation.

---

## How to read this doc

- **File** — which HTML file the reference lives in
- **Line** — approximate line number (search by surrounding text if it shifts)
- **Current** — the placeholder URL
- **Subject needed** — what the real photo should show
- **Alt text** — the accessibility text to use (also helps SEO)
- **Aspect / size** — guidance for the crop

---

## Phase 1: Homepage hero & visual rhythm

### `index.html`

| Line | Current placeholder | Subject needed | Alt text | Aspect / size |
|---|---|---|---|---|
| ~146–147 | Clay-reveal layered images | Hero shot — a Studio Nalmé project that captures the brand instantly. Earth wall + warm interior light, or a craftsperson's hands on lime/clay. | "A Studio Nalmé project — earth, lime, and the light a place holds" | 1920×1280, landscape, hero crop |
| ~588 | Project tile — Wild Pour | The actual Wild Pour cafe in Sakleshpur | "Wild Pour, a coffee pour in laterite and reclaimed teak — Sakleshpur" | 1200×900, 4:3 |
| ~597 | Project tile — Hadibadi | The Hadibadi library, Tejaswini's thesis project | "Hadibadi library — a thesis project mentored by Anna Heringer" | 1200×900, 4:3 |
| ~606 | Project tile — additional work | A built project, ideally rammed-earth or lime exterior | "Earth-built residence — rammed walls under monsoon light" | 1200×900, 4:3 |
| ~615 | Project tile — interiors | An interior project showing material warmth | "Interior with lime plaster, oxide flooring, reclaimed teak" | 1200×900, 4:3 |
| ~624 | Project tile — hospitality | A hospitality project (retreat/cafe) | "A small retreat designed by Studio Nalmé" | 1200×900, 4:3 |
| ~641 | Founder portrait | Tejaswini Krishna P. — workshop or site, hands visible if possible | "Tejaswini Krishna P., founder of Studio Nalmé" | 1100×1400, portrait 4:5 |
| ~714 | Light store preview — Kuri Pendant | Real Kuri Pendant photo, lit | "Kuri Pendant — cane and natural fibre, lit" | 1000×1250, portrait |
| ~722 | Light store preview — Bhoomi | Real Bhoomi Wall Light, mounted on earth wall | "Bhoomi Wall Light on a rammed-earth wall" | 1000×1250, portrait |
| ~730 | Light store preview — Matti | Real Matti Table Light, on a low table | "Matti Table Light — soft and grounded" | 1000×1250, portrait |
| ~760 | Ventures teaser | A landscape that suggests "the land" — your site, a swale, a food forest | "A landscape Studio Nalmé would turn into a venture" | 1200×900, 4:3 |
| ~779 | Journal note thumb — Permaculture | Workshop hands, soil, or planting | "From a permaculture weekend at the studio" | 800×600 |
| ~786 | Journal note thumb — Athangudi | Tile kilns, pigment, master tilemaker | "At the lime kilns of Athangudi" | 800×600 |
| ~793 | Journal note thumb — Kaudi | Kaudi cloth being stitched | "On Kaudi — the affection of stitched cloth" | 800×600 |

### Brand asset — handstrip background

**File:** `index.html` line ~222 (also `about.html` ~225)
- **Current:** Generic hands-in-clay unsplash
- **Subject needed:** Tejaswini's hands (or a craftsperson's hands) working with earth/lime/clay
- **Alt text:** decorative (background image, no alt needed for CSS background)
- **Aspect:** wide landscape, 2400×800

---

## Phase 2: About page

### `about.html`

| Line | Current | Subject needed | Alt text |
|---|---|---|---|
| ~149–150 | Clay-reveal images (same as homepage) | Same as homepage hero | (see homepage) |
| ~608 | Founder portrait | Same as homepage founder | "Tejaswini Krishna P., founder of Studio Nalmé" |
| Page hero background | (if any) | An on-site studio moment | decorative |

---

## Phase 3: Work page (`work.html`)

The Work page has tiles for 27 projects (currently with unsplash placeholders). Tejaswini will need to provide:
- **One hero photo per project**
- **Suggested alt text per project** — usually "Project name — short context, location"

These project images come from the studio's Drive folder (link in earlier context). Plan: bulk export from Drive, rename to slug format (`wild-pour.jpg`, `hadibadi-library.jpg`, etc.), upload to `/assets/projects/`.

---

## Phase 4: Ventures page

### `ventures.html`

| Line | Current | Subject needed | Alt text |
|---|---|---|---|
| ~15 (og:image) | Generic landscape unsplash | A real landscape/site Studio Nalmé has read | "A landscape Studio Nalmé would turn into a venture" |
| ~91 (hero bg) | Generic landscape unsplash | Big, dramatic landscape with implied potential | decorative |
| ~354 | Hospitality case tile | A hospitality project image | "A small hotel sitting inside a food forest" |
| ~364 | Education case tile | A school or learning space | "A school that grows what it teaches" |
| ~374 | Wellness case tile | A retreat in nature | "A retreat in a regenerating landscape" |

---

## Phase 5: Store page (`store.html`)

12 product placeholder images currently from unsplash. Replace with real product photography:

| Category | Product | Alt text |
|---|---|---|
| Light | Kuri Pendant | "Kuri Pendant — cane and natural fibre, single bulb" |
| Light | Bhoomi Wall Light | "Bhoomi Wall Light — cane and brass, for an earth wall" |
| Light | Matti Table Light | "Matti Table Light — natural fibre, low and grounded" |
| Cloth | Kaudi Floor Rug | "Kaudi rug — layered cloth stitched in running lines" |
| Cloth | Kamli Throw Blanket | "Kamli — a village blanket, hand-stitched" |
| Cloth | Floor Cushion Set | "Floor cushions — cotton and kapok fill" |
| Tiles | Athangudi Pattern A | "Athangudi cement tile — four-quadrant geometry" |
| Tiles | Athangudi Ceiling | "Athangudi ceiling tile — smaller format" |
| Tiles | Custom Run | "A custom Athangudi pattern, made for one floor" |
| Wood | Salvaged Teak Beam | "Reclaimed teak beam from a Sirsi house" |
| Wood | Old Karnataka Door | "An old jackwood door, frame and hinges intact" |
| Wood | Small Reclaimed Pieces | "Reclaimed wood — leftover, useful" |
| Cane | Hyacinth Basket | "Water-hyacinth basket — woven by hand" |
| Cane | Cane Screen | "Cane screen — bamboo frame, cane mesh" |
| Cane | Lantana Chair | "Lantana chair — woven from invasive stems" |

Also the **category browser cards** on the Store page (5 images) — each can reuse the first product image from its category.

---

## Phase 6: Product detail pages

### `products/kuri-pendant.html`
- Hero photo (line ~130): Kuri Pendant, lit, hero crop
- Gallery shots (3–4 images): different sizes, install context, detail of the weave
- Specs/scale photo (line ~538): the pendant next to a hand or wall, for scale

(Repeat this pattern when product detail pages exist for Bhoomi, Matti, and the placeholders that get promoted to real products.)

---

## Phase 7: Project detail pages

### `projects/wild-pour.html`
- Hero (single big landscape image)
- Gallery — 6–10 images: site, exterior, interior, details, people in space
- Photo credit line if any

---

## Phase 8: Journal articles

### `journal/permaculture-weekend.html`
- Hero photo (line ~178): workshop participants or soil-reading moment
- In-article inline images (2–3): soil, mapping, hands
- Author photo (small): Tejaswini avatar size

### Future journal articles
- Each new article needs 1 hero + 0–3 inline images

---

## Phase 9: Asset folder structure (recommended)

```
/assets/
  /images/
    /hero/                 ← homepage clay-reveal, page heros
    /projects/             ← real project photos, named by slug
    /products/             ← product photography
    /founder/              ← Tejaswini portraits
    /journal/              ← article hero + inline images
    /workshops/            ← workshop photos
    /process/              ← hands, materials, site visits (for handstrip etc)
```

Upload images here, then in each HTML file find the unsplash URL and replace with the local path. The CSS background-image and the `<img src=>` references both work the same way.

---

## Phase 10: Recommended image specs

**Format:**
- Hero / landscape: WebP at 85% quality, fallback JPG at 80%
- Portrait / product: WebP at 88% quality, fallback JPG at 82%
- Logos / icons: SVG (already done)

**Dimensions:**
- Hero / page-hero backgrounds: 2400px wide × 1600px tall (so it serves crisp on 4K/Retina, downscales gracefully)
- Project tiles / case grid: 1200×900 (4:3)
- Product cards: 1000×1250 (4:5 portrait)
- Journal thumbnails: 800×600 (4:3)
- Founder portrait: 1100×1400 (4:5)
- Avatar (small): 400×400

**Loading:**
- Add `loading="lazy"` to all `<img>` tags below the first viewport
- The hero/above-the-fold images stay `loading="eager"` (default)

---

## Workflow for the swap

1. **Tejaswini provides photos** — ideally renamed to match the slug convention (`wild-pour.jpg`, `kuri-pendant-hero.jpg`, etc.) and dropped into a Drive folder.
2. **Bulk upload** to `/assets/images/[category]/` in the deploy folder.
3. **Find-and-replace** each unsplash URL in the HTML with the local asset path. The grep `unsplash.com` will surface every reference; this manifest groups them by page so we can work file-by-file.
4. **Verify alt text** matches what's recommended above (or what makes more sense for the actual photo content).
5. **Add `loading="lazy"`** to images below the first viewport.
6. **Compress** before upload — Squoosh.app or ImageOptim work well; aim for under 250kb per image, under 80kb for thumbnails.

When you're ready, send me the Drive folder of real photos and I'll do the find-and-replace pass across all files in one session.

---

## Total image count

- Homepage: ~16 images
- About: ~8 images
- Work: ~27 projects = 27 hero images (plus gallery later)
- Ventures: ~5 images
- Store: ~15 product images + 5 category card images = ~20
- Product detail pages: ~5 images each (currently 1 product page; eventually 5)
- Project detail pages: ~8 images each (currently 1; eventually 27)
- Journal: ~4 images per article (currently 1 article)
- Workshops: ~6 images
- Press placeholders: 0 (text-only, by design)

**Approximate total for a full swap: 90–110 images for the launch state, and significantly more (~300+) once all 27 project detail pages have galleries.**

A realistic phase-1 launch needs the homepage + about + work tile heros + product photos + ventures hero. That's roughly **50 images** to get to a launchable state where unsplash is no longer visible anywhere on the marketing-critical pages.
