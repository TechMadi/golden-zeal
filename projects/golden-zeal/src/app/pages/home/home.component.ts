import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ContentService } from '../../core/services/content.service';
import { AppHeaderComponent } from '../../layout/header/header.component';
import { AppFooterComponent } from '../../layout/footer/footer.component';
import { RevealDirective } from '../../core/directives/reveal.directive';
import type { Project, Showreel } from 'shared';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, AppHeaderComponent, AppFooterComponent, RevealDirective],
  template: `
    <app-header />

    <!-- ── HERO: Showreel carousel ── -->
    <section class="relative h-screen w-full overflow-hidden flex flex-col">

      <!-- Background images — crossfade between active reels -->
      @if (reels().length === 0) {
        <div class="absolute inset-0" style="background: linear-gradient(135deg, #0a150f 0%, #152a1d 100%);"></div>
      }
      @for (reel of reels(); track reel.id; let i = $index) {
        <div
          class="absolute inset-0 bg-cover bg-center"
          [style.background-image]="'url(' + reelPoster(reel) + ')'"
          [style.opacity]="i === activeIndex() ? '1' : '0'"
          style="transition: opacity 1s ease;"
        ></div>
      }

      <!-- Background video for the active reel (muted, autoplay) -->
      @if (activeReel()) {
        <div class="hero-video-container absolute inset-0">
          <iframe
            [src]="bgReelSrc()"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            title="Golden Zeal Pictures Showreel"
          ></iframe>
        </div>
      }

      <!-- Dark gradient overlay -->
      <div class="absolute inset-0" style="background: linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.75) 100%);"></div>

      <!-- Watch Showreel — top-left on mobile, vertically centered right on desktop -->
      @if (activeReel()) {
        <button
          (click)="openReel()"
          class="absolute z-20 flex items-center gap-3 group
                 top-24 left-6
                 md:top-1/2 md:-translate-y-1/2 md:left-auto md:right-10"
        >
          <span class="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 group-hover:scale-110"
                style="border: 1px solid rgba(240,235,224,0.35); color: var(--gz-text); background: rgba(0,0,0,0.25);">
            <svg width="11" height="13" viewBox="0 0 12 14" fill="currentColor">
              <path d="M1 1l10 6-10 6V1z"/>
            </svg>
          </span>
          <span class="text-xs tracking-[0.2em] uppercase" style="color: rgba(240,235,224,0.6);">Watch Showreel</span>
        </button>
      }

      <!-- Hero content -->
      <div class="relative z-10 flex-1 flex flex-col justify-end px-6 md:px-10 pb-6 md:pb-8">
        <div class="max-w-7xl w-full mx-auto">
          <p appReveal class="text-xs tracking-[0.3em] uppercase mb-4" style="color: var(--gz-gold);">
            Film &amp; Television Production · Nairobi, Kenya
          </p>
          <h1
            appReveal
            class="leading-none mb-8 reveal-delay-1"
            style="font-size: clamp(3.5rem, 10vw, 10rem); color: var(--gz-text);"
          >
            GOLDEN ZEAL<br />PICTURES
          </h1>
          <div appReveal class="flex flex-wrap gap-4 reveal-delay-2">
            <a routerLink="/commercial" class="btn-gold">View Our Work</a>
            <a routerLink="/contact" class="btn-outline">Start a Project</a>
          </div>
        </div>
      </div>

      <!-- ── Bottom reel strip ── -->
      @if (reels().length > 0) {
        <div class="relative z-10 border-t" style="border-color: rgba(255,255,255,0.06);">
          <div class="grid" [style.grid-template-columns]="'repeat(' + reels().length + ', 1fr)'">
            @for (reel of reels(); track reel.id; let i = $index) {
              <button
                (click)="goTo(i)"
                class="text-left px-4 md:px-6 py-4 md:py-5 transition-all duration-300 border-r last:border-r-0"
                [style.opacity]="i === activeIndex() ? '1' : '0.25'"
                style="border-color: rgba(255,255,255,0.06); background: transparent; cursor: pointer;"
              >
                <!-- Progress line -->
                <div class="mb-3 overflow-hidden" style="height: 1px; background: rgba(255,255,255,0.1);">
                  @if (i === activeIndex()) {
                    <div class="reel-progress-bar" [style.--reel-duration]="reelDuration + 's'" [attr.data-key]="progressKey()"></div>
                  }
                </div>
                <p class="text-xs md:text-sm leading-tight" style="color: rgba(240,235,224,0.5); font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.05em;">
                  {{ reel.title ?? 'Showreel' }}
                </p>
                @if (reel.client) {
                  <p class="text-[10px] md:text-xs mt-1 tracking-wide" style="color: rgba(240,235,224,0.25);">{{ reel.client }}</p>
                }
                @if (reel.director) {
                  <p class="text-[10px] md:text-xs tracking-wide" style="color: rgba(240,235,224,0.25);">{{ reel.director }}</p>
                }
              </button>
            }
          </div>
        </div>
      }
    </section>

    <!-- ── Showreel lightbox ── -->
    @if (reelOpen()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center"
        style="background: rgba(0,0,0,0.92);"
        (click)="closeReel()"
      >
        <!-- Close -->
        <button
          (click)="closeReel()"
          class="absolute top-6 right-8 text-2xl leading-none"
          style="color: rgba(240,235,224,0.5);"
        >✕</button>

        <!-- iframe wrapper — stop click bubbling so clicking video doesn't close -->
        <div
          class="w-full max-w-5xl mx-6 aspect-video"
          (click)="$event.stopPropagation()"
        >
          <iframe
            [src]="reelSrc()"
            class="w-full h-full"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    }

    <!-- ── FEATURED WORK ── -->
    <section class="py-20 md:py-28 px-6 md:px-10" style="background: var(--gz-black);">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-end justify-between mb-12">
          <h2 appReveal class="text-5xl md:text-7xl" style="color: var(--gz-text);">FEATURED WORK</h2>
          <a routerLink="/commercial" appReveal class="btn-outline hidden md:inline-flex">All Projects</a>
        </div>

        @if (loading()) {
          <!-- Skeleton -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (i of [1,2,3]; track i) {
              <div class="aspect-[4/3] skeleton rounded-sm"></div>
            }
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (project of featured(); track project.id; let i = $index) {
              <a
                [routerLink]="['/projects', project.slug]"
                class="project-card block"
                [class.md:col-span-2]="i === 0"
                appReveal
                [class.reveal-delay-1]="i === 1"
                [class.reveal-delay-2]="i === 2"
              >
                <div [class.aspect-video]="i === 0" [class.aspect-[4/3]]="i !== 0" class="overflow-hidden relative" style="background: var(--gz-surface);">
                  @if (project.thumbnail_url) {
                    <img
                      [src]="project.thumbnail_url"
                      [alt]="project.title"
                      class="w-full h-full object-cover"
                      loading="lazy"
                    />
                  } @else {
                    <div class="w-full h-full flex flex-col items-center justify-center gap-3" style="background: var(--gz-surface2);">
                      <span class="text-4xl md:text-6xl" style="color: var(--gz-border); font-family: 'Bebas Neue', sans-serif;">GZP</span>
                      <span class="text-xs tracking-[0.2em] uppercase" style="color: var(--gz-muted);">{{ project.category }}</span>
                    </div>
                  }
                </div>
                <div class="card-overlay">
                  <div class="absolute bottom-0 left-0 p-5">
                    <p class="text-xs tracking-[0.2em] uppercase mb-1" style="color: var(--gz-gold);">{{ project.category }}</p>
                    <p class="text-xl" style="color: var(--gz-text); font-family: 'Bebas Neue', sans-serif;">{{ project.title }}</p>
                    @if (project.client) {
                      <p class="text-xs mt-1" style="color: var(--gz-muted);">{{ project.client }}</p>
                    }
                  </div>
                </div>
              </a>
            }
          </div>
          <div class="mt-8 md:hidden">
            <a routerLink="/commercial" class="btn-outline w-full justify-center">All Projects</a>
          </div>
        }
      </div>
    </section>

    <!-- ── MISSION ── -->
    <section class="py-20 md:py-28 px-6 md:px-10" style="background: var(--gz-surface);">
      <div class="max-w-4xl mx-auto text-center">
        <p appReveal class="text-xs tracking-[0.3em] uppercase mb-6" style="color: var(--gz-gold);">Our Story</p>
        <h2 appReveal class="text-4xl md:text-6xl lg:text-7xl leading-tight mb-8" style="color: var(--gz-text);">
          30 YEARS OF COMBINED<br />EXPERIENCE. ONE CONTINENT'S<br />STORIES.
        </h2>
        <p appReveal class="text-base md:text-lg leading-relaxed mb-10 reveal-delay-1" style="color: var(--gz-muted); max-width: 640px; margin-left: auto; margin-right: auto;">
          Golden Zeal Pictures is a boutique Film and TV Technical Agency based in Nairobi, Kenya
          operating across East, Central, West and Southern Africa — and beyond into Southeast Asia and India.
          We supply film technology, technical services and skilled crew with solid credentials from
          countless international and local productions.
        </p>
        <div appReveal class="flex flex-wrap justify-center gap-4 reveal-delay-2">
          <a routerLink="/crew" class="btn-gold">Meet The Crew</a>
        </div>
      </div>
    </section>

    <!-- ── STATS ── -->
    <section class="py-16 px-6 md:px-10" style="background: var(--gz-black); border-top: 1px solid var(--gz-border);">
      <div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
        @for (stat of stats; track stat.label) {
          <div appReveal class="text-center md:border-r last:border-r-0 md:px-8" style="border-color: var(--gz-border);">
            <p class="text-4xl md:text-6xl mb-2" style="color: var(--gz-gold); font-family: 'Bebas Neue', sans-serif;">{{ stat.value }}</p>
            <p class="text-xs tracking-[0.2em] uppercase" style="color: var(--gz-muted);">{{ stat.label }}</p>
          </div>
        }
      </div>
    </section>

    <!-- ── WORK CATEGORIES ── -->
    <section class="py-20 md:py-28 px-6 md:px-10" style="background: var(--gz-surface);">
      <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-1">
        @for (cat of categories; track cat.path) {
          <a
            [routerLink]="cat.path"
            appReveal
            class="relative overflow-hidden group block aspect-[16/9]"
            style="background: var(--gz-surface2);"
          >
            <div class="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
              <p class="text-xs tracking-[0.3em] uppercase mb-3 transition-colors duration-300 group-hover:text-gz-gold" style="color: var(--gz-muted);">Explore</p>
              <h3 class="text-5xl md:text-6xl transition-colors duration-300" style="color: var(--gz-text); font-family: 'Bebas Neue', sans-serif;">{{ cat.label }}</h3>
            </div>
            <div class="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500" style="background: var(--gz-gold);"></div>
          </a>
        }
      </div>
    </section>

    <app-footer />
  `,
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly content   = inject(ContentService);
  private readonly sanitizer = inject(DomSanitizer);

  featured    = signal<Project[]>([]);
  reels       = signal<Showreel[]>([]);
  loading     = signal(true);
  activeIndex = signal(0);
  progressKey = signal(0);
  reelOpen    = signal(false);

  activeReel = computed(() => this.reels()[this.activeIndex()] ?? null);

  readonly reelDuration = 30;
  private timer: ReturnType<typeof setInterval> | null = null;

  readonly stats = [
    { value: '2024', label: 'Founded' },
    { value: '16+',  label: 'Producers' },
    { value: '300+', label: 'Projects' },
    { value: '2',    label: 'Awards' },
  ];

  readonly categories = [
    { path: '/commercial', label: 'COMMERCIAL' },
    { path: '/cinematic',  label: 'CINEMATIC'  },
  ];

  bgReelSrc(): SafeResourceUrl {
    const r = this.activeReel();
    if (!r) return '';
    if (r.youtube_id) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${r.youtube_id}?autoplay=1&mute=1&loop=1&playlist=${r.youtube_id}&controls=0&disablekb=1&modestbranding=1&playsinline=1`
      );
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://player.vimeo.com/video/${r.vimeo_id}?background=1&autoplay=1&loop=1&muted=1&badge=0&autopause=0&playsinline=1`
    );
  }

  openReel(): void {
    this.reelOpen.set(true);
    if (this.timer) clearInterval(this.timer);
  }

  closeReel(): void {
    this.reelOpen.set(false);
    if (this.reels().length > 1) this.startTimer();
  }

  reelSrc(): SafeResourceUrl {
    const r = this.activeReel();
    if (!r) return '';
    if (r.youtube_id) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${r.youtube_id}?autoplay=1&rel=0&modestbranding=1`
      );
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://player.vimeo.com/video/${r.vimeo_id}?autoplay=1&badge=0`
    );
  }

  reelPoster(reel: Showreel): string {
    if (reel.thumbnail_url) return reel.thumbnail_url;
    if (reel.youtube_id) return `https://img.youtube.com/vi/${reel.youtube_id}/maxresdefault.jpg`;
    return '';
  }

  goTo(index: number): void {
    this.activeIndex.set(index);
    this.progressKey.update((k) => k + 1);
    this.resetTimer();
  }

  private advance(): void {
    const next = (this.activeIndex() + 1) % this.reels().length;
    this.activeIndex.set(next);
    this.progressKey.update((k) => k + 1);
  }

  private startTimer(): void {
    this.timer = setInterval(() => this.advance(), this.reelDuration * 1000);
  }

  private resetTimer(): void {
    if (this.timer) clearInterval(this.timer);
    this.startTimer();
  }

  ngOnInit(): void {
    this.content.getFeaturedProjects().subscribe((projects) => {
      this.featured.set(projects);
      this.loading.set(false);
    });
    this.content.getShowreels().subscribe((reels) => {
      this.reels.set(reels);
      if (reels.length > 1) this.startTimer();
    });
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }
}
