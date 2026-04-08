import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { AppHeaderComponent } from '../../layout/header/header.component';
import { AppFooterComponent } from '../../layout/footer/footer.component';
import { RevealDirective } from '../../core/directives/reveal.directive';
import type { Project } from 'shared';

@Component({
  selector: 'app-cinematic',
  standalone: true,
  imports: [RouterLink, AppHeaderComponent, AppFooterComponent, RevealDirective],
  template: `
    <app-header />

    <main style="background: var(--gz-black); min-height: 100vh;">
      <!-- Page header -->
      <div class="pt-32 pb-12 px-6 md:px-10" style="border-bottom: 1px solid var(--gz-border);">
        <div class="max-w-7xl mx-auto">
          <p class="text-xs tracking-[0.3em] uppercase mb-3" style="color: var(--gz-gold);">Our Work</p>
          <h1 class="text-6xl md:text-8xl" style="color: var(--gz-text);">CINEMATIC</h1>
          <p class="mt-4 text-sm max-w-xl" style="color: var(--gz-muted);">
            Narrative films, documentaries and short-form work that honours the richness of African storytelling.
          </p>
        </div>
      </div>

      <!-- Editorial grid — larger cards, more breathing room -->
      <div class="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        @if (loading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            @for (i of [1,2,3,4]; track i) {
              <div class="aspect-[16/9] skeleton"></div>
            }
          </div>
        } @else if (projects().length === 0) {
          <p class="text-center py-24" style="color: var(--gz-muted);">No cinematic projects yet.</p>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            @for (project of projects(); track project.id; let i = $index) {
              <a
                [routerLink]="['/projects', project.slug]"
                appReveal
                class="project-card block"
                [class.md:col-span-2]="i === 0"
                [class.reveal-delay-1]="i === 1"
              >
                <div [class.aspect-[21/9]]="i === 0" [class.aspect-[16/9]]="i !== 0"
                     class="overflow-hidden" style="background: var(--gz-surface);">
                  @if (project.thumbnail_url) {
                    <img [src]="project.thumbnail_url" [alt]="project.title" class="w-full h-full object-cover" loading="lazy" />
                  } @else {
                    <div class="w-full h-full" style="background: var(--gz-surface);"></div>
                  }
                </div>
                <div class="card-overlay">
                  <div class="absolute bottom-0 left-0 p-6">
                    <p class="text-xs tracking-[0.2em] uppercase mb-2" style="color: var(--gz-gold);">{{ project.category }}</p>
                    <p class="text-2xl md:text-3xl" style="color: var(--gz-text); font-family: 'Bebas Neue', sans-serif;">{{ project.title }}</p>
                    <div class="flex gap-4 mt-1">
                      @if (project.director) { <p class="text-xs" style="color: var(--gz-muted);">Dir. {{ project.director.name }}</p> }
                      @if (project.year)     { <p class="text-xs" style="color: var(--gz-muted);">{{ project.year }}</p> }
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
export class CinematicComponent implements OnInit {
  private readonly content = inject(ContentService);
  projects = signal<Project[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.content.getProjects('cinematic').subscribe((p) => {
      this.projects.set(p);
      this.loading.set(false);
    });
  }
}
