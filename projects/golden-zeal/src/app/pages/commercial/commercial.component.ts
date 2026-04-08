import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { AppHeaderComponent } from '../../layout/header/header.component';
import { AppFooterComponent } from '../../layout/footer/footer.component';
import { RevealDirective } from '../../core/directives/reveal.directive';
import type { Project } from 'shared';

const FILTERS = ['ALL', 'TVC', 'MUSIC VIDEO', 'CORPORATE'] as const;

@Component({
  selector: 'app-commercial',
  standalone: true,
  imports: [RouterLink, AppHeaderComponent, AppFooterComponent, RevealDirective],
  template: `
    <app-header />

    <main style="background: var(--gz-black); min-height: 100vh;">
      <!-- Page header -->
      <div class="pt-32 pb-12 px-6 md:px-10" style="border-bottom: 1px solid var(--gz-border);">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p class="text-xs tracking-[0.3em] uppercase mb-3" style="color: var(--gz-gold);">Our Work</p>
            <h1 class="text-6xl md:text-8xl" style="color: var(--gz-text);">COMMERCIAL</h1>
          </div>
          <!-- Filters -->
          <div class="flex flex-wrap gap-2">
            @for (f of filters; track f) {
              <button
                type="button"
                (click)="activeFilter.set(f)"
                class="px-4 py-2 text-xs tracking-[0.15em] uppercase transition-all duration-200"
                [style.background]="activeFilter() === f ? 'var(--gz-gold)' : 'transparent'"
                [style.color]="activeFilter() === f ? 'var(--gz-black)' : 'var(--gz-muted)'"
                [style.border]="activeFilter() === f ? '1px solid var(--gz-gold)' : '1px solid var(--gz-border)'"
              >{{ f }}</button>
            }
          </div>
        </div>
      </div>

      <!-- Grid -->
      <div class="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        @if (loading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (i of [1,2,3,4,5,6]; track i) {
              <div class="aspect-[4/3] skeleton"></div>
            }
          </div>
        } @else if (visible().length === 0) {
          <p class="text-center py-24" style="color: var(--gz-muted);">No projects in this category yet.</p>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (project of visible(); track project.id; let i = $index) {
              <a
                [routerLink]="['/projects', project.slug]"
                appReveal
                class="project-card block"
                [class.md:col-span-2]="i === 0 && visible().length > 1"
              >
                <div [class.aspect-video]="i === 0 && visible().length > 1" [class.aspect-[4/3]]="!(i === 0 && visible().length > 1)"
                     class="overflow-hidden" style="background: var(--gz-surface);">
                  @if (project.thumbnail_url) {
                    <img [src]="project.thumbnail_url" [alt]="project.title" class="w-full h-full object-cover" loading="lazy" />
                  } @else {
                    <div class="w-full h-full skeleton"></div>
                  }
                </div>
                <div class="card-overlay">
                  <div class="absolute bottom-0 left-0 p-5">
                    <p class="text-xs tracking-[0.2em] uppercase mb-1" style="color: var(--gz-gold);">{{ project.category }}</p>
                    <p class="text-xl" style="color: var(--gz-text); font-family: 'Bebas Neue', sans-serif;">{{ project.title }}</p>
                    <div class="flex gap-4 mt-1">
                      @if (project.client) { <p class="text-xs" style="color: var(--gz-muted);">{{ project.client }}</p> }
                      @if (project.year)   { <p class="text-xs" style="color: var(--gz-muted);">{{ project.year }}</p> }
                    </div>
                  </div>
                </div>
              </a>
            }
          </div>
        }
      </div>
    </main>

    <app-footer />
  `,
})
export class CommercialComponent implements OnInit {
  private readonly content = inject(ContentService);

  projects = signal<Project[]>([]);
  loading = signal(true);
  activeFilter = signal<string>('ALL');
  readonly filters = [...FILTERS];

  visible = computed(() => {
    const f = this.activeFilter();
    if (f === 'ALL') return this.projects();
    const map: Record<string, string[]> = {
      'TVC':         ['commercial'],
      'MUSIC VIDEO': ['music_video'],
      'CORPORATE':   ['commercial'],
    };
    const cats = map[f] ?? [];
    return this.projects().filter((p) => cats.includes(p.category));
  });

  ngOnInit(): void {
    this.content.getProjects('commercial').subscribe((p) => {
      // also include music_video under commercial listing
      this.content.getProjects('music_video').subscribe((mv) => {
        this.projects.set([...p, ...mv]);
        this.loading.set(false);
      });
    });
  }
}
