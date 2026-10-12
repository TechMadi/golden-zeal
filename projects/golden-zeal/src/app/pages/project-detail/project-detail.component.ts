import { Component, OnInit, OnDestroy, signal, computed, inject, effect, ElementRef, ViewChild, HostListener, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ContentService } from '../../core/services/content.service';
import { SeoService, SITE_NAME, SITE_URL } from '../../core/services/seo.service';
import { AppHeaderComponent } from '../../layout/header/header.component';
import { AppFooterComponent } from '../../layout/footer/footer.component';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { PostHogService } from '../../core/services/posthog.service';
import type { Project } from 'shared';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [RouterLink, NgTemplateOutlet, AppHeaderComponent, AppFooterComponent, RevealDirective],
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
        <div class="w-full" style="background: #000;">
          @if (project()!.vimeo_id || project()!.youtube_id) {
            <!-- Shown as cinema widescreen (2.4:1), but never shorter than 40% of the screen height —
                 on narrow screens 2.4:1 alone is a thin strip. Many reels are letterboxed inside a 16:9
                 frame, so the 16:9 player is sized for its 2.4:1 picture to cover the box, centred, and
                 the overflow (black bars, plus the sides on tall boxes) is cropped off. -->
            <div class="w-full relative overflow-hidden" style="height: max(41.667vw, 40vh);" #videoSection>
              <iframe
                [src]="videoUrl()"
                class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 aspect-video"
                style="width: max(100vw, 96vh);"
                frameborder="0"
                tabindex="-1"
                allow="autoplay; fullscreen; picture-in-picture"
                [title]="project()!.title"
              ></iframe>
              <!-- Transparent overlay — intercepts mouse events so native Vimeo/YouTube controls never appear.
                   The top fade keeps the nav readable over bright footage. -->
              <div class="absolute inset-0" style="z-index: 1; background: linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 22%);"></div>
              <!-- Watch Film — opens the full, uncropped video with sound and controls -->
              <button
                type="button"
                (click)="openFilm()"
                class="absolute bottom-4 left-4 md:left-10 flex items-center gap-3 group"
                style="z-index: 2;"
              >
                <span class="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 group-hover:scale-110"
                      style="border: 1px solid rgba(240,235,224,0.35); color: var(--gz-text); background: rgba(0,0,0,0.35);">
                  <svg width="11" height="13" viewBox="0 0 12 14" fill="currentColor"><path d="M1 1l10 6-10 6V1z"/></svg>
                </span>
                <span class="text-xs tracking-[0.2em] uppercase" style="color: var(--gz-text);">Watch Film</span>
              </button>
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

        <!-- ── TITLE ── -->
        <div class="px-6 md:px-10 pt-14 max-w-7xl mx-auto">
          <p appReveal class="text-xs tracking-[0.3em] uppercase mb-3" style="color: var(--gz-gold);">{{ project()!.category }}</p>
          <h1 appReveal class="mb-10 reveal-delay-1" style="font-size: clamp(2.5rem, 6vw, 5rem); color: var(--gz-text); line-height: 1.05;">
            {{ project()!.title }}
          </h1>
        </div>

        <!-- ── DETAILS ──
             With a description: description on the left; client, year and crew stacked on the right.
             Without one: the crew fills the left; client and year stay on the right. -->
        <div class="px-6 md:px-10 pb-14 max-w-7xl mx-auto">
          <div class="grid md:grid-cols-[1fr_280px] gap-10 items-stretch">

            <!-- Left -->
            <div>
              @if (project()!.description) {
                <p appReveal class="text-base md:text-lg leading-relaxed reveal-delay-2" style="color: var(--gz-muted); max-width: 600px;">
                  {{ project()!.description }}
                </p>
              } @else if (groupedCredits().length > 0) {
                <p appReveal class="text-xs tracking-[0.3em] uppercase mb-2" style="color: var(--gz-gold);">Crew</p>
                <div appReveal class="grid grid-cols-1 sm:grid-cols-2 gap-x-10 reveal-delay-1">
                  @for (group of groupedCredits(); track group.role) {
                    <div class="py-4" style="border-bottom: 1px solid var(--gz-border);">
                      <ng-container *ngTemplateOutlet="creditTpl; context: { $implicit: group }" />
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Right -->
            <div appReveal class="reveal-delay-1 md:border-l md:pl-8" style="border-color: var(--gz-border);">
              @if (project()!.client) {
                <div class="pb-4 mb-4" style="border-bottom: 1px solid var(--gz-border);">
                  <p class="text-xs tracking-widest uppercase mb-1" style="color: var(--gz-muted);">Client</p>
                  <p class="text-base" style="color: var(--gz-text);">{{ project()!.client }}</p>
                </div>
              }
              @if (project()!.year) {
                <div class="pb-4 mb-4" style="border-bottom: 1px solid var(--gz-border);">
                  <p class="text-xs tracking-widest uppercase mb-1" style="color: var(--gz-muted);">Year</p>
                  <p class="text-base" style="color: var(--gz-text);">{{ project()!.year }}</p>
                </div>
              }
              @if (project()!.description && groupedCredits().length > 0) {
                <p class="text-xs tracking-[0.3em] uppercase mt-8 mb-2" style="color: var(--gz-gold);">Crew</p>
                @for (group of groupedCredits(); track group.role) {
                  <div class="py-4" style="border-bottom: 1px solid var(--gz-border);">
                    <ng-container *ngTemplateOutlet="creditTpl; context: { $implicit: group }" />
                  </div>
                }
              }
            </div>
          </div>
        </div>

        <ng-template #creditTpl let-group>
          <p class="text-xs tracking-widest uppercase mb-1" style="color: var(--gz-muted);">{{ group.role }}</p>
          <p class="text-base" style="color: var(--gz-text);">
            @for (entry of group.entries; track entry.name; let last = $last) {
              @if (entry.slug) {
                <a [routerLink]="['/crew', entry.slug]" class="transition-colors hover:opacity-80" style="color: var(--gz-text);">{{ entry.name }}</a>
              } @else {
                {{ entry.name }}
              }
              @if (!last) {<span>, </span>}
            }
          </p>
        </ng-template>

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

        <!-- ── SIMILAR WORK — top 4 by similarity, 2×2 grid ── -->
        @if (related().length > 0) {
          <div class="px-6 md:px-10 py-16 max-w-7xl mx-auto" style="border-top: 1px solid var(--gz-border);">
            <p appReveal class="text-xs tracking-[0.3em] uppercase mb-3" style="color: var(--gz-gold);">Explore</p>
            <h2 appReveal class="text-4xl md:text-5xl mb-10 reveal-delay-1" style="color: var(--gz-text);">SIMILAR WORK</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              @for (p of related(); track p.id) {
                <a [routerLink]="['/projects', p.slug]" [attr.aria-label]="p.title" appReveal class="project-card group relative block aspect-video overflow-hidden" style="background: var(--gz-surface);">
                  @if (p.thumbnail_url) {
                    <img [src]="p.thumbnail_url" [alt]="p.title" class="w-full h-full object-cover transition-transform duration-500" loading="lazy" />
                  } @else {
                    <div class="w-full h-full flex items-center justify-center" style="background: var(--gz-surface2);">
                      <span style="font-size: 2rem; color: var(--gz-border); font-family: 'Bebas Neue', sans-serif;">GZP</span>
                    </div>
                  }
                </a>
              }
            </div>
          </div>
        }

        <!-- ── Full film lightbox ── -->
        @if (filmOpen()) {
          <div
            class="fixed inset-0 z-[60] flex items-center justify-center"
            style="background: rgba(0,0,0,0.92);"
            (click)="closeFilm()"
          >
            <button
              type="button"
              (click)="closeFilm()"
              class="absolute top-6 right-8 text-2xl leading-none"
              style="color: rgba(240,235,224,0.5);"
              aria-label="Close"
            >✕</button>
            <!-- stop click bubbling so clicking the video doesn't close it -->
            <div class="w-full max-w-6xl mx-6 aspect-video" (click)="$event.stopPropagation()">
              <iframe
                [src]="filmUrl()"
                class="w-full h-full"
                frameborder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowfullscreen
                [title]="project()!.title"
              ></iframe>
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
  private readonly seo = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly posthogService = inject(PostHogService);

  @ViewChild('videoSection') videoSection?: ElementRef<HTMLElement>;

  project = signal<Project | null>(null);
  related = signal<Project[]>([]);
  loading = signal(true);
  isMuted = signal(true);
  filmOpen = signal(false);

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

  groupedCredits(): { role: string; entries: { name: string; slug: string | null }[] }[] {
    const credits = this.project()?.credits ?? [];
    const groups: { role: string; entries: { name: string; slug: string | null }[] }[] = [];
    for (const c of credits) {
      const entry = { name: c.person_name, slug: c.team_member?.slug ?? null };
      const existing = groups.find((g) => g.role === c.role);
      if (existing) existing.entries.push(entry);
      else groups.push({ role: c.role, entries: [entry] });
    }
    return groups;
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

  // Full player for the lightbox: with sound and native controls, unlike the cropped background loop.
  filmUrl = computed((): SafeResourceUrl => {
    const p = this.project();
    if (!p) return '';
    if (p.youtube_id) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${p.youtube_id}?autoplay=1&rel=0&modestbranding=1`
      );
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://player.vimeo.com/video/${p.vimeo_id}?autoplay=1&badge=0&title=0&byline=0&portrait=0`
    );
  });

  openFilm(): void {
    // Silence the background loop so the two don't play over each other
    this.postMuteMessage(true);
    this.isMuted.set(true);
    this.filmOpen.set(true);
    this.posthogService.posthog.capture('project_film_opened', { project_slug: this.project()?.slug });
  }

  closeFilm(): void {
    this.filmOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.filmOpen()) this.closeFilm();
  }

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
    if (!isPlatformBrowser(this.platformId)) return;
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
      this.filmOpen.set(false);
      this.scrollObserver?.disconnect();
      this.content.getProjectBySlug(slug).subscribe((p) => {
        this.project.set(p);
        this.loading.set(false);
        if (p) {
          const kind = p.category === 'commercial' ? 'Commercial' : 'Film';
          const description = p.description
            || `${p.title}${p.client ? ` for ${p.client}` : ''} — ${kind.toLowerCase()} produced by Golden Zeal Pictures${p.year ? ` (${p.year})` : ''}${p.directors?.length ? `, directed by ${p.directors.join(', ')}` : ''}.`;
          this.seo.update({
            title: p.client ? `${p.title} — ${p.client}` : p.title,
            description,
            path: `/projects/${p.slug}`,
            image: p.thumbnail_url,
            type: 'video.other',
            jsonLd: projectJsonLd(p, description),
          });
          this.posthogService.posthog.capture('project_viewed', {
            project_slug: p.slug,
            project_title: p.title,
            project_category: p.category,
            has_video: !!(p.vimeo_id || p.youtube_id),
          });
          this.content.getProjects().subscribe((all) => {
            this.related.set(similarProjects(p, all, 4));
          });
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.scrollObserver?.disconnect();
  }
}

// VideoObject when there's a video (eligible for Google video results), otherwise CreativeWork.
function projectJsonLd(p: Project, description: string): Record<string, unknown>[] {
  const url = `${SITE_URL}/projects/${p.slug}`;
  const embedUrl = p.youtube_id
    ? `https://www.youtube.com/embed/${p.youtube_id}`
    : p.vimeo_id ? `https://player.vimeo.com/video/${p.vimeo_id}` : null;
  const people = (...roles: string[]) => (p.credits ?? [])
    .filter((c) => roles.includes(c.role.trim().toLowerCase()))
    .map((c) => ({
      '@type': 'Person',
      name: c.person_name,
      ...(c.team_member ? { url: `${SITE_URL}/crew/${c.team_member.slug}` } : {}),
    }));
  const directors = people('director');
  const camera = people('director of photography', 'cinematographer');

  const work: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': embedUrl && p.thumbnail_url ? 'VideoObject' : 'CreativeWork',
    name: p.title,
    description,
    url,
    ...(p.thumbnail_url ? { thumbnailUrl: p.thumbnail_url, image: p.thumbnail_url } : {}),
    ...(embedUrl ? { embedUrl } : {}),
    // Google requires uploadDate for VideoObject. Prefer the release year — created_at
    // is when the record was added to the CMS, often years after release.
    ...(p.year || p.created_at ? { uploadDate: p.year ? `${p.year}-01-01T00:00:00+03:00` : p.created_at } : {}),
    ...(p.year ? { copyrightYear: p.year } : {}),
    ...(directors.length ? { director: directors } : {}),
    ...(camera.length ? { contributor: camera } : {}),
    ...(p.client ? { sponsor: { '@type': 'Organization', name: p.client } } : {}),
    productionCompany: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  };

  const section = p.category === 'commercial'
    ? { name: 'Commercials', path: '/commercial' }
    : { name: 'Narrative', path: '/narrative' };
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: section.name, item: SITE_URL + section.path },
      { '@type': 'ListItem', position: 3, name: p.title, item: url },
    ],
  };
  return [work, breadcrumbs];
}

// Ranks other projects by how much they have in common with `p`: same category weighs most,
// then same client / sub-category, then shared crew. Ties keep the CMS display order.
function similarProjects(p: Project, all: Project[], limit: number): Project[] {
  const norm = (v: string | null | undefined) => (v ?? '').trim().toLowerCase();
  const crew = new Set((p.credits ?? []).map((c) => norm(c.person_name)));
  const score = (r: Project) => {
    let s = 0;
    if (r.category === p.category) s += 10;
    if (p.client && norm(r.client) === norm(p.client)) s += 4;
    if (p.sub_category && norm(r.sub_category) === norm(p.sub_category)) s += 3;
    const shared = new Set((r.credits ?? []).map((c) => norm(c.person_name)).filter((n) => crew.has(n)));
    s += Math.min(shared.size, 3);
    if (r.thumbnail_url) s += 1; // a card with an image beats a blank placeholder
    return s;
  };
  return all
    .filter((r) => r.id !== p.id)
    .map((r) => ({ r, s: score(r) }))
    .sort((a, b) => b.s - a.s || a.r.display_order - b.r.display_order)
    .slice(0, limit)
    .map(({ r }) => r);
}
