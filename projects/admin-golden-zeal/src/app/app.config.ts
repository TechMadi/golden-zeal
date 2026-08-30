import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
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
      useValue: { storageKey: 'sb-golden-zeal-crm-auth-token' },
    },
  ],
};
