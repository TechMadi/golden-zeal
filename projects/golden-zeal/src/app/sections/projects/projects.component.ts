import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [NgIcon],
  template: `
    <section
      id="projects"
      class="py-16 md:py-24 px-4 md:px-8 lg:px-12"
      style="background: var(--gz-sand);"
    >
      <div class="max-w-7xl mx-auto">
        <!-- Projects Title -->
        <h2 class="text-[8rem] md:text-6xl lg:text-[12rem] font-bold mb-12" style="color: var(--gz-charcoal);">
          Projects
        </h2>

        <!-- Main Grid Layout -->
        <div class="grid md:grid-cols-[45%_55%] gap-6 items-start">
          <!-- Left Column -->
          <div class="space-y-6 flex flex-col">
            <!-- Top Left: Large Landscape Image -->
            <div class="aspect-[4/3] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
                alt="Team"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Bottom Left: Two Images Side by Side -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Portrait Image -->
              <div class="hidden md:block aspect-square overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
                  alt="Portrait"
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- Square with Blurred Image, Circle, and Project Details -->
              <div class="aspect-square relative overflow-hidden">
                <!-- Blurred Background Image -->
                <div class="absolute inset-0">
                  <img
                    src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400"
                    alt="A Toast To Friendship Ad"
                    class="w-full h-full object-cover blur-md scale-110"
                  />
                </div>
                
                <!-- Overlay for better contrast -->
                <div class="absolute inset-0 bg-black/30"></div>
                
                <!-- Centered Circle with VIMEO Text -->
                <div class="absolute inset-0 flex items-center justify-center z-10">
                  <div class="w-32 h-32 md:w-40 md:h-40 rounded-full  bg-transparent flex items-center justify-center relative">
                    <div class="absolute inset-0 bg-white/20 rounded-full"></div>
                    <p class="text-white text-xs md:text-sm font-semibold uppercase tracking-wider z-10 text-center px-4">
                      Watch on<br />VIMEO
                    </p>
                  </div>
                </div>

                <!-- Project Details at Bottom -->
                <div class="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <p class="text-white text-xs mb-1">Short Film</p>
                  <div class="flex items-baseline justify-between">
                    <div>
                      <p class="text-white text-xs">Naivas Kikwetu Ad</p>
                      <p class="text-white text-base font-semibold">Naivas Supermarket</p>
                    </div>
                    <p class="text-white text-xs">[2024]</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Paragraph Text -->
            <p class="text-base text-gz-charcoal leading-relaxed w-full  md:w-1/2">
              From edgy music videos to visually captivating films, explore our diverse range of projects.
            </p>

            <!-- Explore More Buttons -->
            <div class="flex items-center gap-2">
              <a
                href="#"
                class="inline-flex items-center px-6 py-3 bg-gz-charcoal text-white hover:bg-gz-black transition"
              >
                <span>Explore More</span>
              </a>
              <button
                type="button"
                class="inline-flex items-center justify-center w-12 h-12 border border-gz-charcoal bg-gz-charcoal text-white hover:bg-gz-black transition"
                aria-label="Next"
              >
                <ng-icon name="arrowRight" size="18" />
              </button>
            </div>
          </div>

          <!-- Right Column: Large Portrait Image -->
          <div class="w-full h-full min-h-[600px] md:min-h-[800px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600"
              alt="Musician"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  `,
})
export class AppProjectsComponent {}
