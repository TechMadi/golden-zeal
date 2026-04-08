import { Component, OnInit, signal, inject } from '@angular/core';
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

    <!-- ── HERO: Fullscreen video reel ── -->
    <section class="relative h-screen w-full overflow-hidden">
      <!-- Vimeo background player -->
      @if (showreel()) {
        <div class="hero-video-container absolute inset-0">
          <iframe
            [src]="vimeoSrc()"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            title="Golden Zeal Pictures Showreel"
          ></iframe>
        </div>
      } @else {
        <!-- Fallback dark gradient -->
        <div class="absolute inset-0" style="background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);"></div>
      }

      <!-- Dark overlay -->
      <div class="absolute inset-0" style="background: rgba(0,0,0,0.55);"></div>

      <!-- Hero content -->
      <div class="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-24 px-6 md:px-10">
        <div class="max-w-7xl w-full mx-auto">
          <p class="text-xs tracking-[0.3em] uppercase mb-4 reveal" style="color: var(--gz-gold);">
            Film &amp; Television Production · Nairobi, Kenya
          </p>
          <h1
            class="leading-none mb-8 reveal reveal-delay-1"
            style="font-size: clamp(3.5rem, 10vw, 10rem); color: var(--gz-text);"
          >
            GOLDEN ZEAL<br />PICTURES
          </h1>
          <div class="flex flex-wrap gap-4 reveal reveal-delay-2">
            <a routerLink="/commercial" class="btn-gold">View Our Work</a>
            <a routerLink="/contact" class="btn-outline">Start a Project</a>
          </div>
        </div>

        <!-- Scroll cue -->
        <div class="absolute bottom-8 right-10 hidden md:flex flex-col items-center gap-2">
          <span class="text-[10px] tracking-[0.3em] uppercase" style="color: var(--gz-muted); writing-mode: vertical-rl;">Scroll</span>
          <div class="w-[1px] h-12 animate-pulse" style="background: var(--gz-gold);"></div>
        </div>
      </div>
    </section>

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
                <div [class.aspect-video]="i === 0" [class.aspect-[4/3]]="i !== 0" class="overflow-hidden" style="background: var(--gz-surface);">
                  @if (project.thumbnail_url) {
                    <img
                      [src]="project.thumbnail_url"
                      [alt]="project.title"
                      class="w-full h-full object-cover"
                      loading="lazy"
                    />
                  } @else {
                    <div class="w-full h-full skeleton"></div>
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
        <p class="text-xs tracking-[0.3em] uppercase mb-6 reveal" style="color: var(--gz-gold);">Our Story</p>
        <h2 appReveal class="text-4xl md:text-6xl lg:text-7xl leading-tight mb-8" style="color: var(--gz-text);">
          30 YEARS OF COMBINED<br />EXPERIENCE. ONE CONTINENT'S<br />STORIES.
        </h2>
        <p appReveal class="text-base md:text-lg leading-relaxed mb-10 reveal-delay-1" style="color: var(--gz-muted); max-width: 640px; margin-left: auto; margin-right: auto;">
          Golden Zeal Pictures is a boutique Film and TV Technical Agency based in Nairobi, Kenya
          operating across East, Central, West and Southern Africa — and beyond into Southeast Asia and India.
          We supply film technology, technical services and skilled crew with solid credentials from
          countless international and local productions.
        </p>
        <div class="flex flex-wrap justify-center gap-4 reveal reveal-delay-2">
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
export class HomeComponent implements OnInit {
  private readonly content = inject(ContentService);

  private readonly sanitizer = inject(DomSanitizer);
  featured = signal<Project[]>([]);
  showreel = signal<Showreel | null>(null);
  loading = signal(true);

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

  vimeoSrc(): SafeResourceUrl {
    const s = this.showreel();
    if (!s) return '';
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://player.vimeo.com/video/${s.vimeo_id}?autoplay=1&loop=1&muted=1&controls=0&byline=0&title=0&portrait=0&transparent=0`
    );
  }

  ngOnInit(): void {
    this.content.getFeaturedProjects().subscribe((projects) => {
      this.featured.set(projects);
      this.loading.set(false);
    });
    this.content.getShowreel().subscribe((s) => this.showreel.set(s));
  }
}
