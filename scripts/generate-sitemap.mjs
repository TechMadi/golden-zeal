// Builds sitemap.xml from the prerendered landing pages, so it always matches
// what was actually built (including every project and crew profile).
// Run after `ng build golden-zeal`.
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const SITE_URL = 'https://goldenzealpictures.co.ke';
const ROOT = 'dist/golden-zeal/browser';
// Admin app and retired URLs that only redirect elsewhere.
const EXCLUDE = ['crm', 'assets', 'cinematic', 'directors', 'photographers'];

function findPages(dir) {
  const pages = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (dir === ROOT && EXCLUDE.includes(name)) continue;
      pages.push(...findPages(full));
    } else if (name === 'index.html') {
      pages.push(relative(ROOT, dir).split(sep).join('/'));
    }
  }
  return pages;
}

const today = new Date().toISOString().slice(0, 10);
const paths = findPages(ROOT).sort((a, b) => a.split('/').length - b.split('/').length || a.localeCompare(b));
const urls = paths
  .map((p) => `  <url><loc>${SITE_URL}/${p}</loc><lastmod>${today}</lastmod></url>`.replace(`${SITE_URL}/<`, `${SITE_URL}<`))
  .join('\n');

writeFileSync(
  join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);
console.log(`sitemap.xml: ${paths.length} URLs`);
