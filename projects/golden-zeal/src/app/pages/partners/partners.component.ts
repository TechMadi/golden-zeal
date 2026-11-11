import { Component, OnInit, signal, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { AppHeaderComponent } from '../../layout/header/header.component';
import { AppFooterComponent } from '../../layout/footer/footer.component';
import { RevealDirective } from '../../core/directives/reveal.directive';
import type { Partner } from 'shared';

@Component({
  selector: 'app-partners',
  standalone: true,
  imports: [RouterLink, NgTemplateOutlet, AppHeaderComponent, AppFooterComponent, RevealDirective],
  template: `
    <app-header />

    <main style="background: var(--gz-black); min-height: 100vh;">
      <div class="pt-32 pb-20 px-6 md:px-10" style="border-bottom: 1px solid var(--gz-border);">
        <div class="max-w-5xl mx-auto">
          <p appReveal class="text-xs tracking-[0.3em] uppercase mb-6" style="color: var(--gz-gold);">Partners</p>
          <h1 appReveal class="leading-tight mb-10 reveal-delay-1"
              style="font-size: clamp(2.5rem, 7vw, 6rem); color: var(--gz-text);">
            THE COMPANIES<br />WE MAKE FILMS WITH.
          </h1>
          <p appReveal class="text-base md:text-lg leading-relaxed max-w-2xl reveal-delay-2" style="color: var(--gz-muted);">
            We work alongside trusted production houses, sound teams and specialists across Africa.
            When a project needs more hands, more gear or more local knowledge, these are the people we call.
          </p>
        </div>
      </div>

      <div class="px-6 md:px-10 py-20 max-w-7xl mx-auto">
        @if (loading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (i of [1, 2, 3]; track i) {
              <div class="aspect-[4/3] skeleton"></div>
            }
          </div>
        } @else if (partners().length === 0) {
          <p style="color: var(--gz-muted);">Partner profiles are coming soon.</p>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            @for (partner of partners(); track partner.id) {
              <!-- A profile only opens once it has projects to show; until then the card stands alone. -->
              @if (partner.project_count) {
                <a [routerLink]="['/partners', partner.slug]" appReveal class="group block">
                  <ng-container *ngTemplateOutlet="card; context: { $implicit: partner, linked: true }" />
                </a>
              } @else {
                <div appReveal>
                  <ng-container *ngTemplateOutlet="card; context: { $implicit: partner, linked: false }" />
                </div>
              }
            }
          </div>
        }
      </div>

      <ng-template #card let-partner let-linked="linked">
        <div class="aspect-[4/3] overflow-hidden mb-5 relative" style="background: var(--gz-surface);">
          @if (partner.cover_url) {
            <img [src]="partner.cover_url" [alt]="partner.name"
                 class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
          } @else {
            <div class="w-full h-full flex items-center justify-center" style="background: var(--gz-surface2);">
              <span class="text-4xl" style="color: var(--gz-border); font-family: 'Bebas Neue', sans-serif;">{{ partner.name }}</span>
            </div>
          }
          <span class="absolute top-3 left-3 text-[10px] tracking-[0.2em] uppercase px-2.5 py-1.5"
                style="background: rgba(10,21,15,0.8); color: var(--gz-gold);">{{ partner.specialty }}</span>
        </div>
        @if (partner.location) {
          <p class="text-xs tracking-[0.2em] uppercase mb-2" style="color: var(--gz-muted);">{{ partner.location }}</p>
        }
        <h2 class="text-3xl mb-2" style="color: var(--gz-text);">{{ partner.name }}</h2>
        <p class="text-sm leading-relaxed" style="color: var(--gz-muted);">{{ partner.role_with_us }}</p>
        @if (linked) {
          <p class="mt-4 text-xs tracking-[0.2em] uppercase" style="color: var(--gz-gold);">View partner →</p>
        }
      </ng-template>

      <div class="px-6 md:px-10 py-20 text-center" style="border-top: 1px solid var(--gz-border);">
        <p appReveal class="text-xs tracking-[0.3em] uppercase mb-4" style="color: var(--gz-gold);">Collaborate</p>
        <h2 appReveal class="text-4xl md:text-6xl mb-8 reveal-delay-1" style="color: var(--gz-text);">WANT TO PARTNER WITH US?</h2>
        <a routerLink="/contact" appReveal class="btn-gold reveal-delay-2">Get In Touch</a>
      </div>
    </main>

    <app-footer />
  `,
})
export class PartnersComponent implements OnInit {
  private readonly content = inject(ContentService);
  partners = signal<Partner[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.content.getPartners().subscribe((p) => {
      this.partners.set(p);
      this.loading.set(false);
    });
  }
}
