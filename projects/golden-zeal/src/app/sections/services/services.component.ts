import { Component, signal, computed } from '@angular/core';

interface ServiceCategory {
  id: number;
  name: string;
}

interface Project {
  id: number;
  title: string;
  type: string;
  year: string;
  imageUrl: string;
  category: string; // Category name that matches ServiceCategory
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [],
  template: `
    <section
      id="services"
      class="py-16 md:py-24 px-4 md:px-8 lg:px-12"
      style="background: var(--gz-ivory);"
    >
      <div class="max-w-7xl mx-auto grid md:grid-cols-[35%_65%] gap-12 md:gap-16">
        <!-- Left Column: Heading and Categories -->
        <div class="space-y-8">
          <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gz-charcoal leading-tight">
            Golden Zeal Pictures provides tailored production services for personalized experience
          </h2>

          <!-- Service Categories List -->
          <div class="space-y-0">
            @for (category of categories; track category.id) {
              <button
                type="button"
                (click)="selectedCategory.set(category.name)"
                class="w-full text-left px-4 py-4 border-t border-gz-charcoal/20 transition"
                [class.bg-gz-charcoal]="selectedCategory() === category.name"
                [class.text-white]="selectedCategory() === category.name"
                [class.text-gz-charcoal]="selectedCategory() !== category.name"
                [class.bg-transparent]="selectedCategory() !== category.name"
              >
                <span class="font-medium text-sm md:text-base">
                  [{{ category.id }}] {{ category.name }}
                </span>
              </button>
            }
          </div>
        </div>

        <!-- Right Column: Projects Grid -->
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (project of filteredProjects(); track project.id; let i = $index) {
              <div
                class="space-y-2"
                [class.md:col-span-2]="i === 0"
                [class.lg:col-span-3]="i === 0"
              >
                <div class="aspect-[4/3] overflow-hidden">
                  <img
                    [src]="project.imageUrl"
                    [alt]="project.title"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p class="text-xs text-gz-charcoal/70 mb-1">[{{ project.type }}]</p>
                  <div class="flex items-baseline justify-between gap-2">
                    <p class="text-sm md:text-base font-medium text-gz-charcoal">
                      {{ project.title }}
                    </p>
                    <p class="text-xs text-gz-charcoal/70 shrink-0">[{{ project.year }}]</p>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class AppServicesComponent {
  selectedCategory = signal<string>('Video Production');

  categories: ServiceCategory[] = [
    { id: 1, name: 'Feature Films & Documentaries' },
    { id: 2, name: 'Television & Corporate Video' },
    { id: 3, name: 'Photography & Visual Campaigns' },
    { id: 4, name: 'CGI / VFX / SFX' },
    { id: 5, name: 'Live Streaming & Virtual Events' },
  ];

  projects: Project[] = [
    {
      id: 1,
      title: 'The Midnight Echo',
      type: 'Music Video',
      year: '2024',
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600',
      category: 'Video Production',
    },
    {
      id: 2,
      title: 'Harmonic Convergence',
      type: 'Concert Video',
      year: '2024',
      imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600',
      category: 'Video Production',
    },
    {
      id: 3,
      title: 'Lunar Rhapsody',
      type: 'Music Video',
      year: '2025',
      imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600',
      category: 'Video Production',
    },
    {
      id: 4,
      title: 'Evergreen Memories',
      type: 'Marriage Anniversary',
      year: '2023',
      imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600',
      category: 'Video Production',
    },
    {
      id: 5,
      title: 'Starlight Serenade',
      type: 'Music Video',
      year: 'Upcoming',
      imageUrl: 'https://images.unsplash.com/photo-1545235617-7a424c1a60cc?w=600',
      category: 'Video Production',
    },
    {
      id: 6,
      title: 'The Midnight Vows',
      type: 'Wedding Video',
      year: 'Upcoming',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600',
      category: 'Video Production',
    },
    {
      id: 7,
      title: 'Cinematic Dreams',
      type: 'Feature Film',
      year: '2024',
      imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600',
      category: 'Film Production',
    },
    {
      id: 8,
      title: 'Urban Legends',
      type: 'Short Film',
      year: '2023',
      imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600',
      category: 'Film Production',
    },
    {
      id: 9,
      title: 'Motion Magic',
      type: 'Brand Animation',
      year: '2024',
      imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600',
      category: 'Motion Graphics',
    },
    {
      id: 10,
      title: 'Rhythm & Flow',
      type: 'Album Production',
      year: '2024',
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600',
      category: 'Music Production',
    },
    {
      id: 11,
      title: 'Final Cut',
      type: 'Editing Project',
      year: '2024',
      imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600',
      category: 'Post-Production & Editing',
    },
  ];

  filteredProjects = computed(() => {
    return this.projects.filter(
      (project) => project.category === this.selectedCategory()
    );
  });
}
