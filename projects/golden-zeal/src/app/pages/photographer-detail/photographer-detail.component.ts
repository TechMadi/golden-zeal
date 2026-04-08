import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { AppHeaderComponent } from '../../layout/header/header.component';
import { AppFooterComponent } from '../../layout/footer/footer.component';
import { RevealDirective } from '../../core/directives/reveal.directive';
import type { Photographer, Project } from 'shared';

@Component({
  selector: 'app-photographer-detail',
  standalone: true,
  imports: [RouterLink, AppHeaderComponent, AppFooterComponent, RevealDirective],
  template: `
    <app-header />

    <main style="background: var(--gz-black); min-height: 100vh;">
      @if (loading()) {
        <div class="flex items-center justify-center h-screen">
          <div class="w-8 h-8 border-2 rounded-full animate-spin" style="border-color: var(--gz-gold); border-top-color: transparent;"></div>
        </div>
      } @else if (!photographer()) {
        <div class="flex flex-col items-center justify-center h-screen gap-4">
          <p style="color: var(--gz-muted);">Photographer not found.</p>
          <a routerLink="/photographers" class="btn-outline">Back to Photographers</a>
        </div>
      } @else {
        <!-- Hero -->
        <div class="relative h-[70vh] overflow-hidden" style="background: var(--gz-surface);">
          @if (photographer()!.hero_image_url) {
            <img
              [src]="photographer()!.hero_image_url!"
              [alt]="photographer()!.name"
              class="w-full h-full object-cover object-top"
            />
          }
          <div class="absolute inset-0" style="background: linear-gradient(to top, rgba(15,15,15,1) 0%, rgba(15,15,15,0.3) 60%, transparent 100%);"></div>
          <div class="absolute bottom-0 left-0 px-6 md:px-10 pb-10">
            <p class="text-xs tracking-[0.3em] uppercase mb-3" style="color: var(--gz-gold);">
              {{ photographer()!.specialty ?? 'Photographer' }}
            </p>
            <h1 class="text-6xl md:text-8xl" style="color: var(--gz-text);">{{ photographer()!.name }}</h1>
            @if (photographer()!.location) {
              <p class="text-sm mt-2 tracking-widest uppercase" style="color: var(--gz-muted);">{{ photographer()!.location }}</p>
            }
          </div>
        </div>

        <!-- Bio -->
        @if (photographer()!.bio) {
          <div class="px-6 md:px-10 py-16 max-w-3xl">
            <p appReveal class="text-base md:text-lg leading-relaxed" style="color: var(--gz-muted);">{{ photographer()!.bio }}</p>
          </div>
        }

        <!-- Stills gallery from their projects -->
        @if (projects().length > 0) {
          <div class="px-6 md:px-10 py-12 max-w-7xl mx-auto" style="border-top: 1px solid var(--gz-border);">
            <h2 appReveal class="text-4xl mb-10" style="color: var(--gz-text);">PORTFOLIO</h2>
            <!-- Masonry stills grid -->
            <div class="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
              @for (project of projects(); track project.id) {
                @if (project.thumbnail_url) {
                  <a [routerLink]="['/projects', project.slug]" appReveal class="block break-inside-avoid overflow-hidden group relative">
                    <img
                      [src]="project.thumbnail_url"
                      [alt]="project.title"
                      class="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
                         style="background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);">
                      <p class="text-sm" style="color: var(--gz-text); font-family: 'Bebas Neue', sans-serif;">{{ project.title }}</p>
                    </div>
                  </a>
                }
              }
            </div>
          </div>
        }

        <!-- Back -->
        <div class="px-6 md:px-10 pb-16">
          <a routerLink="/photographers" class="btn-outline">← All Photographers</a>
        </div>
      }
    </main>

    <app-footer />
  `,
})
export class PhotographerDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly content = inject(ContentService);

  photographer = signal<Photographer | null>(null);
  projects = signal<Project[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug') ?? '';
      this.loading.set(true);
      this.content.getPhotographerBySlug(slug).subscribe((p) => {
        this.photographer.set(p);
        this.loading.set(false);
        if (p) {
          this.content.getProjectsByPhotographer(p.id).subscribe((projects) => this.projects.set(projects));
        }
      });
    });
  }
}
