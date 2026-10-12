import { Component, signal, effect, inject, HostListener, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      [style.background-color]="scrolled() ? '#0a150f' : 'transparent'"
      [style.border-bottom]="scrolled() ? '1px solid rgba(240,235,224,0.08)' : 'none'"
    >
      <!-- Scroll progress bar -->
      <div
        class="absolute bottom-0 left-0 h-[2px] transition-all duration-100"
        style="background: var(--gz-gold);"
        [style.width.%]="scrollProgress()"
      ></div>

      <div class="flex items-center justify-between px-6 md:px-10 py-4">

        <!-- Logo -->
        <a routerLink="/" class="shrink-0 z-50 transition-opacity duration-200"
           [class.invisible]="mobileOpen()" [class.opacity-0]="mobileOpen()">
          <img
            src="assets/brand/full_logo.png"
            alt="Golden Zeal Pictures"
            class="h-16 md:h-20 w-auto"
          />
        </a>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-8">

          <!-- Narrative (with dropdown) -->
          <div class="relative inline-flex dropdown-nav" (mouseenter)="openDropdown.set('narrative')" (mouseleave)="openDropdown.set(null)">
            <a routerLink="/narrative" routerLinkActive="!text-[#C9A04A]"
               (click)="onDropdownTriggerClick($event, 'narrative')"
               class="text-sm tracking-[0.18em] uppercase font-medium transition-colors duration-200"
               [style.color]="scrolled() ? 'var(--gz-muted)' : 'var(--gz-text)'">NARRATIVE</a>

            @if (openDropdown() === 'narrative') {
              <div class="absolute top-full left-1/2 -translate-x-1/2 pt-4 min-w-[200px] z-50">
                <div class="flex flex-col py-2" style="background: var(--gz-black); border: 1px solid rgba(240,235,224,0.08);">
                  @for (item of narrativeSubNav; track item.label) {
                    <a [routerLink]="item.path"
                       [queryParams]="item.queryParams"
                       (click)="openDropdown.set(null)"
                       class="px-4 py-3 text-xs tracking-[0.14em] uppercase transition-colors duration-200"
                       style="color: var(--gz-muted);">{{ item.label }}</a>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Commercial (with dropdown) -->
          <div class="relative inline-flex dropdown-nav" (mouseenter)="openDropdown.set('commercial')" (mouseleave)="openDropdown.set(null)">
            <a routerLink="/commercial" routerLinkActive="!text-[#C9A04A]"
               (click)="onDropdownTriggerClick($event, 'commercial')"
               class="text-sm tracking-[0.18em] uppercase font-medium transition-colors duration-200"
               [style.color]="scrolled() ? 'var(--gz-muted)' : 'var(--gz-text)'">COMMERCIAL</a>

            @if (openDropdown() === 'commercial') {
              <div class="absolute top-full left-1/2 -translate-x-1/2 pt-4 min-w-[200px] z-50">
                <div class="flex flex-col py-2" style="background: var(--gz-black); border: 1px solid rgba(240,235,224,0.08);">
                  @for (item of commercialSubNav; track item.label) {
                    <a [routerLink]="item.path"
                       [queryParams]="item.queryParams"
                       (click)="openDropdown.set(null)"
                       class="px-4 py-3 text-xs tracking-[0.14em] uppercase transition-colors duration-200"
                       style="color: var(--gz-muted);">{{ item.label }}</a>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Crew -->
          <a routerLink="/crew" routerLinkActive="!text-[#C9A04A]"
             class="text-sm tracking-[0.18em] uppercase font-medium transition-colors duration-200"
             [style.color]="scrolled() ? 'var(--gz-muted)' : 'var(--gz-text)'">CREW</a>

          <a routerLink="/contact" class="btn-gold text-[0.7rem] py-2 px-4">CONTACT</a>
        </nav>

        <!-- Mobile hamburger -->
        <button
          type="button"
          class="md:hidden z-50 flex flex-col gap-[5px] p-2"
          (click)="mobileOpen.set(!mobileOpen())"
          [attr.aria-expanded]="mobileOpen()"
          aria-label="Toggle navigation"
        >
          <span class="block w-6 h-[1.5px] transition-all duration-300" [style.background]="mobileOpen() ? 'var(--gz-black)' : 'var(--gz-text)'"
            [style.transform]="mobileOpen() ? 'rotate(45deg) translateY(6.5px)' : 'none'"></span>
          <span class="block w-6 h-[1.5px] transition-all duration-300" [style.background]="mobileOpen() ? 'var(--gz-black)' : 'var(--gz-text)'"
            [style.opacity]="mobileOpen() ? '0' : '1'"></span>
          <span class="block w-6 h-[1.5px] transition-all duration-300" [style.background]="mobileOpen() ? 'var(--gz-black)' : 'var(--gz-text)'"
            [style.transform]="mobileOpen() ? 'rotate(-45deg) translateY(-6.5px)' : 'none'"></span>
        </button>
      </div>

      <!-- Mobile menu overlay — full-screen gold; page scroll is locked while open -->
      @if (mobileOpen()) {
        <!-- Centred with my-auto rather than justify-center: when the links are taller than the
             screen, justify-center pushes the top out of reach, while my-auto lets it scroll.
             overscroll-contain stops a scroll at the edge from pulling-to-refresh the page. -->
        <div class="fixed inset-0 z-40 h-[100dvh] overflow-y-auto overscroll-contain flex flex-col px-8 pt-28 pb-12"
             style="background: var(--gz-gold); -webkit-overflow-scrolling: touch;">
          <nav class="my-auto flex flex-col gap-3 w-full">
            @for (item of mobileNav; track item.label) {
              <a
                [routerLink]="item.path"
                [queryParams]="item.queryParams"
                (click)="mobileOpen.set(false)"
                class="leading-none"
                style="font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.02em;"
                [style.font-size]="item.sub ? '1.75rem' : '3rem'"
                [style.padding-left]="item.sub ? '1.25rem' : '0'"
                [style.color]="item.sub ? 'rgba(10,21,15,0.6)' : 'var(--gz-black)'"
              >{{ item.label }}</a>
            }
          </nav>
          <div class="mt-10 pt-6 flex gap-6" style="border-top: 1px solid rgba(10,21,15,0.2);">
            <a href="https://www.instagram.com/goldenzealpictures/" target="_blank" rel="noopener"
               class="text-xs tracking-widest uppercase" style="color: var(--gz-black);">Instagram</a>
            <a href="https://vimeo.com/goldenzealpictures" target="_blank" rel="noopener"
               class="text-xs tracking-widest uppercase" style="color: var(--gz-black);">Vimeo</a>
          </div>
        </div>
      }
    </header>
  `,
})
export class AppHeaderComponent {
  mobileOpen = signal(false);
  scrolled = signal(false);
  scrollProgress = signal(0);
  openDropdown = signal<'narrative' | 'commercial' | null>(null);
  private readonly platformId = inject(PLATFORM_ID);

  readonly narrativeSubNav = [
    { path: '/narrative', label: 'Commissioned',  queryParams: { filter: 'commissioned' } },
    { path: '/narrative', label: 'Original Film', queryParams: { filter: 'original-film' } },
  ];

  readonly commercialSubNav = [
    { path: '/commercial', label: 'Animation', queryParams: { filter: 'animations' } },
    { path: '/commercial', label: 'Tvc',        queryParams: { filter: 'tvc' } },
  ];

  readonly mobileNav = [
    { path: '/',           label: 'HOME',       sub: false, queryParams: undefined as Record<string, string> | undefined },
    { path: '/narrative',  label: 'NARRATIVE',  sub: false, queryParams: undefined },
    { path: '/narrative',  label: 'COMMISSIONED',  sub: true, queryParams: { filter: 'commissioned' } },
    { path: '/narrative',  label: 'ORIGINAL FILM', sub: true, queryParams: { filter: 'original-film' } },
    { path: '/commercial', label: 'COMMERCIAL', sub: false, queryParams: undefined },
    { path: '/commercial', label: 'ANIMATION',  sub: true,  queryParams: { filter: 'animations' } },
    { path: '/commercial', label: 'TVC',        sub: true,  queryParams: { filter: 'tvc' } },
    { path: '/crew',       label: 'CREW',       sub: false, queryParams: undefined },
    { path: '/contact',    label: 'CONTACT',    sub: false, queryParams: undefined },
  ];

  constructor() {
    // Lock page scroll behind the open mobile menu
    effect(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      document.body.style.overflow = this.mobileOpen() ? 'hidden' : '';
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.mobileOpen.set(false);
  }

  onDropdownTriggerClick(event: MouseEvent, key: 'narrative' | 'commercial'): void {
    if (this.openDropdown() !== key) {
      event.preventDefault();
      this.openDropdown.set(key);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.openDropdown() && !(event.target as HTMLElement).closest('.dropdown-nav')) {
      this.openDropdown.set(null);
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.scrolled.set(scrollTop > 40);
    this.scrollProgress.set(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
  }
}
