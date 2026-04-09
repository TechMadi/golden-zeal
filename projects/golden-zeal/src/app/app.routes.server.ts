import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Dynamic slug routes — rendered on demand (SSR) since content comes from Supabase
  { path: 'projects/:slug',        renderMode: RenderMode.Server },
  { path: 'directors/:slug',       renderMode: RenderMode.Server },
  { path: 'photographers/:slug',   renderMode: RenderMode.Server },
  { path: 'apprenticeship/:slug',  renderMode: RenderMode.Server },
  // All other routes prerender at build time
  { path: '**',                    renderMode: RenderMode.Prerender },
];
