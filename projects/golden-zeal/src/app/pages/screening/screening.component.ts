import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppHeaderComponent } from '../../layout/header/header.component';
import { AppFooterComponent } from '../../layout/footer/footer.component';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { PostHogService } from '../../core/services/posthog.service';

@Component({
  selector: 'app-screening',
  standalone: true,
  imports: [AppHeaderComponent, AppFooterComponent, RevealDirective],
  template: `
    <app-header />

    <main style="background: var(--gz-black); min-height: 100vh;">
      <!-- Page header -->
      <div class="pt-32 pb-16 px-6 md:px-10" style="border-bottom: 1px solid var(--gz-border);">
        <div class="max-w-5xl mx-auto">
          <div appReveal class="flex items-center gap-4 mb-3">
            <p class="text-xs tracking-[0.3em] uppercase" style="color: var(--gz-gold);">Screenings</p>
            <span class="text-[0.65rem] tracking-[0.2em] uppercase px-3 py-1"
                  style="color: var(--gz-gold); border: 1px solid var(--gz-gold);">Coming Soon</span>
          </div>
          <h1 appReveal class="reveal-delay-1 leading-tight" style="font-size: clamp(2.5rem, 7vw, 6rem); color: var(--gz-text);">
            FILM<br />SCREENINGS
          </h1>
        </div>
      </div>

      <!-- Intro -->
      <div class="px-6 md:px-10 py-16 max-w-5xl mx-auto">
        <p appReveal class="text-base md:text-lg leading-relaxed max-w-2xl" style="color: var(--gz-muted);">
          We're putting together screening events to bring our work off the timeline and onto the big screen —
          premieres, showcases and conversations with the people behind the stories.
        </p>

        <!-- What to expect -->
        <div class="grid sm:grid-cols-3 gap-8 mt-16">
          @for (item of highlights; track item.title) {
            <div appReveal class="pt-6" style="border-top: 1px solid var(--gz-border);">
              <p class="text-xs tracking-[0.2em] uppercase mb-2" style="color: var(--gz-gold);">{{ item.title }}</p>
              <p class="text-sm leading-relaxed" style="color: var(--gz-muted);">{{ item.copy }}</p>
            </div>
          }
        </div>
      </div>

      <!-- CTA -->
      <div class="px-6 md:px-10 py-20 text-center" style="border-top: 1px solid var(--gz-border);">
        <p appReveal class="text-xs tracking-[0.3em] uppercase mb-4" style="color: var(--gz-gold);">Stay In The Loop</p>
        <h2 appReveal class="text-4xl md:text-6xl mb-8 reveal-delay-1" style="color: var(--gz-text);">WANT TO BE FIRST TO KNOW?</h2>
        <button type="button" (click)="onCtaClick()" appReveal class="btn-gold reveal-delay-2">Get In Touch</button>
      </div>
    </main>

    <app-footer />
  `,
})
export class ScreeningComponent {
  private readonly posthogService = inject(PostHogService);
  private readonly router = inject(Router);

  onCtaClick(): void {
    this.posthogService.posthog.capture('screening_cta_clicked');
    this.router.navigate(['/contact']);
  }

  readonly highlights = [
    { title: 'Premieres',   copy: 'First looks at our latest cinematic and commercial work, on the big screen.' },
    { title: 'Q&A Sessions', copy: 'Conversations with directors, DOPs and cast behind the stories.' },
    { title: 'Community',   copy: 'Open screenings for the local film community across Nairobi and beyond.' },
  ];
}
