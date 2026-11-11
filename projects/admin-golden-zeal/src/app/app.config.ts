import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { processLock } from '@supabase/supabase-js';
import { SUPABASE_AUTH_OPTIONS } from 'shared';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top' })
    ),
    {
      // Distinct storage key so the CRM's auth session/lock never collides with the
      // public landing site sharing the same origin (see SUPABASE_AUTH_OPTIONS).
      provide: SUPABASE_AUTH_OPTIONS,
      // processLock serialises auth calls within this tab instead of using the browser's
      // cross-tab Navigator LockManager, which under zone.js surfaces "Acquiring an exclusive
      // Navigator LockManager lock ... immediately failed" whenever the background token
      // refresh finds the lock busy (e.g. /crm open in two tabs, or during sign-in).
      useValue: { storageKey: 'sb-golden-zeal-crm-auth-token', lock: processLock },
    },
  ],
};
