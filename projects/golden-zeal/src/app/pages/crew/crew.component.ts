import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { AppHeaderComponent } from '../../layout/header/header.component';
import { AppFooterComponent } from '../../layout/footer/footer.component';
import { RevealDirective } from '../../core/directives/reveal.directive';
import type { TeamMember } from 'shared';

@Component({
  selector: 'app-crew',
  standalone: true,
  imports: [RouterLink, AppHeaderComponent, AppFooterComponent, RevealDirective],
  template: `
    <app-header />

    <main style="background: var(--gz-black); min-height: 100vh;">
      <!-- Mission statement hero -->
      <div class="pt-32 pb-20 px-6 md:px-10" style="border-bottom: 1px solid var(--gz-border);">
        <div class="max-w-5xl mx-auto">
          <p appReveal class="text-xs tracking-[0.3em] uppercase mb-6" style="color: var(--gz-gold);">Who We Are</p>
          <h1 appReveal class="leading-tight mb-10 reveal-delay-1"
              style="font-size: clamp(2.5rem, 7vw, 6rem); color: var(--gz-text);">
            30 YEARS OF COMBINED<br />EXPERIENCE.<br />ONE CONTINENT'S STORIES.
          </h1>
          <p appReveal class="text-base md:text-lg leading-relaxed max-w-2xl reveal-delay-2" style="color: var(--gz-muted);">
            Golden Zeal Pictures is a boutique Film and TV Technical Agency based in Nairobi, Kenya.
            We supply film technology, technical services and skilled crew with solid credentials from
            countless international and local productions across East, Central, West and Southern Africa —
            and beyond into Southeast Asia and India.
          </p>
          <p appReveal class="text-base md:text-lg leading-relaxed max-w-2xl mt-4 reveal-delay-3" style="color: var(--gz-muted);">
            A fun bunch to work with but also very highly dedicated, focused, diligent and patient in our craft —
            ready to tell your stories with excellence and dedication.
          </p>
        </div>
      </div>

      <!-- Core Team -->
      <div class="px-6 md:px-10 py-20 max-w-7xl mx-auto">
        <h2 appReveal class="text-4xl md:text-5xl mb-12" style="color: var(--gz-text);">CORE TEAM</h2>

        @if (loading()) {
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            @for (i of [1,2,3,4]; track i) {
              <div class="aspect-[3/4] skeleton"></div>
            }
          </div>
        } @else {
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            @for (member of core(); track member.id) {
              <div appReveal class="group">
                <!-- Photo -->
                <div class="aspect-[3/4] overflow-hidden mb-4 relative" style="background: var(--gz-surface);">
                  @if (member.photo_url) {
                    <img
                      [src]="member.photo_url"
                      [alt]="member.name"
                      class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  } @else {
                    <div class="w-full h-full flex items-center justify-center" style="background: var(--gz-surface2);">
                      <span class="text-4xl" style="color: var(--gz-border); font-family: 'Bebas Neue', sans-serif;">
                        {{ initials(member.name) }}
                      </span>
                    </div>
                  }
                  <!-- Hover overlay with contact -->
                  @if (member.email) {
                    <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4"
                         style="background: rgba(15,15,15,0.85);">
                      <a [href]="'mailto:' + member.email"
                         class="text-xs tracking-widest uppercase transition-colors"
                         style="color: var(--gz-gold);">{{ member.email }}</a>
                    </div>
                  }
                </div>
                <h3 class="text-lg mb-1" style="color: var(--gz-text);">{{ member.name }}</h3>
                <p class="text-xs tracking-widest uppercase" style="color: var(--gz-muted);">{{ member.role }}</p>
                @if (member.location) {
                  <p class="text-xs mt-1" style="color: var(--gz-border);">{{ member.location }}</p>
                }
              </div>
            }
          </div>
        }
      </div>

      <!-- Extended Crew -->
      @if (!loading() && extended().length > 0) {
        <div class="px-6 md:px-10 py-12 max-w-7xl mx-auto" style="border-top: 1px solid var(--gz-border);">
          <h2 appReveal class="text-4xl md:text-5xl mb-10" style="color: var(--gz-text);">EXTENDED CREW</h2>
          <div class="divide-y" style="border-color: var(--gz-border);">
            @for (member of extended(); track member.id) {
              <div appReveal class="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
                <p class="text-sm" style="color: var(--gz-text);">{{ member.name }}</p>
                <p class="text-sm" style="color: var(--gz-muted);">{{ member.role }}</p>
                @if (member.location) {
                  <p class="text-sm hidden md:block" style="color: var(--gz-border);">{{ member.location }}</p>
                }
              </div>
            }
          </div>
        </div>
      }

      <!-- CTA -->
      <div class="px-6 md:px-10 py-20 text-center">
        <p appReveal class="text-xs tracking-[0.3em] uppercase mb-4" style="color: var(--gz-gold);">Work With Us</p>
        <h2 appReveal class="text-4xl md:text-6xl mb-8 reveal-delay-1" style="color: var(--gz-text);">READY TO CREATE SOMETHING?</h2>
        <a routerLink="/contact" appReveal class="btn-gold reveal-delay-2">Get In Touch</a>
      </div>
    </main>

    <app-footer />
  `,
})
export class CrewComponent implements OnInit {
  private readonly content = inject(ContentService);
  team = signal<TeamMember[]>([]);
  loading = signal(true);

  core     = computed(() => this.team().filter((m) => m.is_core));
  extended = computed(() => this.team().filter((m) => !m.is_core));

  initials(name: string): string {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  ngOnInit(): void {
    this.content.getTeam().subscribe((t) => {
      this.team.set(t);
      this.loading.set(false);
    });
  }
}
