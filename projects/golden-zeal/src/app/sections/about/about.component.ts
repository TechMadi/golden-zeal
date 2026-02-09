import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, NgIcon],
  template: `
    <section
      id="about"
      class="py-16 md:py-24 px-4 md:px-16"
      style="background: var(--gz-black); color: var(--gz-ivory);"
    >
      <div class="max-w-8xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <!-- Left Column: Image -->
        <div class="w-full flex justify-start">
          <div class="w-full md:w-1/2 aspect-[2/3]">
            <img
              src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800"
              alt="About Golden Zeal"
              class="w-full h-full object-cover"
            />
          </div>
        </div>

        <!-- Right Column: Content -->
        <div class="space-y-6 w-full md:w-3/4 ">
          <!-- Headline -->
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Highlighting skilled filmmakers, producers, animators, and others
          </h2>

          <!-- Paragraph -->
          <p class="text-white text-base md:text-lg">
            We provide production services in video music, and film. From viral music videos to stunning short films.
          </p>

          <!-- Buttons -->
          <div class="flex items-center gap-2 pt-4">
            <a
              routerLink="/"
              fragment="contact"
              class="inline-flex items-center gap-2 px-6 py-3 border border-white text-white bg-transparent hover:bg-white hover:text-black transition text-sm md:text-base"
            >
              <span>Our Story</span>
              <ng-icon name="arrowRight" size="18" />
            </a>
            <button
              type="button"
              class="inline-flex items-center justify-center w-12 h-12 border border-white text-white bg-transparent hover:bg-white hover:text-black transition"
              aria-label="Next"
            >
              <ng-icon name="arrowRight" size="18" />
            </button>
          </div>

          <!-- Stats Table -->
          <div class="pt-8 space-y-0">
            <div class="border-t border-white py-4 flex justify-between items-center">
              <span class="text-white">EST</span>
              <span class="text-white">April 15, 1980</span>
            </div>
            <div class="border-t border-white py-4 flex justify-between items-center">
              <span class="text-white">Producers</span>
              <span class="text-white">16+</span>
            </div>
            <div class="border-t border-white py-4 flex justify-between items-center">
              <span class="text-white">Projects</span>
              <span class="text-white">300+</span>
            </div>
            <div class="border-t border-white py-4 flex justify-between items-center">
              <span class="text-white">Awards</span>
              <span class="text-white">2</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class AppAboutComponent {}
