#!/usr/bin/env node
/**
 * Studio Nalmé — Instagram feed build script
 *
 * Pulls recent posts from @studio_nalme via Behold.so (Instagram Graph API wrapper)
 * and writes a clean JSON manifest the site reads at runtime.
 *
 * Runs at build time. If the API is unreachable, preserves whatever was in the
 * existing JSON (graceful degradation, no broken gallery).
 *
 * ─── ENVIRONMENT VARIABLES (set in Cloudflare Pages → Settings → Env vars)
 *   BEHOLD_FEED_URL    = Public JSON URL from your Behold.so dashboard
 *                        (looks like https://feeds.behold.so/abc123xyz)
 *
 * ─── ALTERNATIVE — Instagram Graph API direct (no third party):
 *   Set INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID, comment in the
 *   `fetchDirectFromInstagram()` path at the bottom of this file.
 *
 * ─── USAGE
 *   $ node scripts/fetch-instagram.js
 *   $ POSTS_LIMIT=12 node scripts/fetch-instagram.js   (override the default 8)
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'ig-posts.json');
const DEFAULT_LIMIT = 8;

async function main() {
  const limit = parseInt(process.env.POSTS_LIMIT || DEFAULT_LIMIT, 10);
  const feedUrl = process.env.BEHOLD_FEED_URL;

  if (!feedUrl) {
    console.warn('⚠  BEHOLD_FEED_URL not set — preserving existing data/ig-posts.json');
    return;
  }

  console.log(`→ Fetching from Behold feed (limit: ${limit})`);

  let posts;
  try {
    const res = await fetch(feedUrl, { headers: { 'User-Agent': 'studionalme-build/1.0' } });
    if (!res.ok) throw new Error(`Behold returned HTTP ${res.status}`);
    const data = await res.json();
    posts = (data.posts || []).slice(0, limit);
  } catch (err) {
    console.error(`✗ Fetch failed: ${err.message}`);
    console.warn('  Preserving existing data/ig-posts.json (graceful fallback)');
    return;
  }

  if (!posts.length) {
    console.warn('⚠  Behold returned zero posts. Preserving existing data.');
    return;
  }

  // Normalise Behold's response into our manifest shape
  const manifest = {
    fetched_at: new Date().toISOString(),
    handle: '@studio_nalme',
    profile_url: 'https://www.instagram.com/studio_nalme/',
    posts: posts.map(p => ({
      id: p.id,
      type: detectType(p),
      url: p.permalink,
      // Behold serves thumbnails from their CDN — fast, cached, no Instagram-direct dependency
      image: p.sizes?.medium?.mediaUrl || p.mediaUrl,
      caption: shortenCaption(p.caption || ''),
      timestamp: p.timestamp,
    })),
  };

  // Ensure /data folder exists
  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(manifest, null, 2));

  console.log(`✓ Wrote ${manifest.posts.length} posts to data/ig-posts.json`);
}

function detectType(post) {
  if (post.mediaType === 'VIDEO') return 'reel';
  if (post.mediaType === 'CAROUSEL_ALBUM') return 'carousel';
  return 'post';
}

function shortenCaption(caption) {
  if (!caption) return '';
  // Take the first line, max ~80 chars, strip hashtags from the snippet
  const firstLine = caption.split('\n')[0].replace(/#\w+/g, '').trim();
  return firstLine.length > 80 ? firstLine.slice(0, 80) + '…' : firstLine;
}

main().catch(err => {
  console.error('Fatal:', err);
  // Don't fail the deploy — keep existing JSON in place
  process.exit(0);
});
