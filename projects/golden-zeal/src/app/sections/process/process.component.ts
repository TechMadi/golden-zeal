import { Component } from '@angular/core';

@Component({
  selector: 'app-process',
  standalone: true,
  template: `
    <section class="relative min-h-[80vh] md:min-h-[90vh] overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1600"
          alt="Process Background"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Dark Overlay with Transparent Center -->
      <div class="absolute inset-0" style="background: radial-gradient(ellipse 60% 50% at center, transparent 0%, transparent 35%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.7) 100%);"></div>
      
      <!-- Color Gradients -->
      <div class="absolute inset-0">
        <!-- Left side: Blue/Teal linear gradient overlay -->
        <div class="absolute inset-0 w-1/2 bg-gradient-to-r from-blue-500/30 via-teal-500/20 to-transparent"></div>
        <!-- Right side: Red/Orange to Green linear gradient overlay -->
        <div class="absolute inset-0 w-1/2 left-1/2 bg-gradient-to-l from-red-500/30 via-orange-500/20 to-green-500/20"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 h-full min-h-[80vh] md:min-h-[90vh] flex flex-col px-4 md:px-8 lg:px-12 py-16 md:py-24">
        <div class="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-between">
          <!-- Process Title - Top Left -->
          <h2 class="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white mb-auto">
            Process
          </h2>

          <!-- Bottom Section: Steps and Description -->
          <div class="mt-auto">
            <!-- Process Steps - Horizontal Layout -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
              @for (step of steps; track step.number) {
                <div class="space-y-1">
                  <p class="text-white text-sm md:text-base font-bold">[{{ step.number }}]</p>
                  <h3 class="text-white text-base md:text-lg lg:text-xl font-bold">{{ step.title }}</h3>
                </div>
              }
            </div>

            <!-- Descriptive Paragraph - Bottom Right -->
            <div class="max-w-md ml-auto text-right md:text-left">
              <p class="text-white text-sm md:text-base leading-relaxed">
                We expertly edit, color grade, and finalize your content to ensure it meets the highest standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class AppProcessComponent {
  steps = [
    {
      number: 1,
      title: 'Discovery & Concept',
    },
    {
      number: 2,
      title: 'Production',
    },
    {
      number: 3,
      title: 'Post-Production',
    },
    {
      number: 4,
      title: 'Delivery & Distribution',
    },
  ];
}