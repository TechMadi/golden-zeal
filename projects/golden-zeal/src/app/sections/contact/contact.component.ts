import { Component, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ContactEmailService } from '../../core/services/contact-email.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section
      id="contact"
      class="py-16 md:py-24 px-4 md:px-8"
      style="background: var(--gz-black); color: var(--gz-ivory);"
    >
      <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        <div>
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Contact us</h2>
          <p class="text-xl text-white/90 mb-8">Let's create something together</p>
          <div class="aspect-[4/3] rounded-lg overflow-hidden max-w-md opacity-80">
            <img
              src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=500"
              alt="Contact"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="space-y-4 max-w-md"
        >
          @if (message()) {
            <div
              class="p-4 rounded"
              [class.bg-green-900/50]="messageType() === 'success'"
              [class.bg-red-900/50]="messageType() === 'error'"
            >
              {{ message() }}
            </div>
          }
          <div>
            <label for="name" class="block text-sm font-medium mb-1">Name</label>
            <input
              id="name"
              type="text"
              formControlName="name"
              class="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[var(--gz-gold)]"
              placeholder="Your name"
            />
            @if (form.get('name')?.invalid && form.get('name')?.touched) {
              <p class="text-red-300 text-sm mt-1">Name is required</p>
            }
          </div>
          <div>
            <label for="email" class="block text-sm font-medium mb-1">Email</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[var(--gz-gold)]"
              placeholder="your@email.com"
            />
            @if (form.get('email')?.invalid && form.get('email')?.touched) {
              <p class="text-red-300 text-sm mt-1">Valid email is required</p>
            }
          </div>
          <div>
            <label for="phone" class="block text-sm font-medium mb-1">Phone</label>
            <input
              id="phone"
              type="tel"
              formControlName="phone"
              class="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[var(--gz-gold)]"
              placeholder="+1 234 567 8900"
            />
          </div>
          <div>
            <label for="message" class="block text-sm font-medium mb-1">Message</label>
            <textarea
              id="message"
              formControlName="message"
              rows="4"
              class="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[var(--gz-gold)] resize-none"
              placeholder="Tell us about your project"
            ></textarea>
            @if (form.get('message')?.invalid && form.get('message')?.touched) {
              <p class="text-red-300 text-sm mt-1">Message is required</p>
            }
          </div>
          <button
            type="submit"
            class="cta px-8 py-3 rounded font-semibold border-2 border-transparent transition disabled:opacity-50"
            [disabled]="form.invalid || sending()"
          >
            {{ sending() ? 'Sending…' : 'Send Project' }}
          </button>
        </form>
      </div>
    </section>
  `,
})
export class AppContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly contactEmail = inject(ContactEmailService);

  sending = signal(false);
  message = signal('');
  messageType = signal<'success' | 'error'>('success');

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    message: ['', Validators.required],
  });

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.sending()) return;
    this.sending.set(true);
    this.message.set('');
    try {
      await this.contactEmail.send({
        from_name: this.form.getRawValue().name,
        from_email: this.form.getRawValue().email,
        phone: this.form.getRawValue().phone || undefined,
        message: this.form.getRawValue().message,
      });
      this.messageType.set('success');
      this.message.set('Thank you! Your message has been sent.');
      this.form.reset();
    } catch {
      this.messageType.set('error');
      this.message.set('Something went wrong. Please try again later.');
    } finally {
      this.sending.set(false);
    }
  }
}
