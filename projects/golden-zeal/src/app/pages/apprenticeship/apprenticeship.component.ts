import { Component, signal, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SlicePipe, UpperCasePipe } from '@angular/common';
import { AppHeaderComponent } from '../../layout/header/header.component';
import { AppFooterComponent } from '../../layout/footer/footer.component';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { ContentService } from '../../core/services/content.service';
import emailjs from '@emailjs/browser';
import { environment } from '../../../environments/environment';
import type { ApprenticeshipCohort } from 'shared';

const STATS = [
  { value: '6',   label: 'Month Programme' },
  { value: '2',   label: 'Intakes Per Year' },
  { value: '15',  label: 'Spots Per Cohort' },
  { value: 'Paid', label: 'Position' },
];

const WHAT_YOU_GET = [
  { title: 'On-Set Experience', body: 'Work alongside seasoned crew on live commercial and narrative productions across Kenya and the region.' },
  { title: 'Mentorship', body: 'Paired with a senior crew member who guides your development throughout the six-month programme.' },
  { title: 'Cross-Department Exposure', body: 'Rotate through camera, lighting, production coordination and post — find where you fit best.' },
  { title: 'Industry Network', body: 'Build real relationships with directors, producers and technical specialists from day one.' },
];

@Component({
  selector: 'app-apprenticeship',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, SlicePipe, UpperCasePipe, AppHeaderComponent, AppFooterComponent, RevealDirective],
  template: `
    <app-header />

    <main style="background: var(--gz-black); min-height: 100vh;">

      <!-- ── HERO ── -->
      <div class="pt-32 pb-20 px-6 md:px-10" style="border-bottom: 1px solid var(--gz-border);">
        <div class="max-w-7xl mx-auto">
          <p appReveal class="text-xs tracking-[0.3em] uppercase mb-4" style="color: var(--gz-gold);">Join The Team</p>
          <h1 appReveal class="reveal-delay-1 leading-none mb-6"
              style="font-size: clamp(3.5rem, 10vw, 9rem); color: var(--gz-text);">
            APPRENTICE<br />SHIP
          </h1>
          <p appReveal class="text-base md:text-lg leading-relaxed max-w-2xl reveal-delay-2" style="color: var(--gz-muted);">
            A paid, six-month hands-on programme designed to bring the next generation of African filmmakers
            into the industry. No experience required — only curiosity, commitment and a love for storytelling.
          </p>
        </div>
      </div>

      <!-- ── STATS ── -->
      <div class="px-6 md:px-10 py-16" style="border-bottom: 1px solid var(--gz-border);">
        <div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          @for (stat of stats; track stat.label) {
            <div appReveal class="text-center">
              <p class="mb-2" style="font-size: clamp(2rem, 5vw, 3.5rem); color: var(--gz-gold); font-family: 'Bebas Neue', sans-serif;">
                {{ stat.value }}
              </p>
              <p class="text-xs tracking-[0.2em] uppercase" style="color: var(--gz-muted);">{{ stat.label }}</p>
            </div>
          }
        </div>
      </div>

      <!-- ── WHAT YOU GET ── -->
      <div class="px-6 md:px-10 py-20 max-w-7xl mx-auto">
        <p appReveal class="text-xs tracking-[0.3em] uppercase mb-4" style="color: var(--gz-gold);">The Programme</p>
        <h2 appReveal class="text-4xl md:text-6xl mb-16 reveal-delay-1" style="color: var(--gz-text);">WHAT YOU'LL GET</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-px" style="border: 1px solid var(--gz-border);">
          @for (item of whatYouGet; track item.title; let i = $index) {
            <div appReveal class="p-8 md:p-10" style="border: 1px solid var(--gz-border);">
              <p class="text-xs tracking-[0.2em] uppercase mb-3" style="color: var(--gz-gold);">0{{ i + 1 }}</p>
              <h3 class="text-2xl mb-4" style="color: var(--gz-text); font-family: 'Bebas Neue', sans-serif;">{{ item.title }}</h3>
              <p class="text-sm leading-relaxed" style="color: var(--gz-muted);">{{ item.body }}</p>
            </div>
          }
        </div>
      </div>

      <!-- ── WHO CAN APPLY ── -->
      <div class="px-6 md:px-10 py-16" style="background: var(--gz-surface); border-top: 1px solid var(--gz-border); border-bottom: 1px solid var(--gz-border);">
        <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p appReveal class="text-xs tracking-[0.3em] uppercase mb-4" style="color: var(--gz-gold);">Eligibility</p>
            <h2 appReveal class="text-4xl md:text-5xl mb-6 reveal-delay-1" style="color: var(--gz-text);">WHO CAN APPLY</h2>
            <div class="space-y-4 reveal-delay-2" appReveal>
              @for (point of eligibility; track point) {
                <div class="flex gap-3">
                  <div class="w-5 h-5 rounded-full shrink-0 flex items-center justify-center mt-0.5" style="background: var(--gz-gold-muted); border: 1px solid var(--gz-gold);">
                    <div class="w-1.5 h-1.5 rounded-full" style="background: var(--gz-gold);"></div>
                  </div>
                  <p class="text-sm leading-relaxed" style="color: var(--gz-muted);">{{ point }}</p>
                </div>
              }
            </div>
          </div>
          <div appReveal class="reveal-delay-1 p-8 md:p-10" style="background: var(--gz-surface2); border: 1px solid var(--gz-border);">
            <p class="text-xs tracking-[0.3em] uppercase mb-4" style="color: var(--gz-gold);">Next Intake</p>
            <p class="text-4xl mb-3" style="color: var(--gz-text); font-family: 'Bebas Neue', sans-serif;">APPLICATIONS OPEN</p>
            <p class="text-sm leading-relaxed mb-6" style="color: var(--gz-muted);">
              We run two cohorts per year. Submit your application below and we will be in touch with dates and next steps.
            </p>
            <div class="w-12 h-px" style="background: var(--gz-gold);"></div>
          </div>
        </div>
      </div>

      <!-- ── APPLICATION FORM ── -->
      <div class="px-6 md:px-10 py-20 max-w-4xl mx-auto">
        <p appReveal class="text-xs tracking-[0.3em] uppercase mb-4" style="color: var(--gz-gold);">Apply Now</p>
        <h2 appReveal class="text-4xl md:text-6xl mb-12 reveal-delay-1" style="color: var(--gz-text);">YOUR APPLICATION</h2>

        @if (submitted()) {
          <div class="p-8 text-center" style="background: rgba(201,160,74,0.08); border: 1px solid var(--gz-gold);">
            <p class="text-2xl mb-3" style="color: var(--gz-gold); font-family: 'Bebas Neue', sans-serif;">APPLICATION RECEIVED</p>
            <p class="text-sm" style="color: var(--gz-muted);">
              Thank you for applying to the Golden Zeal Pictures Apprenticeship Programme.
              We review all applications carefully and will be in touch within two weeks.
            </p>
          </div>
        } @else {
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-8">
            @if (error()) {
              <div class="p-4 text-sm" style="background: rgba(255,80,80,0.1); border: 1px solid rgba(255,80,80,0.4); color: #ff8080;">
                {{ error() }}
              </div>
            }

            <!-- Name + Phone -->
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label for="name" class="block text-xs tracking-[0.2em] uppercase mb-3" style="color: var(--gz-muted);">Full Name *</label>
                <input id="name" type="text" formControlName="name"
                       class="w-full bg-transparent py-3 px-4 text-sm focus:outline-none transition-colors"
                       style="color: var(--gz-text); border: 1px solid var(--gz-border);"
                       placeholder="Your full name" />
              </div>
              <div>
                <label for="phone" class="block text-xs tracking-[0.2em] uppercase mb-3" style="color: var(--gz-muted);">Phone Number *</label>
                <input id="phone" type="tel" formControlName="phone"
                       class="w-full bg-transparent py-3 px-4 text-sm focus:outline-none transition-colors"
                       style="color: var(--gz-text); border: 1px solid var(--gz-border);"
                       placeholder="+254 7XX XXX XXX" />
              </div>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-xs tracking-[0.2em] uppercase mb-3" style="color: var(--gz-muted);">Email Address *</label>
              <input id="email" type="email" formControlName="email"
                     class="w-full bg-transparent py-3 px-4 text-sm focus:outline-none transition-colors"
                     style="color: var(--gz-text); border: 1px solid var(--gz-border);"
                     placeholder="you@example.com" />
            </div>

            <!-- About you -->
            <div>
              <label for="about" class="block text-xs tracking-[0.2em] uppercase mb-3" style="color: var(--gz-muted);">About You *</label>
              <textarea id="about" formControlName="about" rows="4"
                        class="w-full bg-transparent py-3 px-4 text-sm focus:outline-none transition-colors resize-none"
                        style="color: var(--gz-text); border: 1px solid var(--gz-border);"
                        placeholder="Tell us about yourself — your background, education, current work..."></textarea>
            </div>

            <!-- Why GZP -->
            <div>
              <label for="why" class="block text-xs tracking-[0.2em] uppercase mb-3" style="color: var(--gz-muted);">Why Do You Want To Join This Programme? *</label>
              <textarea id="why" formControlName="why" rows="5"
                        class="w-full bg-transparent py-3 px-4 text-sm focus:outline-none transition-colors resize-none"
                        style="color: var(--gz-text); border: 1px solid var(--gz-border);"
                        placeholder="What draws you to film? What do you hope to gain from this apprenticeship?"></textarea>
            </div>

            <!-- Portfolio -->
            <div>
              <label for="portfolio" class="block text-xs tracking-[0.2em] uppercase mb-3" style="color: var(--gz-muted);">Portfolio / Showreel Link <span style="color: var(--gz-border);">(optional)</span></label>
              <input id="portfolio" type="url" formControlName="portfolio"
                     class="w-full bg-transparent py-3 px-4 text-sm focus:outline-none transition-colors"
                     style="color: var(--gz-text); border: 1px solid var(--gz-border);"
                     placeholder="https://vimeo.com/yourprofile or behance.net/you" />
            </div>

            <button
              type="submit"
              [disabled]="form.invalid || sending()"
              class="w-full py-4 text-sm tracking-[0.2em] uppercase font-medium transition-all duration-200"
              style="background: var(--gz-gold); color: var(--gz-black);"
              [style.opacity]="form.invalid || sending() ? '0.5' : '1'"
            >
              {{ sending() ? 'SUBMITTING...' : 'SUBMIT APPLICATION' }}
            </button>
          </form>
        }
      </div>

      <!-- ── PAST COHORTS ── -->
      @if (cohorts().length > 0) {
        <div class="px-6 md:px-10 py-20" style="border-top: 1px solid var(--gz-border); background: var(--gz-surface);">
          <div class="max-w-7xl mx-auto">
            <p appReveal class="text-xs tracking-[0.3em] uppercase mb-4" style="color: var(--gz-gold);">Programme History</p>
            <h2 appReveal class="text-4xl md:text-6xl mb-14 reveal-delay-1" style="color: var(--gz-text);">PAST COHORTS</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (c of cohorts(); track c.id) {
                <a [routerLink]="['/apprenticeship', c.slug]" appReveal
                   class="group block p-8 transition-all duration-300"
                   style="border: 1px solid var(--gz-border); background: var(--gz-surface2);"
                   [style.border-color]="'var(--gz-border)'"
                   onmouseenter="this.style.borderColor='var(--gz-gold)'"
                   onmouseleave="this.style.borderColor='var(--gz-border)'">
                  <!-- Status badge -->
                  <div class="flex items-center justify-between mb-6">
                    <span class="text-xs tracking-[0.2em] uppercase px-3 py-1"
                          [style.color]="c.status === 'active' ? '#0a150f' : 'var(--gz-gold)'"
                          [style.background]="c.status === 'active' ? 'var(--gz-gold)' : 'rgba(201,160,74,0.12)'"
                          [style.border]="'1px solid var(--gz-gold)'">
                      {{ c.status }}
                    </span>
                    @if (c.year) {
                      <span class="text-xs" style="color: var(--gz-muted);">{{ c.year }}</span>
                    }
                  </div>

                  <!-- Cohort number + title -->
                  @if (c.cohort_number) {
                    <p class="text-xs tracking-[0.2em] uppercase mb-2" style="color: var(--gz-muted);">Cohort {{ c.cohort_number }}</p>
                  }
                  <h3 class="text-2xl md:text-3xl mb-4 transition-colors duration-200 group-hover:opacity-80"
                      style="color: var(--gz-text); font-family: 'Bebas Neue', sans-serif;">
                    {{ c.title | uppercase }}
                  </h3>

                  @if (c.description) {
                    <p class="text-sm leading-relaxed mb-6" style="color: var(--gz-muted);">
                      {{ c.description | slice:0:120 }}{{ (c.description?.length ?? 0) > 120 ? '…' : '' }}
                    </p>
                  }

                  <!-- Enrolled -->
                  <div class="flex items-center justify-between pt-4" style="border-top: 1px solid var(--gz-border);">
                    <div>
                      <p class="text-2xl" style="color: var(--gz-gold); font-family: 'Bebas Neue', sans-serif;">{{ c.enrolled_count }}</p>
                      <p class="text-xs tracking-widest uppercase" style="color: var(--gz-muted);">Enrolled</p>
                    </div>
                    <span class="text-xs tracking-widest uppercase transition-colors" style="color: var(--gz-gold);">View Cohort →</span>
                  </div>
                </a>
              }
            </div>
          </div>
        </div>
      }

    </main>

    <app-footer />
  `,
})
export class ApprenticeshipComponent implements OnInit {
  private readonly fb      = new FormBuilder();
  private readonly content = inject(ContentService);

  submitted = signal(false);
  sending   = signal(false);
  error     = signal('');
  cohorts   = signal<ApprenticeshipCohort[]>([]);

  readonly stats       = STATS;
  readonly whatYouGet  = WHAT_YOU_GET;

  readonly eligibility = [
    'Students currently enrolled in film, media, communications or related studies',
    'Recent graduates looking to break into the industry',
    'Anyone with a passion for film and television who wants hands-on experience',
    'Open to applicants across Kenya and the East African region',
    'No prior on-set experience required',
  ];

  ngOnInit(): void {
    this.content.getCohorts().subscribe((c) => this.cohorts.set(c));
  }

  form = this.fb.nonNullable.group({
    name:      ['', Validators.required],
    email:     ['', [Validators.required, Validators.email]],
    phone:     ['', Validators.required],
    about:     ['', Validators.required],
    why:       ['', Validators.required],
    portfolio: [''],
  });

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.sending()) return;
    this.sending.set(true);
    this.error.set('');

    const { name, email, phone, about, why, portfolio } = this.form.getRawValue();
    const { serviceId, templateId, publicKey } = environment.emailJs;

    try {
      await emailjs.send(serviceId, templateId, {
        from_name:  name,
        from_email: email,
        phone,
        message: `APPRENTICESHIP APPLICATION\n\nAbout: ${about}\n\nWhy GZP: ${why}\n\nPortfolio: ${portfolio || 'Not provided'}`,
      } as Record<string, unknown>, publicKey);
      this.submitted.set(true);
    } catch {
      this.error.set('Something went wrong. Please email us directly at info@goldenzealpictures.co.ke');
      this.sending.set(false);
    }
  }
}
