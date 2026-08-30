import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideIcons } from '@ng-icons/core';
import { SUPABASE_AUTH_OPTIONS } from 'shared';
import {
  letsMenu,
  letsCloseRound,
  letsPlay,
  letsArrowRight,
  letsArrowDown,
  letsArrowTop,
  letsLink,
} from '@ng-icons/lets-icons/regular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' })
    ),
    provideClientHydration(withEventReplay()),
    {
      // Landing site only does anonymous reads — no login, no session to persist or
      // refresh — so it should never join the shared auth lock in the first place.
      provide: SUPABASE_AUTH_OPTIONS,
      useValue: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    },
    provideIcons({
      menu: letsMenu,
      close: letsCloseRound,
      arrowRight: letsArrowRight,
      play: letsPlay,
      chevronDown: letsArrowDown,
      chevronUp: letsArrowTop,
      link: letsLink,
      instagram: letsLink,
      facebook: letsLink,
      twitter: letsLink,
      youtube: letsLink,
    }),
  ],
};
