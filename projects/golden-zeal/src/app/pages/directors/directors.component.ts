import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { AppHeaderComponent } from '../../layout/header/header.component';
import { AppFooterComponent } from '../../layout/footer/footer.component';
import { RevealDirective } from '../../core/directives/reveal.directive';
import type { Director } from 'shared';

@Component({
  selector: 'app-directors',
  standalone: true,
  imports: [RouterLink, AppHeaderComponent, AppFooterComponent, RevealDirective],
  template: `
    <app-header />

    <main style="background: var(--gz-black); min-height: 100vh;">
      <div class="pt-32 pb-12 px-6 md:px-10" style="border-bottom: 1px solid var(--gz-border);">
        <div class="max-w-7xl mx-auto">
          <p class="text-xs tracking-[0.3em] uppercase mb-3" style="color: var(--gz-gold);">Talent</p>
          <h1 class="text-6xl md:text-8xl" style="color: var(--gz-text);">DIRECTORS</h1>
        </div>
      </div>

      <div class="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        @if (loading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (i of [1,2,3]; track i) {
              <div class="aspect-[3/4] skeleton"></div>
            }
          </div>
        } @else if (directors().length === 0) {
          <p class="text-center py-24" style="color: var(--gz-muted);">No directors listed yet.</p>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (director of directors(); track director.id) {
              <a [routerLink]="['/directors', director.slug]" appReveal class="group block">
                <!-- Portrait -->
                <div class="aspect-[3/4] overflow-hidden mb-4 relative" style="background: var(--gz-surface);">
                  @if (director.hero_image_url) {
                    <img
                      [src]="director.hero_image_url"
                      [alt]="director.name"
                      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  } @else {
                    <div class="w-full h-full flex items-center justify-center" style="background: var(--gz-surface2);">
                      <span class="text-6xl" style="color: var(--gz-border); font-family: 'Bebas Neue', sans-serif;">GZP</span>
                    </div>
                  }
                  <!-- Gold overlay on hover -->
                  <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                       style="background: rgba(201,160,74,0.15);">
                    <span class="text-xs tracking-[0.3em] uppercase" style="color: var(--gz-gold);">VIEW PROFILE</span>
                  </div>
                </div>
                <h3 class="text-2xl mb-1 group-hover:text-gz-gold transition-colors" style="color: var(--gz-text);">{{ director.name }}</h3>
                @if (director.location) {
                  <p class="text-xs tracking-widest uppercase" style="color: var(--gz-muted);">{{ director.location }}</p>
                }
              </a>
            }
          </div>
        }
      </div>
    </main>

    <app-footer />
  `,
})
export class DirectorsComponent implements OnInit {
  private readonly content = inject(ContentService);
  directors = signal<Director[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.content.getDirectors().subscribe((d) => {
      this.directors.set(d);
      this.loading.set(false);
    });
  }
}
