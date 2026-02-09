import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgIcon],
  template: `
    <footer
      class="py-12 px-4 md:px-8"
      style="background: var(--gz-black); color: var(--gz-ivory);"
    >
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <p class="font-semibold">Follow us</p>
        <div class="flex gap-6">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:opacity-80 transition"
            aria-label="Instagram"
          >
            <ng-icon name="instagram" size="24" />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:opacity-80 transition"
            aria-label="Facebook"
          >
            <ng-icon name="facebook" size="24" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:opacity-80 transition"
            aria-label="Twitter"
          >
            <ng-icon name="twitter" size="24" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:opacity-80 transition"
            aria-label="Youtube"
          >
            <ng-icon name="youtube" size="24" />
          </a>
        </div>
      </div>
      <div class="max-w-6xl mx-auto mt-8 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-center gap-4 md:gap-8 text-sm text-center">
        <a href="#" class="hover:opacity-80 transition">Terms of Use</a>
        <a href="#" class="hover:opacity-80 transition">Privacy Policy</a>
      </div>
    </footer>
  `,
})
export class AppFooterComponent {}
