import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section
      id="about"
      class="py-16 md:py-24 px-4 md:px-8 grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto"
      style="background: var(--gz-black); color: var(--gz-ivory);"
    >
      <div class="aspect-[4/3] rounded-lg overflow-hidden bg-white/5">
        <img
          src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600"
          alt="About Golden Zeal"
          class="w-full h-full object-cover"
        />
      </div>
      <div>
        <h2 class="text-3xl md:text-4xl font-bold mb-6">
          Highlighting skilled filmmakers, producers, animators, and others
        </h2>
        <ul class="space-y-2 mb-8 text-white/90">
          <li>EP</li>
          <li>Awards</li>
          <li>Brands</li>
          <li>Clients</li>
        </ul>
        <a
          routerLink="/"
          fragment="contact"
          class="cta inline-block px-8 py-3 rounded font-semibold border-2 border-transparent transition"
        >
          Get Started
        </a>
      </div>
    </section>
  `,
})
export class AppAboutComponent {}
