import { Injectable, inject, DOCUMENT } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export const SITE_URL = 'https://goldenzealpictures.co.ke';
export const SITE_NAME = 'Golden Zeal Pictures';
const DEFAULT_IMAGE = `${SITE_URL}/assets/brand/og-image.png`;

export const DEFAULT_DESCRIPTION =
  'Golden Zeal Pictures is a film and television production company in Nairobi, Kenya. ' +
  'We tell the most compelling stories for global audiences — commercials, documentaries ' +
  'and narrative films across Africa and beyond.';

export interface SeoData {
  /** Page title without the site name — it is appended automatically. Omit for the homepage. */
  title?: string;
  description?: string;
  /** Path starting with "/", used for the canonical and og:url. */
  path: string;
  image?: string | null;
  type?: 'website' | 'article' | 'video.other' | 'profile';
  /** schema.org JSON-LD for this page (the site-wide Organization block stays in index.html). */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const JSON_LD_ID = 'page-jsonld';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);

  update(data: SeoData): void {
    const fullTitle = data.title
      ? `${data.title} | ${SITE_NAME}`
      : `${SITE_NAME} — Film & TV Production Company | Nairobi, Kenya`;
    const description = truncate(data.description?.trim() || DEFAULT_DESCRIPTION, 160);
    const url = SITE_URL + (data.path === '/' ? '' : data.path.split(/[?#]/)[0]);
    const image = data.image || DEFAULT_IMAGE;

    this.title.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: description });

    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:type', content: data.type ?? 'website' });

    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    this.setCanonical(url);
    this.setJsonLd(data.jsonLd);
  }

  private setJsonLd(jsonLd: SeoData['jsonLd']): void {
    this.doc.getElementById(JSON_LD_ID)?.remove();
    if (!jsonLd) return;
    const script = this.doc.createElement('script');
    script.id = JSON_LD_ID;
    script.type = 'application/ld+json';
    // Escape "<" so text like "</script>" in a description can't end the tag early.
    script.textContent = JSON.stringify(jsonLd).replace(/</g, '\\u003c');
    this.doc.head.appendChild(script);
  }

  private setCanonical(url: string): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}

function truncate(text: string, max: number): string {
  const flat = text.replace(/\s+/g, ' ');
  if (flat.length <= max) return flat;
  return flat.slice(0, flat.lastIndexOf(' ', max - 1)).replace(/[,.;:—-]+$/, '') + '…';
}
