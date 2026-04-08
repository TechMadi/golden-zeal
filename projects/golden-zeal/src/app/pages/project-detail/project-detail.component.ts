import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ContentService } from '../../core/services/content.service';
import { AppHeaderComponent } from '../../layout/header/header.component';
import { AppFooterComponent } from '../../layout/footer/footer.component';
import { RevealDirective } from '../../core/directives/reveal.directive';
import type { Project } from 'shared';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [RouterLink, AppHeaderComponent, AppFooterComponent, RevealDirective],
  template: `
    <app-header />

    <main style="background: var(--gz-black); min-height: 100vh;">
      @if (loading()) {
        <div class="flex items-center justify-center h-screen">
          <div class="w-8 h-8 border-2 rounded-full animate-spin" style="border-color: var(--gz-gold); border-top-color: transparent;"></div>
        </div>
      } @else if (!project()) {
        <div class="flex flex-col items-center justify-center h-screen gap-4">
          <p style="color: var(--gz-muted);">Project not found.</p>
          <a routerLink="/commercial" class="btn-outline">Back to Work</a>
        </div>
      } @else {
        <!-- Hero: video or image -->
        <div class="w-full" style="background: #000;">
          @if (project()!.vimeo_id) {
            <div class="aspect-video w-full">
              <iframe
                [src]="vimeoUrl()"
                class="w-full h-full"
                frameborder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                [title]="project()!.title"
              ></iframe>
            </div>
          } @else if (project()!.thumbnail_url) {
            <div class="aspect-[21/9] w-full overflow-hidden">
              <img [src]="project()!.thumbnail_url!" [alt]="project()!.title" class="w-full h-full object-cover" />
            </div>
          }
        </div>

        <!-- Credits -->
        <div class="px-6 md:px-10 py-12 max-w-7xl mx-auto">
          <div class="grid md:grid-cols-[1fr_auto] gap-8 items-start">
            <div>
              <p class="text-xs tracking-[0.3em] uppercase mb-3" style="color: var(--gz-gold);">{{ project()!.category }}</p>
              <h1 class="text-5xl md:text-7xl mb-4" style="color: var(--gz-text);">{{ project()!.title }}</h1>
            </div>
            <!-- Meta table -->
            <div class="space-y-0 min-w-[200px]" style="border-left: 1px solid var(--gz-border); padding-left: 2rem;">
              @if (project()!.client) {
                <div class="py-3" style="border-bottom: 1px solid var(--gz-border);">
                  <p class="text-xs tracking-widest uppercase mb-1" style="color: var(--gz-muted);">Client</p>
                  <p class="text-sm" style="color: var(--gz-text);">{{ project()!.client }}</p>
                </div>
              }
              @if (project()!.director) {
                <div class="py-3" style="border-bottom: 1px solid var(--gz-border);">
                  <p class="text-xs tracking-widest uppercase mb-1" style="color: var(--gz-muted);">Director</p>
                  <a [routerLink]="['/directors', project()!.director!.slug]" class="text-sm transition-colors" style="color: var(--gz-text);">
                    {{ project()!.director!.name }}
                  </a>
                </div>
              }
              @if (project()!.photographer) {
                <div class="py-3" style="border-bottom: 1px solid var(--gz-border);">
                  <p class="text-xs tracking-widest uppercase mb-1" style="color: var(--gz-muted);">Photographer</p>
                  <a [routerLink]="['/photographers', project()!.photographer!.slug]" class="text-sm transition-colors" style="color: var(--gz-text);">
                    {{ project()!.photographer!.name }}
                  </a>
                </div>
              }
              @if (project()!.year) {
                <div class="py-3">
                  <p class="text-xs tracking-widest uppercase mb-1" style="color: var(--gz-muted);">Year</p>
                  <p class="text-sm" style="color: var(--gz-text);">{{ project()!.year }}</p>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Stills gallery -->
        @if (project()!.stills && project()!.stills!.length > 0) {
          <div class="px-6 md:px-10 pb-16 max-w-7xl mx-auto">
            <h2 appReveal class="text-3xl mb-8" style="color: var(--gz-text);">STILLS</h2>
            <div class="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
              @for (still of project()!.stills!; track still.id) {
                <div appReveal class="break-inside-avoid overflow-hidden">
                  <img [src]="still.image_url" [alt]="project()!.title" class="w-full object-cover" loading="lazy" />
                </div>
              }
            </div>
          </div>
        }

        <!-- Related projects -->
        @if (related().length > 0) {
          <div class="px-6 md:px-10 py-16 max-w-7xl mx-auto" style="border-top: 1px solid var(--gz-border);">
            <h2 appReveal class="text-4xl mb-10" style="color: var(--gz-text);">MORE WORK</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              @for (p of related(); track p.id) {
                <a [routerLink]="['/projects', p.slug]" appReveal class="project-card block">
                  <div class="aspect-[4/3] overflow-hidden" style="background: var(--gz-surface);">
                    @if (p.thumbnail_url) {
                      <img [src]="p.thumbnail_url" [alt]="p.title" class="w-full h-full object-cover" loading="lazy" />
                    }
                  </div>
                  <div class="card-overlay">
                    <div class="absolute bottom-0 left-0 p-4">
                      <p class="text-lg" style="color: var(--gz-text); font-family: 'Bebas Neue', sans-serif;">{{ p.title }}</p>
                    </div>
                  </div>
                </a>
              }
            </div>
          </div>
        }
      }
    </main>

    <app-footer />
  `,
})
export class ProjectDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly content = inject(ContentService);
  private readonly sanitizer = inject(DomSanitizer);

  project = signal<Project | null>(null);
  related = signal<Project[]>([]);
  loading = signal(true);

  vimeoUrl(): SafeResourceUrl {
    const id = this.project()?.vimeo_id;
    if (!id) return '';
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0`
    );
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug') ?? '';
      this.loading.set(true);
      this.content.getProjectBySlug(slug).subscribe((p) => {
        this.project.set(p);
        this.loading.set(false);
        if (p) {
          this.content.getProjects(p.category).subscribe((all) => {
            this.related.set(all.filter((r) => r.id !== p.id).slice(0, 3));
          });
        }
      });
    });
  }
}
