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

        <!-- Logo — forced white via filter -->
        <a routerLink="/" class="shrink-0 z-50">
          <img
            src="assets/brand/full_logo.png"
            alt="Golden Zeal Pictures"
            class="h-8 md:h-9 w-auto"
            style=""
          />
        </a>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-8">

          <!-- Commercial -->
          <a routerLink="/commercial" routerLinkActive="!text-[#C9A04A]"
             class="text-xs tracking-[0.18em] uppercase font-medium transition-colors duration-200"
             style="color: var(--gz-muted);">COMMERCIAL</a>

          <!-- Cinematic -->
          <a routerLink="/cinematic" routerLinkActive="!text-[#C9A04A]"
             class="text-xs tracking-[0.18em] uppercase font-medium transition-colors duration-200"
             style="color: var(--gz-muted);">CINEMATIC</a>

          <!-- Crew dropdown -->
          <div class="relative group">
            <button
              type="button"
              class="text-xs tracking-[0.18em] uppercase font-medium transition-colors duration-200 flex items-center gap-1"
              style="color: var(--gz-muted);"
            >
              CREW
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" class="transition-transform duration-200 group-hover:rotate-180">
                <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
            <div
              class="absolute top-full left-0 mt-3 w-44 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
              style="background: var(--gz-surface); border: 1px solid var(--gz-border);"
            >
              <a routerLink="/crew"
                 class="block px-5 py-3 text-xs tracking-[0.14em] uppercase transition-colors duration-200 hover:opacity-80"
                 style="color: var(--gz-muted); border-bottom: 1px solid var(--gz-border);">The Team</a>
              <a routerLink="/directors"
                 class="block px-5 py-3 text-xs tracking-[0.14em] uppercase transition-colors duration-200 hover:opacity-80"
                 style="color: var(--gz-muted); border-bottom: 1px solid var(--gz-border);">Directors</a>
              <a routerLink="/photographers"
                 class="block px-5 py-3 text-xs tracking-[0.14em] uppercase transition-colors duration-200 hover:opacity-80"
                 style="color: var(--gz-muted); border-bottom: 1px solid var(--gz-border);">Photographers</a>
              <a routerLink="/apprenticeship"
                 class="block px-5 py-3 text-xs tracking-[0.14em] uppercase transition-colors duration-200 hover:opacity-80"
                 style="color: var(--gz-gold);">Apprenticeship</a>
            </div>
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
                (click)="mobileOpen.set(false)"
                class="transition-colors duration-200"
                style="color: var(--gz-muted); font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.02em;"
                [style.font-size]="item.sub ? '2.5rem' : '3.5rem'"
                [style.padding-left]="item.sub ? '1.5rem' : '0'"
                [style.color]="item.sub ? 'var(--gz-muted)' : 'var(--gz-text)'"
              >{{ item.label }}</a>
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

  readonly mobileNav = [
    { path: '/commercial',    label: 'COMMERCIAL',    sub: false },
    { path: '/cinematic',     label: 'CINEMATIC',     sub: false },
    { path: '/crew',          label: 'CREW',          sub: false },
    { path: '/directors',     label: 'DIRECTORS',     sub: true  },
    { path: '/photographers', label: 'PHOTOGRAPHERS', sub: true  },
    { path: '/apprenticeship', label: 'APPRENTICESHIP', sub: true  },
    { path: '/contact',       label: 'CONTACT',        sub: false },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.scrolled.set(scrollTop > 40);
    this.scrollProgress.set(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
  }
}
