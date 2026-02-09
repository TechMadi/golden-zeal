import { Component } from '@angular/core';

@Component({
  selector: 'app-process',
  standalone: true,
  template: `
    <section
      class="py-16 md:py-24 px-4 md:px-8"
      style="background: linear-gradient(135deg, var(--gz-green) 0%, var(--gz-olive) 100%); color: var(--gz-ivory);"
    >
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold mb-12">Process</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          @for (step of steps; track step.number) {
            <div class="space-y-2">
              <span class="text-4xl font-bold text-[var(--gz-gold)]">{{ step.number }}</span>
              <h3 class="text-lg font-semibold uppercase tracking-wide">{{ step.title }}</h3>
              <p class="text-white/90 text-sm">{{ step.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class AppProcessComponent {
  steps = [
    {
      number: 1,
      title: 'Discovery & Strategy',
      description: 'Understanding your vision and goals.',
    },
    {
      number: 2,
      title: 'Production',
      description: 'Bringing the concept to life.',
    },
    {
      number: 3,
      title: 'Post-Production',
      description: 'Editing and final polish.',
    },
    {
      number: 4,
      title: 'Delivery & Distribution',
      description: 'Getting your content to the audience.',
    },
  ];
}
