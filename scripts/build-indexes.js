#!/usr/bin/env node
/**
 * Studio Nalmé — Collection indexer
 *
 * Decap CMS stores each product, workshop, and press item as its own JSON file
 * (so the editor can list them, edit them, delete them individually). For
 * runtime rendering on the live site, we want a single index file per collection
 * so the page only makes one fetch.
 *
 * This script reads all the files in /data/products/, /data/workshops/, /data/press/
 * and writes index files: /data/products-index.json, /data/workshops-index.json, etc.
 *
 * Runs at build time alongside fetch-instagram.js.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, '..', 'data');

async function buildIndex(collectionDir, outputFile, sortKey, sortDirection = 'asc') {
  const dir = path.join(DATA, collectionDir);
  let entries;
  try {
    entries = await fs.readdir(dir);
  } catch {
    console.warn(`⚠  Skipping ${collectionDir} — folder not found`);
    return;
  }

  const items = [];
  for (const entry of entries) {
    if (!entry.endsWith('.json')) continue;
    try {
      const raw = await fs.readFile(path.join(dir, entry), 'utf-8');
      const data = JSON.parse(raw);
      data._file = entry;
      items.push(data);
    } catch (e) {
      console.warn(`  ✗ Failed to parse ${entry}: ${e.message}`);
    }
  }

  // Sort
  if (sortKey) {
    items.sort((a, b) => {
      const av = a[sortKey] || '';
      const bv = b[sortKey] || '';
      return sortDirection === 'desc' ? bv.localeCompare(av) : av.localeCompare(bv);
    });
  }

  const output = { count: items.length, items };
  await fs.writeFile(path.join(DATA, outputFile), JSON.stringify(output, null, 2));
  console.log(`✓ ${collectionDir}: ${items.length} items → ${outputFile}`);
}

async function main() {
  console.log('→ Building collection index files');
  await buildIndex('products', 'products-index.json', 'category');
  await buildIndex('workshops', 'workshops-index.json', 'sort_date', 'desc');
  await buildIndex('press', 'press-index.json', 'date', 'desc');
  console.log('✓ Indexes built');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(0);
});
