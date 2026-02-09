import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { RouterLink } from '@angular/router';

interface ServiceBlock {
  title: string;
  description: string;
  items: string[];
  imageUrl: string;
  dark?: boolean;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [NgIcon, RouterLink],
  template: `
    <section id="services" class="py-0">
      @for (block of serviceBlocks; track block.title) {
        <div
          class="py-16 md:py-24 px-4 md:px-8"
          [style.background]="block.dark ? 'var(--gz-black)' : 'var(--gz-sand)'"
          [style.color]="block.dark ? 'var(--gz-ivory)' : 'var(--gz-charcoal)'"
        >
          <div
            class="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center"
            [class.md:grid-flow-dense]="block.dark"
          >
            <div
              class="aspect-[4/3] rounded-lg overflow-hidden"
              [class.md:col-start-2]="block.dark"
            >
              <img
                [src]="block.imageUrl"
                [alt]="block.title"
                class="w-full h-full object-cover"
              />
            </div>
            <div [class.md:col-start-1]="block.dark" [class.md:row-start-1]="block.dark">
              <h3 class="text-2xl font-bold mb-4">{{ block.title }}</h3>
              <p class="mb-6 opacity-90">{{ block.description }}</p>
              @if (block.items.length) {
                <ul class="space-y-2">
                  @for (item of block.items; track item) {
                    <li class="flex items-center gap-2">
                      <ng-icon name="arrowRight" size="18" class="text-[var(--gz-gold)] shrink-0" />
                      {{ item }}
                    </li>
                  }
                </ul>
              }
              @if (!block.dark && block.items.length) {
                <a
                  routerLink="/"
                  fragment="contact"
                  class="cta inline-block mt-6 px-6 py-2 rounded font-medium border-2 border-transparent transition"
                >
                  Get in touch
                </a>
              }
            </div>
          </div>
        </div>
      }
    </section>
  `,
})
export class AppServicesComponent {
  serviceBlocks: ServiceBlock[] = [
    {
      title: 'Tailored production services',
      description:
        'Berlin Studio provides tailored production services for a personalized experience.',
      items: ['Film Production', 'Post Production', 'Creative Content'],
      imageUrl: 'https://images.unsplash.com/photo-1545235617-7a424c1a60cc?w=600',
      dark: false,
    },
    {
      title: 'Live Performance',
      description: 'Capturing the energy of live events.',
      items: [],
      imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600',
      dark: true,
    },
    {
      title: 'Lifestyle',
      description: 'Authentic storytelling for brands.',
      items: [],
      imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600',
      dark: false,
    },
    {
      title: 'Events',
      description: 'Full-scale event coverage.',
      items: [],
      imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600',
      dark: false,
    },
    {
      title: 'Underwater',
      description: 'Specialist underwater filming.',
      items: [],
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600',
      dark: false,
    },
  ];
}
