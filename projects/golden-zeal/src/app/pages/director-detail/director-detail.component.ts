import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { AppHeaderComponent } from '../../layout/header/header.component';
import { AppFooterComponent } from '../../layout/footer/footer.component';
import { RevealDirective } from '../../core/directives/reveal.directive';
import type { Director, Project } from 'shared';

@Component({
  selector: 'app-director-detail',
  standalone: true,
  imports: [RouterLink, AppHeaderComponent, AppFooterComponent, RevealDirective],
  template: `
    <app-header />

    <main style="background: var(--gz-black); min-height: 100vh;">
      @if (loading()) {
        <div class="flex items-center justify-center h-screen">
          <div class="w-8 h-8 border-2 rounded-full animate-spin" style="border-color: var(--gz-gold); border-top-color: transparent;"></div>
        </div>
      } @else if (!director()) {
        <div class="flex flex-col items-center justify-center h-screen gap-4">
          <p style="color: var(--gz-muted);">Director not found.</p>
          <a routerLink="/directors" class="btn-outline">Back to Directors</a>
        </div>
      } @else {
        <!-- Hero -->
        <div class="relative h-[70vh] overflow-hidden" style="background: var(--gz-surface);">
          @if (director()!.hero_image_url) {
            <img
              [src]="director()!.hero_image_url!"
              [alt]="director()!.name"
              class="w-full h-full object-cover object-top"
            />
          }
          <div class="absolute inset-0" style="background: linear-gradient(to top, rgba(15,15,15,1) 0%, rgba(15,15,15,0.3) 60%, transparent 100%);"></div>
          <div class="absolute bottom-0 left-0 px-6 md:px-10 pb-10">
            <p class="text-xs tracking-[0.3em] uppercase mb-3" style="color: var(--gz-gold);">Director</p>
            <h1 class="text-6xl md:text-8xl" style="color: var(--gz-text);">{{ director()!.name }}</h1>
            @if (director()!.location) {
              <p class="text-sm mt-2 tracking-widest uppercase" style="color: var(--gz-muted);">{{ director()!.location }}</p>
            }
          </div>
        </div>

        <!-- Bio -->
        @if (director()!.bio) {
          <div class="px-6 md:px-10 py-16 max-w-3xl">
            <p appReveal class="text-base md:text-lg leading-relaxed" style="color: var(--gz-muted);">{{ director()!.bio }}</p>
          </div>
        }

        <!-- Their work -->
        @if (projects().length > 0) {
          <div class="px-6 md:px-10 py-12 max-w-7xl mx-auto" style="border-top: 1px solid var(--gz-border);">
            <h2 appReveal class="text-4xl mb-10" style="color: var(--gz-text);">WORK</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (project of projects(); track project.id) {
                <a [routerLink]="['/projects', project.slug]" appReveal class="project-card block">
                  <div class="aspect-[4/3] overflow-hidden" style="background: var(--gz-surface);">
                    @if (project.thumbnail_url) {
                      <img [src]="project.thumbnail_url" [alt]="project.title" class="w-full h-full object-cover" loading="lazy" />
                    } @else {
                      <div class="w-full h-full skeleton"></div>
                    }
                  </div>
                  <div class="card-overlay">
                    <div class="absolute bottom-0 left-0 p-4">
                      <p class="text-xs tracking-[0.2em] uppercase mb-1" style="color: var(--gz-gold);">{{ project.category }}</p>
                      <p class="text-lg" style="color: var(--gz-text); font-family: 'Bebas Neue', sans-serif;">{{ project.title }}</p>
                    </div>
                  </div>
                </a>
              }
            </div>
          </div>
        }

        <!-- Back -->
        <div class="px-6 md:px-10 pb-16">
          <a routerLink="/directors" class="btn-outline">← All Directors</a>
        </div>
      }
    </main>

    <app-footer />
  `,
})
export class DirectorDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly content = inject(ContentService);

  director = signal<Director | null>(null);
  projects = signal<Project[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug') ?? '';
      this.loading.set(true);
      this.content.getDirectorBySlug(slug).subscribe((d) => {
        this.director.set(d);
        this.loading.set(false);
        if (d) {
          this.content.getProjectsByDirector(d.id).subscribe((p) => this.projects.set(p));
        }
      });
    });
  }
}
