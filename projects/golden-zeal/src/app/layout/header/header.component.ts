import { Component, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIcon, RouterLink],
  template: `
    <header
      class="fixed backdrop-blur-lg top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 md:px-8 border-b-2 border-gz-charcoal/70"
      
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
        class="md:hidden p-2 rounded z-50"
        (click)="mobileMenuOpen.set(!mobileMenuOpen())"
        aria-label="Toggle menu"
      >
        <ng-icon name="menu" size="24" />
      </button>
      
      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center gap-8">
        <a
          routerLink="/"
          fragment="about"
          class="px-2 py-1 transition font-medium hover:bg-black hover:text-white text-gz-charcoal"
          >About</a
        >
        <a
          routerLink="/"
          fragment="services"
          class="px-2 py-1 transition font-medium hover:bg-black hover:text-white text-gz-charcoal"
          >Services</a
        >
        <a
          routerLink="/"
          fragment="projects"
          class="px-2 py-1 transition font-medium hover:bg-black hover:text-white text-gz-charcoal"
          >Projects</a
        >
        <a
          routerLink="/"
          fragment="contact"
          class="px-2 py-1 transition font-medium hover:bg-black hover:text-white text-gz-charcoal"
          >Contact</a
        >
      </nav>

      <!-- Full Screen Mobile Menu Overlay -->
      @if (mobileMenuOpen()) {
        <div
          class="fixed inset-0 z-[100] flex flex-col"
          style="background: var(--gz-gold);"
        >
          <!-- Close Button at Top -->
          <div class="flex justify-end p-6">
            <button
              type="button"
              class="p-2 rounded"
              (click)="mobileMenuOpen.set(false)"
              aria-label="Close menu"
            >
              <ng-icon name="close" size="32" class="text-gz-charcoal" />
            </button>
          </div>

          <!-- Large Menu Options -->
          <nav class="flex-1 flex flex-col justify-center items-center gap-8 px-6">
            <a
              routerLink="/"
              fragment="about"
              class="block text-gz-charcoal hover:text-gz-black transition"
              (click)="mobileMenuOpen.set(false)"
            >
              <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold">About</h2>
            </a>
            <a
              routerLink="/"
              fragment="services"
              class="block text-gz-charcoal hover:text-gz-black transition"
              (click)="mobileMenuOpen.set(false)"
            >
              <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold">Services</h2>
            </a>
            <a
              routerLink="/"
              fragment="projects"
              class="block text-gz-charcoal hover:text-gz-black transition"
              (click)="mobileMenuOpen.set(false)"
            >
              <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold">Projects</h2>
            </a>
            <a
              routerLink="/"
              fragment="contact"
              class="block text-gz-charcoal hover:text-gz-black transition"
              (click)="mobileMenuOpen.set(false)"
            >
              <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold">Contact</h2>
            </a>
          </nav>
        </div>
      }
    </header>
  `,
})
export class AppHeaderComponent {
  mobileMenuOpen = signal(false);
}
