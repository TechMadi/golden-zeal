import { Component } from '@angular/core';
import { AppHeaderComponent } from '../../layout/header/header.component';
import { AppFooterComponent } from '../../layout/footer/footer.component';
import { RevealDirective } from '../../core/directives/reveal.directive';

@Component({
  selector: 'app-apprenticeship',
  standalone: true,
  imports: [AppHeaderComponent, AppFooterComponent, RevealDirective],
  template: `
    <app-header />

    <main style="background: var(--gz-black); min-height: 100vh; display: flex; flex-direction: column;">
      <div class="flex-1 flex flex-col items-center justify-center px-6 text-center" style="padding-top: 10rem; padding-bottom: 10rem;">
        <p appReveal class="text-xs tracking-[0.3em] uppercase mb-6" style="color: var(--gz-gold);">Join The Team</p>
        <h1 appReveal class="reveal-delay-1 leading-none mb-8"
            style="font-size: clamp(4rem, 12vw, 11rem); color: var(--gz-text);">
          COMING<br />SOON
        </h1>
        <div appReveal class="reveal-delay-2 w-16 h-px mx-auto mb-8" style="background: var(--gz-gold);"></div>
        <p appReveal class="text-base md:text-lg leading-relaxed max-w-xl reveal-delay-2" style="color: var(--gz-muted);">
          Our apprenticeship programme is on its way. Stay tuned for opportunities to join the next generation of African filmmakers.
        </p>
      </div>
    </main>

    <app-footer />
  `,
})
export class ApprenticeshipComponent {}
