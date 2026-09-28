import { inject } from '@angular/core';
import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import { SupabaseService } from 'shared';

// Firebase Hosting serves static files only, so detail pages are prerendered at
// build time from the slugs in Supabase. Anything added after the last build
// falls back to client rendering until the next deploy.
type SlugTable = 'projects' | 'team_members' | 'apprenticeship_cohorts';

// `optional` tables may not exist yet — skip them instead of failing the build.
function slugsFrom(table: SlugTable, { optional = false } = {}) {
  return async (): Promise<Record<string, string>[]> => {
    const { data, error } = await inject(SupabaseService).client.from(table).select('slug');
    if (error) {
      if (optional) {
        console.warn(`Prerender: skipping ${table} — ${error.message}`);
        return [];
      }
      throw new Error(`Prerender: could not load ${table} slugs — ${error.message}`);
    }
    return ((data ?? []) as { slug: string | null }[])
      .filter((row) => !!row.slug)
      .map((row) => ({ slug: row.slug! }));
  };
}

export const serverRoutes: ServerRoute[] = [
  {
    path: 'projects/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: slugsFrom('projects'),
    fallback: PrerenderFallback.Client,
  },
  {
    path: 'crew/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: slugsFrom('team_members'),
    fallback: PrerenderFallback.Client,
  },
  {
    path: 'apprenticeship/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: slugsFrom('apprenticeship_cohorts', { optional: true }),
    fallback: PrerenderFallback.Client,
  },
  // Retired profile URLs — Firebase 301s these to /crew before Angular sees them
  { path: 'directors/:slug',       renderMode: RenderMode.Client },
  { path: 'photographers/:slug',   renderMode: RenderMode.Client },
  // All other routes prerender at build time
  { path: '**',                    renderMode: RenderMode.Prerender },
];
