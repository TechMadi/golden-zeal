import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

interface Project {
  title: string;
  imageUrl: string;
  youtubeUrl: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [NgIcon],
  template: `
    <section
      id="projects"
      class="py-16 md:py-24 px-4 md:px-8"
      style="background: var(--gz-ivory);"
    >
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold mb-12" style="color: var(--gz-charcoal);">
          Projects
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (project of projects; track project.title) {
            <a
              [href]="project.youtubeUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="group block rounded-lg overflow-hidden border border-black/10 hover:border-[var(--gz-gold)] transition"
            >
              <div class="aspect-[4/3] overflow-hidden bg-white/5">
                <img
                  [src]="project.imageUrl"
                  [alt]="project.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div class="p-4 flex items-center justify-between" style="color: var(--gz-charcoal);">
                <span class="font-medium">{{ project.title }}</span>
                <ng-icon name="arrowRight" size="20" class="text-[var(--gz-gold)]" />
              </div>
            </a>
          }
        </div>
      </div>
    </section>
  `,
})
export class AppProjectsComponent {
  projects: Project[] = [
    {
      title: 'The New Era',
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
      youtubeUrl: 'https://www.youtube.com',
    },
    {
      title: 'Music Video',
      imageUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400',
      youtubeUrl: 'https://www.youtube.com',
    },
    {
      title: 'Fashion',
       imageUrl: "https://images.pexels.com/photos/19354436/pexels-photo-19354436.jpeg?w=1600"
      ,youtubeUrl: 'https://www.youtube.com',
    },
    {
      title: 'Concept',
      imageUrl: "https://images.pexels.com/photos/19354436/pexels-photo-19354436.jpeg?w=1600"
      ,youtubeUrl: 'https://www.youtube.com',
    },
  ];
}
