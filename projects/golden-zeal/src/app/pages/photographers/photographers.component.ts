import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { AppHeaderComponent } from '../../layout/header/header.component';
import { AppFooterComponent } from '../../layout/footer/footer.component';
import { RevealDirective } from '../../core/directives/reveal.directive';
import type { Photographer } from 'shared';

@Component({
  selector: 'app-photographers',
  standalone: true,
  imports: [RouterLink, AppHeaderComponent, AppFooterComponent, RevealDirective],
  template: `
    <app-header />

    <main style="background: var(--gz-black); min-height: 100vh;">
      <div class="pt-32 pb-12 px-6 md:px-10" style="border-bottom: 1px solid var(--gz-border);">
        <div class="max-w-7xl mx-auto">
          <p class="text-xs tracking-[0.3em] uppercase mb-3" style="color: var(--gz-gold);">Talent</p>
          <h1 class="text-6xl md:text-8xl" style="color: var(--gz-text);">PHOTOGRAPHERS</h1>
        </div>
      </div>

      <div class="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        @if (loading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (i of [1,2,3]; track i) {
              <div class="aspect-[3/4] skeleton"></div>
            }
          </div>
        } @else if (photographers().length === 0) {
          <p class="text-center py-24" style="color: var(--gz-muted);">No photographers listed yet.</p>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (photographer of photographers(); track photographer.id) {
              <a [routerLink]="['/photographers', photographer.slug]" appReveal class="group block">
                <div class="aspect-[3/4] overflow-hidden mb-4 relative" style="background: var(--gz-surface);">
                  @if (photographer.hero_image_url) {
                    <img
                      [src]="photographer.hero_image_url"
                      [alt]="photographer.name"
                      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  } @else {
                    <div class="w-full h-full flex items-center justify-center" style="background: var(--gz-surface2);">
                      <span class="text-6xl" style="color: var(--gz-border); font-family: 'Bebas Neue', sans-serif;">GZP</span>
                    </div>
                  }
                  <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                       style="background: rgba(201,160,74,0.15);">
                    <span class="text-xs tracking-[0.3em] uppercase" style="color: var(--gz-gold);">VIEW PROFILE</span>
                  </div>
                </div>
                <h3 class="text-2xl mb-1" style="color: var(--gz-text);">{{ photographer.name }}</h3>
                @if (photographer.specialty) {
                  <p class="text-xs tracking-widest uppercase mb-1" style="color: var(--gz-gold);">{{ photographer.specialty }}</p>
                }
                @if (photographer.location) {
                  <p class="text-xs tracking-widest uppercase" style="color: var(--gz-muted);">{{ photographer.location }}</p>
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
export class PhotographersComponent implements OnInit {
  private readonly content = inject(ContentService);
  photographers = signal<Photographer[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.content.getPhotographers().subscribe((p) => {
      this.photographers.set(p);
      this.loading.set(false);
    });
  }
}
