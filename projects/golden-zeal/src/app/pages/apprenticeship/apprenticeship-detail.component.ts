import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { ContentService } from '../../core/services/content.service';
import { AppHeaderComponent } from '../../layout/header/header.component';
import { AppFooterComponent } from '../../layout/footer/footer.component';
import { RevealDirective } from '../../core/directives/reveal.directive';
import type { ApprenticeshipCohort, Project, TeamMember } from 'shared';

@Component({
  selector: 'app-apprenticeship-detail',
  standalone: true,
  imports: [RouterLink, UpperCasePipe, AppHeaderComponent, AppFooterComponent, RevealDirective],
  template: `
    <app-header />

    <main style="background: var(--gz-black); min-height: 100vh;">

      @if (loading()) {
        <div class="flex items-center justify-center h-screen">
          <div class="w-8 h-8 border-2 rounded-full animate-spin" style="border-color: var(--gz-gold); border-top-color: transparent;"></div>
        </div>
      } @else if (!cohort()) {
        <div class="flex flex-col items-center justify-center h-screen gap-4">
          <p style="color: var(--gz-muted);">Cohort not found.</p>
          <a routerLink="/apprenticeship" class="btn-outline">Back to Apprenticeship</a>
        </div>
      } @else {

        <!-- ── HERO ── -->
        <div class="pt-32 pb-20 px-6 md:px-10" style="border-bottom: 1px solid var(--gz-border);">
          <div class="max-w-7xl mx-auto">
            <a routerLink="/apprenticeship" class="text-xs tracking-widest uppercase mb-8 inline-flex items-center gap-2 transition-opacity hover:opacity-60"
               style="color: var(--gz-muted);">← Apprenticeship</a>

            <div class="grid md:grid-cols-[1fr_auto] gap-8 items-end mt-6">
              <div>
                <p appReveal class="text-xs tracking-[0.3em] uppercase mb-4" style="color: var(--gz-gold);">
                  {{ cohort()!.status | uppercase }}
                  @if (cohort()!.year) { · {{ cohort()!.year }} }
                </p>
                <h1 appReveal class="leading-none reveal-delay-1"
                    style="font-size: clamp(3rem, 8vw, 7rem); color: var(--gz-text);">
                  {{ cohort()!.title | uppercase }}
                </h1>
              </div>

              <!-- Enrolled count -->
              <div appReveal class="reveal-delay-2 text-center p-8" style="border: 1px solid var(--gz-border); min-width: 160px;">
                <p class="text-6xl md:text-7xl mb-2" style="color: var(--gz-gold); font-family: 'Bebas Neue', sans-serif;">
                  {{ cohort()!.enrolled_count }}
                </p>
                <p class="text-xs tracking-[0.2em] uppercase" style="color: var(--gz-muted);">Enrolled</p>
              </div>
            </div>

            @if (cohort()!.description) {
              <p appReveal class="text-base md:text-lg leading-relaxed mt-10 max-w-2xl reveal-delay-2" style="color: var(--gz-muted);">
                {{ cohort()!.description }}
              </p>
            }

            <!-- Dates -->
            @if (cohort()!.start_date || cohort()!.end_date) {
              <div class="flex gap-10 mt-10">
                @if (cohort()!.start_date) {
                  <div>
                    <p class="text-xs tracking-widest uppercase mb-1" style="color: var(--gz-muted);">Start Date</p>
                    <p class="text-sm" style="color: var(--gz-text);">{{ formatDate(cohort()!.start_date!) }}</p>
                  </div>
                }
                @if (cohort()!.end_date) {
                  <div>
                    <p class="text-xs tracking-widest uppercase mb-1" style="color: var(--gz-muted);">End Date</p>
                    <p class="text-sm" style="color: var(--gz-text);">{{ formatDate(cohort()!.end_date!) }}</p>
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <!-- ── PROJECTS FROM THIS COHORT ── -->
        @if (projects().length > 0) {
          <div class="px-6 md:px-10 py-20 max-w-7xl mx-auto">
            <p appReveal class="text-xs tracking-[0.3em] uppercase mb-4" style="color: var(--gz-gold);">Output</p>
            <h2 appReveal class="text-4xl md:text-6xl mb-14 reveal-delay-1" style="color: var(--gz-text);">
              PROJECTS FROM<br />THIS COHORT
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (project of projects(); track project.id; let i = $index) {
                <a [routerLink]="['/projects', project.slug]" appReveal class="project-card block group">
                  <div class="aspect-[4/3] overflow-hidden" style="background: var(--gz-surface);">
                    @if (project.thumbnail_url) {
                      <img [src]="project.thumbnail_url" [alt]="project.title"
                           class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                           loading="lazy" />
                    } @else {
                      <div class="w-full h-full flex items-center justify-center" style="background: var(--gz-surface2);">
                        <span style="font-family:'Bebas Neue',sans-serif; font-size:2rem; color: var(--gz-border);">GZP</span>
                      </div>
                    }
                  </div>
                  <div class="card-overlay">
                    <div class="absolute bottom-0 left-0 p-5">
                      @if (project.director) {
                        <p class="text-xs tracking-widest uppercase mb-1" style="color: var(--gz-gold);">{{ project.director.name }}</p>
                      }
                      <p class="text-xl" style="color: var(--gz-text); font-family: 'Bebas Neue', sans-serif;">{{ project.title }}</p>
                      @if (project.client) {
                        <p class="text-xs mt-1" style="color: var(--gz-muted);">{{ project.client }}</p>
                      }
                    </div>
                  </div>
                </a>
              }
            </div>
          </div>
        }

        <!-- ── TEAM INVOLVED ── -->
        @if (members().length > 0) {
          <div class="px-6 md:px-10 py-20" style="border-top: 1px solid var(--gz-border); background: var(--gz-surface);">
            <div class="max-w-7xl mx-auto">
              <p appReveal class="text-xs tracking-[0.3em] uppercase mb-4" style="color: var(--gz-gold);">The People</p>
              <h2 appReveal class="text-4xl md:text-6xl mb-14 reveal-delay-1" style="color: var(--gz-text);">TEAM INVOLVED</h2>

              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                @for (row of members(); track row.member.id) {
                  <div appReveal class="group">
                    <!-- Photo -->
                    <div class="aspect-[3/4] overflow-hidden mb-4 relative" style="background: var(--gz-surface2);">
                      @if (row.member.photo_url) {
                        <img [src]="row.member.photo_url" [alt]="row.member.name"
                             class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                             loading="lazy" />
                      } @else {
                        <div class="w-full h-full flex items-center justify-center">
                          <span class="text-3xl" style="color: var(--gz-border); font-family: 'Bebas Neue', sans-serif;">
                            {{ initials(row.member.name) }}
                          </span>
                        </div>
                      }
                      <!-- Role badge -->
                      <div class="absolute bottom-0 left-0 right-0 px-3 py-2" style="background: rgba(0,0,0,0.7);">
                        <p class="text-xs tracking-widest uppercase text-center" style="color: var(--gz-gold);">{{ row.role }}</p>
                      </div>
                    </div>
                    <h3 class="text-base mb-0.5" style="color: var(--gz-text);">{{ row.member.name }}</h3>
                    <p class="text-xs tracking-widest uppercase" style="color: var(--gz-muted);">{{ row.member.role }}</p>
                  </div>
                }
              </div>
            </div>
          </div>
        }

        <!-- ── CTA ── -->
        <div class="px-6 md:px-10 py-20 text-center" style="border-top: 1px solid var(--gz-border);">
          <p appReveal class="text-xs tracking-[0.3em] uppercase mb-4" style="color: var(--gz-gold);">Join Us</p>
          <h2 appReveal class="text-4xl md:text-6xl mb-8 reveal-delay-1" style="color: var(--gz-text);">APPLY FOR THE NEXT COHORT</h2>
          <a routerLink="/apprenticeship" appReveal class="btn-gold reveal-delay-2">Apply Now</a>
        </div>

      }
    </main>

    <app-footer />
  `,
})
export class ApprenticeshipDetailComponent implements OnInit {
  private readonly route   = inject(ActivatedRoute);
  private readonly content = inject(ContentService);

  cohort   = signal<ApprenticeshipCohort | null>(null);
  projects = signal<Project[]>([]);
  members  = signal<{ role: string; member: TeamMember }[]>([]);
  loading  = signal(true);

  initials(name: string): string {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('en-KE', { month: 'long', year: 'numeric' });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug') ?? '';
      this.loading.set(true);

      this.content.getCohortBySlug(slug).subscribe((c) => {
        this.cohort.set(c);
        this.loading.set(false);

        if (c) {
          this.content.getCohortProjects(c.id).subscribe((p) => this.projects.set(p));
          this.content.getCohortMembers(c.id).subscribe((m) => this.members.set(m));
        }
      });
    });
  }
}
