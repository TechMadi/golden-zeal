import { Component, OnInit, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ContentService } from '../../core/services/content.service';
import { AppHeaderComponent } from '../../layout/header/header.component';
import { AppFooterComponent } from '../../layout/footer/footer.component';
import { RevealDirective } from '../../core/directives/reveal.directive';
import type { TeamMember, RegionalRep } from 'shared';

// Keep EmailJS for sending
import emailjs from '@emailjs/browser';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, AppHeaderComponent, AppFooterComponent, RevealDirective],
  template: `
    <app-header />

    <main style="background: var(--gz-black); min-height: 100vh;">
      <!-- Page header -->
      <div class="pt-32 pb-16 px-6 md:px-10" style="border-bottom: 1px solid var(--gz-border);">
        <div class="max-w-7xl mx-auto">
          <p appReveal class="text-xs tracking-[0.3em] uppercase mb-3" style="color: var(--gz-gold);">Let's Talk</p>
          <h1 appReveal class="text-6xl md:text-8xl reveal-delay-1" style="color: var(--gz-text);">CONTACT</h1>
        </div>
      </div>

      <div class="px-6 md:px-10 py-16 max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
        <!-- Left: Form -->
        <div>
          <p appReveal class="text-base md:text-lg mb-10 leading-relaxed" style="color: var(--gz-muted);">
            Tell us about your project — scope, timeline and location. We'll respond within 48 hours.
          </p>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-8">
            @if (message()) {
              <div class="p-4 text-sm" [style.background]="messageType() === 'success' ? 'rgba(201,160,74,0.1)' : 'rgba(255,80,80,0.1)'"
                   [style.border]="messageType() === 'success' ? '1px solid var(--gz-gold)' : '1px solid rgba(255,80,80,0.5)'"
                   [style.color]="messageType() === 'success' ? 'var(--gz-gold)' : '#ff8080'">
                {{ message() }}
              </div>
            }

            @for (field of formFields; track field.name) {
              <div>
                <label [for]="field.name" class="block text-xs tracking-[0.2em] uppercase mb-3" style="color: var(--gz-muted);">
                  {{ field.label }}{{ field.required ? ' *' : '' }}
                </label>
                @if (field.type === 'textarea') {
                  <textarea
                    [id]="field.name"
                    [formControlName]="field.name"
                    rows="4"
                    class="w-full bg-transparent resize-none py-2 text-sm focus:outline-none transition-colors"
                    style="color: var(--gz-text); border-bottom: 1px solid var(--gz-border);"
                  ></textarea>
                } @else {
                  <input
                    [id]="field.name"
                    [type]="field.type"
                    [formControlName]="field.name"
                    class="w-full bg-transparent py-2 text-sm focus:outline-none transition-colors"
                    style="color: var(--gz-text); border-bottom: 1px solid var(--gz-border);"
                  />
                }
                @if (form.get(field.name)?.invalid && form.get(field.name)?.touched) {
                  <p class="text-xs mt-1" style="color: #ff8080;">{{ field.error }}</p>
                }
              </div>
            }

            <button
              type="submit"
              class="btn-gold"
              [disabled]="form.invalid || sending()"
              [style.opacity]="form.invalid || sending() ? '0.5' : '1'"
            >
              {{ sending() ? 'SENDING...' : 'SUBMIT PROJECT' }}
            </button>
          </form>
        </div>

        <!-- Right: Staff + Reps -->
        <div class="space-y-12">
          <!-- Direct contacts -->
          <div>
            <h2 appReveal class="text-3xl mb-8" style="color: var(--gz-text);">DIRECT CONTACT</h2>
            <div class="space-y-6">
              <div appReveal style="border-bottom: 1px solid var(--gz-border);" class="pb-6">
                <p class="text-xs tracking-[0.2em] uppercase mb-1" style="color: var(--gz-gold);">Phone</p>
                <a href="tel:+254722833358" class="text-base transition-colors" style="color: var(--gz-text);">+254 722 833 358</a>
              </div>
              <div appReveal style="border-bottom: 1px solid var(--gz-border);" class="pb-6">
                <p class="text-xs tracking-[0.2em] uppercase mb-1" style="color: var(--gz-gold);">Email</p>
                <a href="mailto:rodgers@goldenzealpictures.co.ke" class="text-base transition-colors" style="color: var(--gz-text);">
                  rodgers&#64;goldenzealpictures.co.ke
                </a>
              </div>
              <div appReveal class="pb-6">
                <p class="text-xs tracking-[0.2em] uppercase mb-1" style="color: var(--gz-gold);">Location</p>
                <p class="text-base" style="color: var(--gz-text);">Nairobi, Kenya</p>
              </div>
            </div>
          </div>

          <!-- Regional reps -->
          @if (reps().length > 0) {
            <div>
              <h2 appReveal class="text-3xl mb-8" style="color: var(--gz-text);">REGIONAL REPS</h2>
              <div class="space-y-4">
                @for (rep of reps(); track rep.id) {
                  <div appReveal class="py-4" style="border-bottom: 1px solid var(--gz-border);">
                    <p class="text-xs tracking-[0.2em] uppercase mb-2" style="color: var(--gz-gold);">{{ rep.region }}</p>
                    <p class="text-sm mb-1" style="color: var(--gz-text);">{{ rep.name }}</p>
                    @if (rep.phone) {
                      <a [href]="'tel:' + rep.phone" class="text-xs block transition-colors" style="color: var(--gz-muted);">{{ rep.phone }}</a>
                    }
                    @if (rep.email) {
                      <a [href]="'mailto:' + rep.email" class="text-xs block transition-colors" style="color: var(--gz-muted);">{{ rep.email }}</a>
                    }
                  </div>
                }
              </div>
            </div>
          }

          <!-- Socials -->
          <div appReveal>
            <p class="text-xs tracking-[0.3em] uppercase mb-4" style="color: var(--gz-gold);">Follow Us</p>
            <div class="flex flex-wrap gap-4">
              @for (social of socials; track social.label) {
                <a [href]="social.href" target="_blank" rel="noopener"
                   class="text-xs tracking-[0.2em] uppercase transition-colors" style="color: var(--gz-muted);">
                  {{ social.label }}
                </a>
              }
            </div>
          </div>
        </div>
      </div>
    </main>

    <app-footer />
  `,
})
export class ContactComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly content = inject(ContentService);

  reps = signal<RegionalRep[]>([]);
  sending = signal(false);
  message = signal('');
  messageType = signal<'success' | 'error'>('success');

  readonly formFields = [
    { name: 'name',    label: 'Name',    type: 'text',     required: true,  error: 'Name is required' },
    { name: 'email',   label: 'Email',   type: 'email',    required: true,  error: 'Valid email required' },
    { name: 'phone',   label: 'Phone',   type: 'tel',      required: false, error: '' },
    { name: 'message', label: 'Message', type: 'textarea', required: true,  error: 'Message is required' },
  ];

  readonly socials = [
    { href: 'https://www.instagram.com/goldenzealpictures/', label: 'Instagram' },
    { href: 'https://vimeo.com/goldenzealpictures',          label: 'Vimeo' },
    { href: 'https://www.linkedin.com/company/golden-zeal-pictures/', label: 'LinkedIn' },
    { href: 'https://www.tiktok.com/@golden.zeal.pictures',  label: 'TikTok' },
  ];

  form = this.fb.nonNullable.group({
    name:    ['', Validators.required],
    email:   ['', [Validators.required, Validators.email]],
    phone:   [''],
    message: ['', Validators.required],
  });

  ngOnInit(): void {
    this.content.getReps().subscribe((r) => this.reps.set(r));
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.sending()) return;
    this.sending.set(true);
    this.message.set('');
    try {
      const { serviceId, templateId, publicKey } = environment.emailJs;
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name:  this.form.getRawValue().name,
          from_email: this.form.getRawValue().email,
          phone:      this.form.getRawValue().phone || '',
          message:    this.form.getRawValue().message,
        },
        publicKey
      );
      this.messageType.set('success');
      this.message.set('Thank you — your message has been sent. We will be in touch within 48 hours.');
      this.form.reset();
    } catch {
      this.messageType.set('error');
      this.message.set('Something went wrong. Please email us directly at rodgers@goldenzealpictures.co.ke');
    } finally {
      this.sending.set(false);
    }
  }
}
