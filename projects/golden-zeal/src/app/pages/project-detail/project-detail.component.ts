import { Component, OnInit, OnDestroy, signal, computed, inject, effect, ElementRef, ViewChild } from '@angular/core';
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
          @if (project()!.vimeo_id || project()!.youtube_id) {
            <div class="aspect-video w-full relative" #videoSection>
              <iframe
                [src]="videoUrl()"
                class="w-full h-full"
                frameborder="0"
                tabindex="-1"
                allow="autoplay; fullscreen; picture-in-picture"
                [title]="project()!.title"
              ></iframe>
              <!-- Transparent overlay — intercepts mouse events so native Vimeo/YouTube controls never appear -->
              <div class="absolute inset-0" style="z-index: 1;"></div>
              <!-- Mute toggle (above overlay) -->
              <button
                type="button"
                (click)="toggleMute()"
                class="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 text-xs tracking-[0.15em] uppercase transition-all duration-200"
                style="z-index: 2; background: rgba(0,0,0,0.55); color: var(--gz-text); border: 1px solid rgba(240,235,224,0.2); backdrop-filter: blur(6px);"
              >
                @if (isMuted()) {
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
                  </svg>
                  UNMUTE
                } @else {
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                  </svg>
                  MUTE
                }
              </button>
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
export class ProjectDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly content = inject(ContentService);
  private readonly sanitizer = inject(DomSanitizer);

  @ViewChild('videoSection') videoSection?: ElementRef<HTMLElement>;

  project = signal<Project | null>(null);
  related = signal<Project[]>([]);
  loading = signal(true);
  isMuted = signal(true);

  private scrollObserver?: IntersectionObserver;

  constructor() {
    // Once the project loads and has a video, wire up the scroll observer
    effect(() => {
      const p = this.project();
      if (p?.vimeo_id || p?.youtube_id) {
        // Wait one tick for Angular to render the #videoSection element
        setTimeout(() => this.setupScrollObserver(), 50);
      } else {
        this.scrollObserver?.disconnect();
      }
    });
  }

  bts() {
    return (this.project()?.stills ?? []).slice(0, 4);
  }

  // Always starts muted so autoplay works across all browsers/iOS.
  // YouTube: controls=0&disablekb=1 removes native UI. enablejsapi=1 allows postMessage control.
  // Vimeo: controls are hidden via a transparent overlay in the template (free-plan accounts cannot use controls=0).
  videoUrl = computed((): SafeResourceUrl => {
    const p = this.project();
    if (!p) return '';
    if (p.youtube_id) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${p.youtube_id}?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&controls=0&disablekb=1`
      );
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://player.vimeo.com/video/${p.vimeo_id}?autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0&badge=0&autopause=0&playsinline=1`
    );
  });

  toggleMute(): void {
    if (this.isMuted()) {
      this.postMuteMessage(false);
      this.isMuted.set(false);
    } else {
      this.postMuteMessage(true);
      this.isMuted.set(true);
    }
  }

  private setupScrollObserver(): void {
    const el = this.videoSection?.nativeElement;
    if (!el) return;

    this.scrollObserver?.disconnect();
    this.scrollObserver = new IntersectionObserver(
      ([entry]) => {
        // Auto-mute when less than 30% of the video is visible
        if (entry.intersectionRatio < 0.3 && !this.isMuted()) {
          this.postMuteMessage(true);
          this.isMuted.set(true);
        }
      },
      { threshold: [0, 0.3] }
    );
    this.scrollObserver.observe(el);
  }

  private postMuteMessage(mute: boolean): void {
    const iframe = this.videoSection?.nativeElement.querySelector('iframe') as HTMLIFrameElement | null;
    if (!iframe?.contentWindow) return;

    const p = this.project();
    if (p?.youtube_id) {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: mute ? 'mute' : 'unMute', args: [] }),
        '*'
      );
    } else if (p?.vimeo_id) {
      iframe.contentWindow.postMessage(
        JSON.stringify({ method: 'setVolume', value: mute ? 0 : 1 }),
        'https://player.vimeo.com'
      );
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug') ?? '';
      this.loading.set(true);
      this.isMuted.set(true);
      this.scrollObserver?.disconnect();
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

  ngOnDestroy(): void {
    this.scrollObserver?.disconnect();
  }
}
