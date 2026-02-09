import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideIcons } from '@ng-icons/core';
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
    provideIcons({
      menu: letsMenu,
      close: letsCloseRound,
      arrowRight: letsArrowRight,
      play: letsPlay,
      chevronDown: letsArrowDown,
      chevronUp: letsArrowTop,
      instagram: letsLink,
      facebook: letsLink,
      twitter: letsLink,
      youtube: letsLink,
    }),
  ],
};
