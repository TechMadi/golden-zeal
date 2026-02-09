import { Component, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIcon, RouterLink],
  template: `
    <header
      class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 md:px-8 border-b-2 border-gz-charcoal/70"
      
    >
      <a routerLink="/" class="flex items-center gap-2">
        <img
          src="assets/brand/full_logo.png"
          alt="Golden Zeal"
          class="h-8 md:h-10 w-auto"
        />
      </a>
      <button
        type="button"
        class="md:hidden p-2 rounded"
        (click)="mobileMenuOpen.set(!mobileMenuOpen())"
        aria-label="Toggle menu"
      >
        @if (mobileMenuOpen()) {
          <ng-icon name="close" size="24" />
        } @else {
          <ng-icon name="menu" size="24" />
        }
      </button>
      <nav
        class="hidden md:flex items-center gap-8"
        [class.flex]="mobileMenuOpen()"
        [class.flex-col]="mobileMenuOpen()"
        [class.absolute]="mobileMenuOpen()"
        [class.top-full]="mobileMenuOpen()"
        [class.left-0]="mobileMenuOpen()"
        [class.right-0]="mobileMenuOpen()"
        [class.p-4]="mobileMenuOpen()"
        [class.gap-4]="mobileMenuOpen()"
       
      >
        <a
          routerLink="/"
          fragment="about"
          class="px-2 py-1 transition font-medium hover:bg-black hover:text-white"
          (click)="mobileMenuOpen.set(false)"
          >About</a
        >
        <a
          routerLink="/"
          fragment="services"
          class="px-2 py-1 transition font-medium hover:bg-black hover:text-white"
          (click)="mobileMenuOpen.set(false)"
          >Services</a
        >
        <a
          routerLink="/"
          fragment="projects"
          class="px-2 py-1 transition font-medium hover:bg-black hover:text-white"
          (click)="mobileMenuOpen.set(false)"
          >Projects</a
        >
        <a
          routerLink="/"
          fragment="contact"
          class="px-2 py-1 transition font-medium hover:bg-black hover:text-white"
          (click)="mobileMenuOpen.set(false)"
          >Contact</a
        >
      </nav>
    </header>
  `,
})
export class AppHeaderComponent {
  mobileMenuOpen = signal(false);
}
