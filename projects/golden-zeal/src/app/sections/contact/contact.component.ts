import { Component, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { ContactEmailService } from '../../core/services/contact-email.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, NgIcon],
  template: `
    <section
      id="contact"
      class="relative"
      style="background: var(--gz-black); color: var(--gz-ivory);"
    >
      <!-- Header bar with Follow us and social links -->
      <div class="px-8 md:px-16 py-4 flex items-center justify-between border-b border-white/10 ">
        <p class="text-white text-sm md:text-xl">Follow us</p>
        <!-- <div class="flex items-center gap-4 md:gap-6"> -->
          <a
            href="https://www.linkedin.com/company/golden-zeal-pictures/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-white hover:opacity-80 transition text-sm md:text-xl"
            aria-label="LinkedIn"
          >
            [LinkedIn]
          </a>
          <a
            href="https://www.instagram.com/goldenzealpictures/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-white hover:opacity-80 transition text-sm md:text-xl"
            aria-label="Instagram"
          >
            [Instagram]
          </a>
          <a
            href="https://www.tiktok.com/@golden.zeal.pictures"
            target="_blank"
            rel="noopener noreferrer"
            class="text-white hover:opacity-80 transition text-sm md:text-xl"
            aria-label="TikTok"
          >
            [TikTok]
          </a>
          <a
            href="https://vimeo.com/goldenzealpictures"
            target="_blank"
            rel="noopener noreferrer"
            class="text-white hover:opacity-80 transition text-sm md:text-xl"
            aria-label="Vimeo"
          >
            [Vimeo]
          </a>
        <!-- </div> -->
      </div>

      <!-- Main content: form left, image right -->
      <div class="grid md:grid-cols-2 gap-8 md:gap-12 px-4 md:px-16 py-12 md:py-16 items-end">
        <!-- Left: Contact form -->
        <div class="space-y-8">
          <div>
            <h2 class="text-4xl md:text-5xl lg:text-[12rem] font-bold text-white mb-4">
              Contact us
            </h2>
            <p class="text-white/90 text-base md:text-lg">
              Let's create something Pop-tacular together
            </p>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
            @if (message()) {
              <div
                class="p-4 rounded text-sm"
                [class.bg-green-900/50]="messageType() === 'success'"
                [class.bg-red-900/50]="messageType() === 'error'"
              >
                {{ message() }}
              </div>
            }

            <div>
              <label for="name" class="block text-white text-sm mb-2">Name</label>
              <div class="border-b border-white">
                <input
                  id="name"
                  type="text"
                  formControlName="name"
                  class="w-full bg-transparent text-white placeholder-white/50 py-2 focus:outline-none focus-visible:outline-none"
                  placeholder=""
                />
              </div>
              @if (form.get('name')?.invalid && form.get('name')?.touched) {
                <p class="text-red-300 text-xs mt-1">Name is required</p>
              }
            </div>

            <div>
              <label for="email" class="block text-white text-sm mb-2">Email</label>
              <div class="border-b border-white">
                <input
                  id="email"
                  type="email"
                  formControlName="email"
                  class="w-full bg-transparent text-white placeholder-white/50 py-2 focus:outline-none focus-visible:outline-none"
                  placeholder=""
                />
              </div>
              @if (form.get('email')?.invalid && form.get('email')?.touched) {
                <p class="text-red-300 text-xs mt-1">Valid email is required</p>
              }
            </div>

            <div>
              <label for="phone" class="block text-white text-sm mb-2">Phone</label>
              <div class="border-b border-white">
                <input
                  id="phone"
                  type="tel"
                  formControlName="phone"
                  class="w-full bg-transparent text-white placeholder-white/50 py-2 focus:outline-none focus-visible:outline-none"
                  placeholder=""
                />
              </div>
            </div>

            <div>
              <label for="message" class="block text-white text-sm mb-2">Message</label>
              <div class="border-b border-white flex items-end">
                <textarea
                  id="message"
                  formControlName="message"
                  rows="3"
                  class="w-full bg-transparent text-white placeholder-white/50 py-2 focus:outline-none focus-visible:outline-none resize-none"
                  placeholder=""
                ></textarea>
                <ng-icon name="chevronDown" size="16" class="text-white/50 mb-2 shrink-0" />
              </div>
              @if (form.get('message')?.invalid && form.get('message')?.touched) {
                <p class="text-red-300 text-xs mt-1">Message is required</p>
              }
            </div>

            <div class="flex gap-4 pt-4">
              <button
                type="button"
                class="px-6 py-2 border border-white text-white bg-transparent hover:bg-white hover:text-black transition text-sm md:text-base flex items-center gap-2"
              >
                <ng-icon name="arrowRight" size="16" />
                Attach file
              </button>
              <button
                type="submit"
                class="px-6 py-2 border border-white text-white bg-transparent hover:bg-white hover:text-black transition text-sm md:text-base flex items-center gap-2 disabled:opacity-50"
                [disabled]="form.invalid || sending()"
              >
                {{ sending() ? 'Sending…' : 'Submit Project' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Right: Studio image -->
        <div class="hidden md:block">
          <div class="h-full max-h-[400px] relative">
            <img
              src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800"
              alt="Studio"
              class="w-full h-full object-cover mb-0"
            />
            <!-- Contact info overlay -->
            <div class="absolute bottom-0 left-0 right-0 p-4 bg-black/50 backdrop-blur-sm">
              <div class="space-y-2 text-white text-sm">
                <p>
                  <a href="tel:+254700000000" class="hover:opacity-80 transition">
                    +254 700 000 000
                  </a>
                </p>
                <p>
                  <a href="mailto:info@goldenzealpictures.co.ke" class="hover:opacity-80 transition">
                    info@goldenzealpictures.co.ke
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Footer with copyright and blue line -->
      <div class="px-4 md:px-8 py-6 border-t border-white/10">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p class="text-white text-xs md:text-sm">
            © 2025 Golden Zeal all right reserved
          </p>
          <div class="flex flex-col md:flex-row gap-4 md:gap-6 text-white text-xs md:text-sm">
           
            <a href="mailto:info@goldenzealpictures.co.ke" class="hover:opacity-80 transition">
              info@goldenzealpictures.co.ke
            </a>
            <span>Nairobi, Kenya</span>
          </div>
        </div>
        <div class="mt-4 h-0.5" style="background: #5DBCD2;"></div>
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