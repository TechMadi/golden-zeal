import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { SeoService, SITE_URL } from '../../core/services/seo.service';
import { AppHeaderComponent } from '../../layout/header/header.component';
import { AppFooterComponent } from '../../layout/footer/footer.component';
import { RevealDirective } from '../../core/directives/reveal.directive';
import type { Partner, Project } from 'shared';

const CATEGORY_LABELS: Record<string, string> = {
  commercial: 'Commercial',
  cinematic: 'Narrative',
  music_video: 'Music Video',
  stills: 'Stills',
};

@Component({
  selector: 'app-partner-detail',
  standalone: true,
  imports: [RouterLink, AppHeaderComponent, AppFooterComponent, RevealDirective],
  template: `
    <app-header />

    <main style="background: var(--gz-black); min-height: 100vh;">
      @if (loading()) {
        <div class="flex items-center justify-center h-screen">
          <div class="w-8 h-8 border-2 rounded-full animate-spin" style="border-color: var(--gz-gold); border-top-color: transparent;"></div>
        </div>
      } @else if (!partner()) {
        <div class="flex flex-col items-center justify-center h-screen gap-4">
          <p style="color: var(--gz-muted);">Partner not found.</p>
          <a routerLink="/partners" class="btn-outline">All Partners</a>
        </div>
      } @else {
        <!-- Hero -->
        <div class="relative min-h-[78vh] flex items-end overflow-hidden" style="background: var(--gz-surface);">
          @if (partner()!.cover_url) {
            <img [src]="partner()!.cover_url!" [alt]="partner()!.name" class="absolute inset-0 w-full h-full object-cover" />
          }
          <div class="absolute inset-0"
               style="background: linear-gradient(to top, var(--gz-black) 5%, rgba(10,21,15,0.55) 45%, rgba(10,21,15,0.2));"></div>
          <div class="relative w-full px-6 md:px-10 pb-14 max-w-7xl mx-auto">
            <a routerLink="/partners" class="inline-block mb-6 text-xs tracking-[0.2em] uppercase" style="color: var(--gz-muted);">← All partners</a>
            <p class="text-xs tracking-[0.3em] uppercase" style="color: var(--gz-gold);">{{ partner()!.specialty }}</p>
            <h1 class="my-4" style="font-size: clamp(3rem, 10vw, 8rem); line-height: 0.9; color: var(--gz-text);">{{ partner()!.name }}</h1>
            <p class="max-w-2xl leading-relaxed" style="font-size: clamp(1rem, 2vw, 1.35rem); color: var(--gz-text);">{{ partner()!.role_with_us }}</p>
            @if (partner()!.location || partner()!.website) {
              <p class="mt-5 text-xs tracking-[0.15em] uppercase" style="color: var(--gz-muted);">
                {{ partner()!.location }}
                @if (partner()!.location && partner()!.website) { <span>&nbsp;·&nbsp;</span> }
                @if (partner()!.website) {
                  <a [href]="partner()!.website" target="_blank" rel="noopener" style="color: var(--gz-gold);">{{ websiteLabel() }} ↗</a>
                }
              </p>
            }
          </div>
        </div>

        <div class="px-6 md:px-10 max-w-7xl mx-auto">
          <!-- About -->
          @if (partner()!.bio) {
            <section class="py-20 grid gap-10 md:grid-cols-[1fr_1.6fr] md:gap-20" style="border-bottom: 1px solid var(--gz-border);">
              <div>
                <p appReveal class="text-xs tracking-[0.3em] uppercase mb-4" style="color: var(--gz-gold);">About</p>
                <h2 appReveal class="text-4xl md:text-5xl reveal-delay-1" style="color: var(--gz-text);">WHO THEY ARE</h2>
              </div>
              <div appReveal class="reveal-delay-2">
                @for (para of bioParagraphs(); track $index) {
                  <p class="text-base md:text-lg leading-relaxed mb-4" style="color: var(--gz-muted);">{{ para }}</p>
                }
              </div>
            </section>
          }

          <!-- Projects together -->
          @if (projects().length > 0) {
            <section class="py-20" style="border-bottom: 1px solid var(--gz-border);">
              <p appReveal class="text-xs tracking-[0.3em] uppercase mb-4" style="color: var(--gz-gold);">Projects together</p>
              <h2 appReveal class="text-4xl md:text-5xl mb-10 reveal-delay-1" style="color: var(--gz-text);">WHAT WE'VE MADE TOGETHER</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                @for (project of projects(); track project.id) {
                  <a [routerLink]="['/projects', project.slug]" appReveal class="group block">
                    <div class="aspect-video overflow-hidden mb-4" style="background: var(--gz-surface);">
                      @if (project.thumbnail_url) {
                        <img [src]="project.thumbnail_url" [alt]="project.title"
                             class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      } @else {
                        <div class="w-full h-full flex items-center justify-center" style="background: var(--gz-surface2);">
                          <span style="font-size: 2rem; color: var(--gz-border); font-family: 'Bebas Neue', sans-serif;">GZP</span>
                        </div>
                      }
                    </div>
                    <p class="text-xs tracking-[0.2em] uppercase mb-1" style="color: var(--gz-gold);">
                      {{ categoryLabel(project.category) }}@if (project.year) {<span> · {{ project.year }}</span>}
                    </p>
                    <h3 class="text-2xl" style="color: var(--gz-text);">{{ project.title }}</h3>
                    @if (project.client) {
                      <p class="text-sm" style="color: var(--gz-muted);">{{ project.client }}</p>
                    }
                  </a>
                }
              </div>
            </section>
          }

          <!-- Gallery -->
          @if (partner()!.gallery_urls.length > 0) {
            <section class="py-20" style="border-bottom: 1px solid var(--gz-border);">
              <p appReveal class="text-xs tracking-[0.3em] uppercase mb-4" style="color: var(--gz-gold);">On set</p>
              <h2 appReveal class="text-4xl md:text-5xl mb-10 reveal-delay-1" style="color: var(--gz-text);">GALLERY</h2>
              <div class="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                @for (url of partner()!.gallery_urls; track url; let first = $first) {
                  <div appReveal class="overflow-hidden" [class.col-span-2]="first" [class.lg:row-span-2]="first">
                    <img [src]="url" [alt]="partner()!.name + ' on set'"
                         class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                         [class.aspect-[4/3]]="!first" loading="lazy" />
                  </div>
                }
              </div>
            </section>
          }
        </div>

        <!-- CTA -->
        <div class="px-6 md:px-10 py-24 text-center">
          <p appReveal class="text-xs tracking-[0.3em] uppercase mb-4" style="color: var(--gz-gold);">Work With Us</p>
          <h2 appReveal class="text-4xl md:text-6xl mb-8 reveal-delay-1" style="color: var(--gz-text);">PLANNING A SHOOT IN EAST AFRICA?</h2>
          <a routerLink="/contact" appReveal class="btn-gold reveal-delay-2">Contact Golden Zeal</a>
        </div>
      }
    </main>

    <app-footer />
  `,
})
export class PartnerDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly content = inject(ContentService);
  private readonly seo = inject(SeoService);

  partner = signal<Partner | null>(null);
  projects = signal<Project[]>([]);
  loading = signal(true);

  categoryLabel(category: string): string {
    return CATEGORY_LABELS[category] ?? category;
  }

  bioParagraphs(): string[] {
    return (this.partner()?.bio ?? '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  }

  websiteLabel(): string {
    return (this.partner()?.website ?? '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug') ?? '';
      this.loading.set(true);
      this.projects.set([]);
      this.content.getPartnerBySlug(slug).subscribe((p) => {
        this.partner.set(p);
        this.loading.set(false);
        if (!p) return;
        this.seo.update({
          title: `${p.name} — Partner`,
          description: `${p.name} (${p.specialty}): ${p.role_with_us}`,
          path: `/partners/${p.slug}`,
          image: p.cover_url,
          jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: p.name,
            url: p.website || `${SITE_URL}/partners/${p.slug}`,
            ...(p.cover_url ? { image: p.cover_url } : {}),
            ...(p.bio ? { description: p.bio } : {}),
            ...(p.location ? { location: { '@type': 'Place', name: p.location } } : {}),
          },
        });
        this.content.getProjectsByPartner(p.id).subscribe((projects) => this.projects.set(projects));
      });
    });
  }
}
