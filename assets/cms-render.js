/**
 * Studio Nalmé — CMS render layer
 *
 * Reads JSON files in /data/ that the Decap CMS edits, and updates the visible
 * HTML on each page. Silent fallback throughout: if a JSON file is missing or
 * malformed, the static HTML stays as it is.
 *
 * Loaded after assets/scripts.js on every page. Tiny — under 6KB minified.
 */
(async function () {
  const data = {};

  // Helper — fetch a JSON file with cache disabled (so edits show immediately on re-deploy)
  async function load(path) {
    try {
      const res = await fetch(path, { cache: 'no-cache' });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  // Parallel-load everything we might need
  const [site, products, workshops, igCurated, press, ventureCases, videos, trustStrip] = await Promise.all([
    load('/data/site.json'),
    load('/data/products-index.json').catch(() => null),
    load('/data/workshops-index.json').catch(() => null),
    load('/data/ig-curated.json'),
    load('/data/press-index.json').catch(() => null),
    load('/data/venture-cases.json'),
    load('/data/videos.json'),
    load('/data/trust-strip.json'),
  ]);

  // ─── 1. SITE CONFIG — phone, email, address (every page footer) ───
  if (site) {
    // WhatsApp links
    document.querySelectorAll('a[href*="wa.me/"]').forEach(a => {
      if (site.whatsapp_number) a.href = `https://wa.me/${site.whatsapp_number}`;
    });
    // Phone display strings
    document.querySelectorAll('[data-cms="phone-display"]').forEach(el => {
      if (site.phone_display) el.textContent = site.phone_display;
    });
    // Email
    document.querySelectorAll('a[href^="mailto:hello@"]').forEach(a => {
      if (site.email_general) {
        a.href = `mailto:${site.email_general}`;
        if (a.textContent.includes('@')) a.textContent = site.email_general;
      }
    });
    document.querySelectorAll('a[href^="mailto:ventures@"]').forEach(a => {
      if (site.email_ventures) {
        a.href = `mailto:${site.email_ventures}`;
        if (a.textContent.includes('@')) a.textContent = site.email_ventures;
      }
    });
    // Address
    document.querySelectorAll('[data-cms="address"]').forEach(el => {
      if (site.address) el.innerHTML = site.address.replace(/\n/g, '<br>');
    });
  }

  // ─── 2. TRUST STRIP (Store page) ───
  if (trustStrip?.items?.length) {
    const strip = document.querySelector('.store-trust-inner');
    if (strip) {
      strip.innerHTML = trustStrip.items
        .map(i => `<span class="store-trust-item">${escapeHtml(i.text)}</span>`)
        .join('');
    }
  }

  // ─── 3. VIDEOS — toggle the hero + manifesto loops on/off ───
  if (videos) {
    if (videos.hero && !videos.hero.enabled) {
      document.querySelectorAll('.hero-video').forEach(v => v.remove());
    }
    if (videos.manifesto && !videos.manifesto.enabled) {
      document.querySelectorAll('.credo-video').forEach(v => v.remove());
    }
  }

  // ─── 4. FEATURED INSTAGRAM (4-card row on About, 5-thumb strip on home) ───
  if (igCurated?.posts?.length) {
    const cardRow = document.querySelector('.itw-ig');
    if (cardRow) {
      cardRow.innerHTML = igCurated.posts.slice(0, 4).map(p => `
        <a class="itw-post" href="${escapeAttr(p.url)}" target="_blank" rel="noopener noreferrer">
          <span class="itw-post-meta">${cap(p.type)}</span>
          <div class="itw-post-img" style="background-image:url('${escapeAttr(p.image)}')"></div>
          <div class="itw-post-cap">${escapeHtml(p.caption || '')}</div>
        </a>
      `).join('');
    }

    const stripGrid = document.querySelector('.ig-strip-grid');
    if (stripGrid) {
      const thumbs = igCurated.posts.slice(0, 5);
      stripGrid.innerHTML = thumbs.map(p => `
        <a class="ig-strip-thumb" href="${escapeAttr(p.url)}" target="_blank" rel="noopener noreferrer"
           aria-label="${escapeAttr(p.caption || 'studio_nalme on Instagram')}"
           style="background-image:url('${escapeAttr(p.image)}')"></a>
      `).join('');
    }
  }

  // (Products and workshops are large collections and need an index file generated at build time.
  // See scripts/build-indexes.js — runs alongside fetch-instagram.js)

  // ─── HELPERS ───
  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }
  function escapeAttr(s) { return escapeHtml(s); }
  function cap(s) { return s ? s[0].toUpperCase() + s.slice(1) : ''; }
})();
