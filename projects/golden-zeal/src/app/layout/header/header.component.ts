import { Component, signal, HostListener } from '@angular/core';
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
        <a routerLink="/" class="shrink-0 z-50">
          <img
            src="assets/brand/full_logo.png"
            alt="Golden Zeal Pictures"
            class="h-16 md:h-20 w-auto"
          />
        </a>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-8">

          <!-- Narratives -->
          <a routerLink="/cinematic" routerLinkActive="!text-[#C9A04A]"
             class="text-sm tracking-[0.18em] uppercase font-medium transition-colors duration-200"
             [style.color]="scrolled() ? 'var(--gz-muted)' : 'var(--gz-text)'">NARRATIVES</a>

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

          <!-- Crew (with dropdown) -->
          <div class="relative inline-flex dropdown-nav" (mouseenter)="openDropdown.set('crew')" (mouseleave)="openDropdown.set(null)">
            <a routerLink="/crew" routerLinkActive="!text-[#C9A04A]"
               (click)="onDropdownTriggerClick($event, 'crew')"
               class="text-sm tracking-[0.18em] uppercase font-medium transition-colors duration-200"
               [style.color]="scrolled() ? 'var(--gz-muted)' : 'var(--gz-text)'">CREW</a>

            @if (openDropdown() === 'crew') {
              <div class="absolute top-full left-1/2 -translate-x-1/2 pt-4 min-w-[200px] z-50">
                <div class="flex flex-col py-2" style="background: var(--gz-black); border: 1px solid rgba(240,235,224,0.08);">
                  @for (item of crewSubNav; track item.label) {
                    <a [routerLink]="item.path"
                       (click)="openDropdown.set(null)"
                       class="flex items-center justify-between gap-4 px-4 py-3 text-xs tracking-[0.14em] uppercase transition-colors duration-200"
                       style="color: var(--gz-muted);">
                      <span>{{ item.label }}</span>
                      <span class="text-[0.6rem] tracking-[0.1em]" style="color: var(--gz-gold);">Coming Soon</span>
                    </a>
                  }
                </div>
              </div>
            }
          </div>

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
          <span class="block w-6 h-[1.5px] transition-all duration-300" style="background: var(--gz-text);"
            [style.transform]="mobileOpen() ? 'rotate(45deg) translateY(6.5px)' : 'none'"></span>
          <span class="block w-6 h-[1.5px] transition-all duration-300" style="background: var(--gz-text);"
            [style.opacity]="mobileOpen() ? '0' : '1'"></span>
          <span class="block w-6 h-[1.5px] transition-all duration-300" style="background: var(--gz-text);"
            [style.transform]="mobileOpen() ? 'rotate(-45deg) translateY(-6.5px)' : 'none'"></span>
        </button>
      </div>

      <!-- Mobile menu overlay -->
      @if (mobileOpen()) {
        <div class="fixed inset-0 z-40 flex flex-col justify-center items-start px-10" style="background: var(--gz-black);">
          <nav class="flex flex-col gap-6 w-full">
            @for (item of mobileNav; track item.label) {
              <a
                [routerLink]="item.path"
                [queryParams]="item.queryParams"
                (click)="mobileOpen.set(false)"
                class="transition-colors duration-200"
                style="color: var(--gz-muted); font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.02em;"
                [style.font-size]="item.sub ? '2.5rem' : '3.5rem'"
                [style.padding-left]="item.sub ? '1.5rem' : '0'"
                [style.color]="item.sub ? 'var(--gz-muted)' : 'var(--gz-text)'"
              >{{ item.label }}{{ item.comingSoon ? ' (Coming Soon)' : '' }}</a>
            }
          </nav>
          <div class="mt-12 flex gap-6">
            <a href="https://www.instagram.com/goldenzealpictures/" target="_blank" rel="noopener"
               class="text-xs tracking-widest uppercase transition-colors" style="color: var(--gz-muted);">Instagram</a>
            <a href="https://vimeo.com/goldenzealpictures" target="_blank" rel="noopener"
               class="text-xs tracking-widest uppercase transition-colors" style="color: var(--gz-muted);">Vimeo</a>
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
  openDropdown = signal<'commercial' | 'crew' | null>(null);

  readonly commercialSubNav = [
    { path: '/commercial', label: 'Animation', queryParams: { filter: 'animations' } },
    { path: '/commercial', label: 'Tvc',        queryParams: { filter: 'tvc' } },
  ];

  readonly crewSubNav = [
    { path: '/apprenticeship', label: 'Apprenticeship' },
    { path: '/screening',      label: 'Screening' },
  ];

  readonly mobileNav = [
    { path: '/cinematic',      label: 'NARRATIVES',     sub: false, comingSoon: false, queryParams: undefined as Record<string, string> | undefined },
    { path: '/commercial',     label: 'COMMERCIAL',     sub: false, comingSoon: false, queryParams: undefined },
    { path: '/commercial',     label: 'ANIMATION',      sub: true,  comingSoon: false, queryParams: { filter: 'animations' } },
    { path: '/commercial',     label: 'TVC',             sub: true,  comingSoon: false, queryParams: { filter: 'tvc' } },
    { path: '/crew',           label: 'CREW',            sub: false, comingSoon: false, queryParams: undefined },
    { path: '/apprenticeship', label: 'APPRENTICESHIP',  sub: true,  comingSoon: true,  queryParams: undefined },
    { path: '/screening',      label: 'SCREENING',       sub: true,  comingSoon: true,  queryParams: undefined },
    { path: '/contact',        label: 'CONTACT',         sub: false, comingSoon: false, queryParams: undefined },
  ];

  onDropdownTriggerClick(event: MouseEvent, key: 'commercial' | 'crew'): void {
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
