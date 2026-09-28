import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { AppHeaderComponent } from '../../layout/header/header.component';
import { AppFooterComponent } from '../../layout/footer/footer.component';
import { RevealDirective } from '../../core/directives/reveal.directive';
import type { Project } from 'shared';

const FILTERS = ['ALL', 'TVC', 'ANIMATIONS'] as const;

@Component({
  selector: 'app-commercial',
  standalone: true,
  imports: [RouterLink, AppHeaderComponent, AppFooterComponent, RevealDirective],
  styles: [`
    .work-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      padding: 16px;
    }

    .work-card {
      position: relative;
      overflow: hidden;
      display: block;
      background: var(--gz-surface);
      cursor: pointer;
    }
    .work-card img {
      width: 100%; height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.6s ease;
    }
    .work-card:hover img { transform: scale(1.04); }

    .card-overlay-bar {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 40%, transparent 70%);
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding: 1rem 1.1rem;
      gap: 1rem;
    }

    .card-meta-left { flex: 1; min-width: 0; }
    .card-title {
      font-size: 1.125rem;
      font-weight: 700;
      color: #F0EBE0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 3px;
      letter-spacing: 0.01em;
    }
    .card-client {
      font-size: 0.65rem;
      color: rgba(240,235,224,0.55);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .card-director {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
      white-space: nowrap;
      font-size: 0.65rem;
      color: var(--gz-gold);
    }
    .card-director-logo {
      height: 14px;
      width: auto;
      filter: brightness(0) invert(1);
      flex-shrink: 0;
    }

    .aspect-half  { aspect-ratio: 16 / 9; }

    @media (max-width: 640px) {
      .work-grid { grid-template-columns: 1fr; gap: 12px; padding: 12px; }
    }
  `],
  template: `
    <app-header />

    <main style="background: var(--gz-black); min-height: 100vh;">

      <!-- Page header -->
      <div class="pt-32 pb-16 px-6 md:px-10">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div class="relative">
            <h1 appReveal style="font-size: clamp(4rem, 14vw, 10rem); color: var(--gz-text); line-height: 0.9; letter-spacing: -0.02em;">
              COMMER<br />CIALS
            </h1>
            @if (!loading()) {
              <span class="absolute top-0 -right-10 text-sm tabular-nums" style="color: var(--gz-muted);">{{ visible().length }}</span>
            }
          </div>
          <div class="flex flex-col items-end gap-4">
            <!-- Filters -->
            <div class="flex flex-wrap gap-2 justify-end">
              @for (f of filters; track f) {
                <button
                  type="button"
                  (click)="activeFilter.set(f)"
                  class="px-3 py-1 text-xs tracking-[0.15em] uppercase transition-all duration-200"
                  [style.background]="activeFilter() === f ? 'var(--gz-gold)' : 'transparent'"
                  [style.color]="activeFilter() === f ? 'var(--gz-black)' : 'var(--gz-muted)'"
                  [style.border]="'1px solid ' + (activeFilter() === f ? 'var(--gz-gold)' : 'var(--gz-border)')"
                >{{ f }}</button>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Two-column grid -->
      <div class="px-0 pb-16">
        @if (loading()) {
          <div class="work-grid px-6 md:px-10">
            <div class="aspect-half skeleton"></div>
            <div class="aspect-half skeleton"></div>
            <div class="aspect-half skeleton"></div>
            <div class="aspect-half skeleton"></div>
          </div>
        } @else if (visible().length === 0) {
          <p class="text-center py-24" style="color: var(--gz-muted);">No projects yet.</p>
        } @else {
          <div class="work-grid">
            @for (project of visible(); track project.id) {
              <a
                [routerLink]="['/projects', project.slug]"
                class="work-card aspect-half"
              >
                @if (project.thumbnail_url) {
                  <img [src]="project.thumbnail_url" [alt]="project.title" loading="lazy" />
                } @else {
                  <div class="w-full h-full flex items-center justify-center" style="background: var(--gz-surface2);">
                    <span style="font-family:'Bebas Neue',sans-serif; font-size:2rem; color: var(--gz-border);">GZP</span>
                  </div>
                }
                <div class="card-overlay-bar">
                  <div class="card-meta-left">
                    <p class="card-title">{{ project.title }}</p>
                    @if (project.client) {
                      <p class="card-client">{{ project.client }}</p>
                    }
                  </div>
                  @if (project.directors?.length) {
                    <div class="card-director">
                      {{ project.directors!.join(', ') }}
                    </div>
                  }
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
  private readonly route = inject(ActivatedRoute);

  projects = signal<Project[]>([]);
  loading = signal(true);
  activeFilter = signal<string>('ALL');
  readonly filters = [...FILTERS];

  visible = computed(() => {
    const f = this.activeFilter();
    if (f === 'ALL') return this.projects();
    const subMap: Record<string, string> = {
      'TVC':        'tvc',
      'ANIMATIONS': 'animations',
    };
    return this.projects().filter((p) => p.sub_category === subMap[f]);
  });

  ngOnInit(): void {
    const filterMap: Record<string, string> = { tvc: 'TVC', animations: 'ANIMATIONS' };
    this.route.queryParamMap.subscribe((params) => {
      const filter = params.get('filter');
      this.activeFilter.set((filter && filterMap[filter.toLowerCase()]) || 'ALL');
    });

    this.content.getProjects('commercial').subscribe((p) => {
      this.projects.set(p);
      this.loading.set(false);
    });
  }
}
