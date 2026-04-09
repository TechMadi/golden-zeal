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

        <!-- ── VIDEO HERO ── -->
        <div class="w-full pt-16" style="background: #000;">
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

        <!-- ── TITLE + CREDITS ── -->
        <div class="px-6 md:px-10 py-14 max-w-7xl mx-auto">
          <div class="grid md:grid-cols-[1fr_280px] gap-10 items-start">

            <!-- Left: title + description -->
            <div>
              <p appReveal class="text-xs tracking-[0.3em] uppercase mb-3" style="color: var(--gz-gold);">{{ project()!.category }}</p>
              <h1 appReveal class="mb-6 reveal-delay-1" style="font-size: clamp(2.5rem, 6vw, 5rem); color: var(--gz-text); line-height: 1.05;">
                {{ project()!.title }}
              </h1>
              @if (project()!.description) {
                <p appReveal class="text-base md:text-lg leading-relaxed reveal-delay-2" style="color: var(--gz-muted); max-width: 600px;">
                  {{ project()!.description }}
                </p>
              }
            </div>

            <!-- Right: credits block -->
            <div appReveal class="reveal-delay-1" style="border-left: 1px solid var(--gz-border); padding-left: 2rem;">
              @if (project()!.director) {
                <div class="py-4" style="border-bottom: 1px solid var(--gz-border);">
                  <p class="text-xs tracking-widest uppercase mb-1" style="color: var(--gz-muted);">Director</p>
                  <a [routerLink]="['/directors', project()!.director!.slug]"
                     class="text-base transition-colors hover:opacity-80" style="color: var(--gz-text);">
                    {{ project()!.director!.name }}
                  </a>
                </div>
              }
              @if (project()!.photographer) {
                <div class="py-4" style="border-bottom: 1px solid var(--gz-border);">
                  <p class="text-xs tracking-widest uppercase mb-1" style="color: var(--gz-muted);">Photographer</p>
                  <a [routerLink]="['/photographers', project()!.photographer!.slug]"
                     class="text-base transition-colors hover:opacity-80" style="color: var(--gz-text);">
                    {{ project()!.photographer!.name }}
                  </a>
                </div>
              }
              @if (project()!.client) {
                <div class="py-4" style="border-bottom: 1px solid var(--gz-border);">
                  <p class="text-xs tracking-widest uppercase mb-1" style="color: var(--gz-muted);">Client</p>
                  <p class="text-base" style="color: var(--gz-text);">{{ project()!.client }}</p>
                </div>
              }
              @if (project()!.year) {
                <div class="py-4">
                  <p class="text-xs tracking-widest uppercase mb-1" style="color: var(--gz-muted);">Year</p>
                  <p class="text-base" style="color: var(--gz-text);">{{ project()!.year }}</p>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- ── BEHIND THE SCENES ── -->
        @if (bts().length > 0) {
          <div class="px-6 md:px-10 pb-20 max-w-7xl mx-auto" style="border-top: 1px solid var(--gz-border); padding-top: 4rem;">
            <p appReveal class="text-xs tracking-[0.3em] uppercase mb-3" style="color: var(--gz-gold);">On Set</p>
            <h2 appReveal class="text-4xl md:text-5xl mb-10 reveal-delay-1" style="color: var(--gz-text);">BEHIND THE SCENES</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4" [class.lg:grid-cols-3]="bts().length > 2">
              @for (still of bts(); track still.id; let i = $index) {
                <div appReveal class="overflow-hidden" [class.md:col-span-2]="bts().length === 3 && i === 0">
                  <img
                    [src]="still.image_url"
                    [alt]="project()!.title + ' - behind the scenes'"
                    class="w-full object-cover transition-transform duration-500 hover:scale-105"
                    [class.aspect-video]="bts().length === 3 && i === 0"
                    [class.aspect-[4/3]]="!(bts().length === 3 && i === 0)"
                    loading="lazy"
                  />
                </div>
              }
            </div>
          </div>
        }

        <!-- ── MORE WORK ── -->
        @if (related().length > 0) {
          <div class="px-6 md:px-10 py-16 max-w-7xl mx-auto" style="border-top: 1px solid var(--gz-border);">
            <h2 appReveal class="text-4xl mb-10" style="color: var(--gz-text);">MORE WORK</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              @for (p of related(); track p.id) {
                <a [routerLink]="['/projects', p.slug]" appReveal class="project-card block">
                  <div class="aspect-[4/3] overflow-hidden" style="background: var(--gz-surface);">
                    @if (p.thumbnail_url) {
                      <img [src]="p.thumbnail_url" [alt]="p.title" class="w-full h-full object-cover" loading="lazy" />
                    } @else {
                      <div class="w-full h-full flex items-center justify-center" style="background: var(--gz-surface2);">
                        <span style="color: var(--gz-border); font-family: 'Bebas Neue', sans-serif;">GZP</span>
                      </div>
                    }
                  </div>
                  <div class="card-overlay">
                    <div class="absolute bottom-0 left-0 p-4">
                      @if (p.director) {
                        <p class="text-xs tracking-widest uppercase mb-1" style="color: var(--gz-gold);">{{ p.director.name }}</p>
                      }
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

  bts() {
    return (this.project()?.stills ?? []).slice(0, 4);
  }

  vimeoUrl(): SafeResourceUrl {
    const id = this.project()?.vimeo_id;
    if (!id) return '';
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://player.vimeo.com/video/${id}?autoplay=1&loop=1&title=0&byline=0&portrait=0&badge=0&autopause=0`
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
