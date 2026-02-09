import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgIcon],
  template: `
    <footer
      class="py-12 px-4 md:px"
      style="background: var(--gz-black); color: var(--gz-ivory);"
    >

      <!-- <div class="max-w-7xl mx-auto mt-8 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
        <p class="text-xs md:text-sm">
          © 2025 Golden Zeal all right reserved
        </p>
        <div class="flex gap-4 md:gap-8">
          <a href="#" class="hover:opacity-80 transition">Terms of Use</a>
          <a href="#" class="hover:opacity-80 transition">Privacy Policy</a>
        </div>
      </div>
      <div class="max-w-6xl mx-auto mt-4 h-0.5" style="background: #5DBCD2;"></div> -->
    </footer>
    
  `,
})
export class AppFooterComponent {}
