import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer style="background: var(--gz-black); border-top: 1px solid var(--gz-border);" class="pt-16 pb-8 px-6 md:px-10">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <!-- Brand -->
          <div class="space-y-4">
            <img src="assets/brand/full_logo.png" alt="Golden Zeal Pictures" class="h-10 w-auto" style="filter: brightness(0) invert(1);" />
            <p class="text-sm leading-relaxed max-w-xs" style="color: var(--gz-muted);">
              Film &amp; Television Production Across Africa and Beyond.
            </p>
          </div>

          <!-- Nav links -->
          <div class="space-y-3">
            <p class="text-xs tracking-[0.2em] uppercase mb-5" style="color: var(--gz-gold);">Navigate</p>
            @for (item of navLinks; track item.label) {
              <a [routerLink]="item.path" class="block text-sm transition-colors" style="color: var(--gz-muted);">{{ item.label }}</a>
            }
          </div>

          <!-- Contact -->
          <div class="space-y-3">
            <p class="text-xs tracking-[0.2em] uppercase mb-5" style="color: var(--gz-gold);">Get In Touch</p>
            <p class="text-sm" style="color: var(--gz-muted);">Nairobi, Kenya</p>
            <a href="tel:+254722833358" class="block text-sm transition-colors" style="color: var(--gz-muted);">+254 722 833 358</a>
            <a href="mailto:info@goldenzealpictures.co.ke" class="block text-sm transition-colors" style="color: var(--gz-muted);">info&#64;goldenzealpictures.co.ke</a>
            <div class="flex gap-5 pt-2">
              @for (social of socials; track social.label) {
                <a [href]="social.href" target="_blank" rel="noopener"
                   class="text-xs tracking-widest uppercase transition-colors" style="color: var(--gz-muted);">{{ social.label }}</a>
              }
            </div>
          </div>
        </div>

        <!-- Bottom -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pt-6" style="border-top: 1px solid var(--gz-border);">
          <p class="text-xs" style="color: var(--gz-muted);">
            &copy; {{ year }} Golden Zeal Pictures Ltd. All rights reserved.
          </p>
          <div class="h-[1px] w-16 hidden md:block" style="background: var(--gz-gold);"></div>
        </div>
      </div>
    </footer>
  `,
})
export class AppFooterComponent {
  readonly year = new Date().getFullYear();

  readonly navLinks = [
    { path: '/commercial',    label: 'Commercial' },
    { path: '/cinematic',     label: 'Cinematic' },
    { path: '/directors',     label: 'Directors' },
    { path: '/photographers', label: 'Photographers' },
    { path: '/crew',          label: 'Crew' },
    { path: '/apprenticeship', label: 'Apprenticeship' },
    { path: '/contact',        label: 'Contact' },
  ];

  readonly socials = [
    { href: 'https://www.instagram.com/goldenzealpictures/', label: 'IG' },
    { href: 'https://vimeo.com/goldenzealpictures',          label: 'VM' },
    { href: 'https://www.linkedin.com/company/golden-zeal-pictures/', label: 'LI' },
    { href: 'https://www.tiktok.com/@golden.zeal.pictures',  label: 'TT' },
  ];
}
