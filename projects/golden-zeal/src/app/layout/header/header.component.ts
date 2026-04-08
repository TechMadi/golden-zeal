import { Component, signal, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      [class.bg-gz-black]="scrolled()"
      [style.background-color]="scrolled() ? '#0f0f0f' : 'transparent'"
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
            class="h-8 md:h-9 w-auto"
          />
        </a>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-8">
          <!-- WORK dropdown -->
          <div class="relative group">
            <button
              type="button"
              class="text-xs tracking-[0.18em] uppercase font-medium transition-colors duration-200 flex items-center gap-1"
              style="color: var(--gz-muted);"
            >
              WORK
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" class="transition-transform duration-200 group-hover:rotate-180">
                <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
            <div
              class="absolute top-full left-0 mt-3 w-44 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
              style="background: var(--gz-surface); border: 1px solid var(--gz-border);"
            >
              <a
                routerLink="/commercial"
                class="block px-5 py-3 text-xs tracking-[0.14em] uppercase transition-colors duration-200"
                style="color: var(--gz-muted);"
              >Commercial</a>
              <a
                routerLink="/cinematic"
                class="block px-5 py-3 text-xs tracking-[0.14em] uppercase transition-colors duration-200"
                style="color: var(--gz-muted);"
              >Cinematic</a>
            </div>
          </div>

          <a routerLink="/directors"     routerLinkActive="text-gz-gold" class="text-xs tracking-[0.18em] uppercase font-medium transition-colors duration-200" style="color: var(--gz-muted);">DIRECTORS</a>
          <a routerLink="/photographers" routerLinkActive="text-gz-gold" class="text-xs tracking-[0.18em] uppercase font-medium transition-colors duration-200" style="color: var(--gz-muted);">PHOTOGRAPHERS</a>
          <a routerLink="/crew"          routerLinkActive="text-gz-gold" class="text-xs tracking-[0.18em] uppercase font-medium transition-colors duration-200" style="color: var(--gz-muted);">CREW</a>
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
                class="text-5xl transition-colors duration-200 hover:opacity-100"
                style="color: var(--gz-muted); font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.02em;"
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
    { path: '/',              label: 'HOME' },
    { path: '/commercial',    label: 'COMMERCIAL' },
    { path: '/cinematic',     label: 'CINEMATIC' },
    { path: '/directors',     label: 'DIRECTORS' },
    { path: '/photographers', label: 'PHOTOGRAPHERS' },
    { path: '/crew',          label: 'CREW' },
    { path: '/contact',       label: 'CONTACT' },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.scrolled.set(scrollTop > 40);
    this.scrollProgress.set(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
  }
}
