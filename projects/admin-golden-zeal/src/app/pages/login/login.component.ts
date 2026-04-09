import { Component, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminSupabaseService } from '../../services/admin-supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4" style="background: #0f0f0f;">
      <div class="w-full max-w-sm space-y-8">
        <!-- Logo -->
        <div class="text-center">
          <img src="assets/brand/full_logo.png" alt="Golden Zeal Pictures" class="h-10 w-auto mx-auto mb-2" style="filter: brightness(0) invert(1);" />
          <p class="text-xs tracking-[0.3em] uppercase" style="color: #888880;">CMS Admin</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
          @if (error()) {
            <div class="p-3 text-sm text-center" style="background: rgba(255,80,80,0.1); border: 1px solid rgba(255,80,80,0.3); color: #ff8080;">
              {{ error() }}
            </div>
          }

          <div>
            <label for="email" class="block text-xs tracking-[0.2em] uppercase mb-2" style="color: #888880;">Email</label>
            <input
              id="email" type="email" formControlName="email"
              class="w-full bg-transparent py-3 px-4 text-sm focus:outline-none"
              style="color: #F0EBE0; border: 1px solid rgba(240,235,224,0.1);"
              placeholder="admin@goldenzealpictures.co.ke"
            />
          </div>

          <div>
            <label for="password" class="block text-xs tracking-[0.2em] uppercase mb-2" style="color: #888880;">Password</label>
            <input
              id="password" type="password" formControlName="password"
              class="w-full bg-transparent py-3 px-4 text-sm focus:outline-none"
              style="color: #F0EBE0; border: 1px solid rgba(240,235,224,0.1);"
            />
          </div>

          <button
            type="submit"
            class="w-full py-3 text-sm tracking-[0.15em] uppercase font-medium transition-all duration-200"
            [disabled]="form.invalid || loading()"
            style="background: #C9A04A; color: #0f0f0f;"
            [style.opacity]="form.invalid || loading() ? '0.6' : '1'"
          >
            {{ loading() ? 'SIGNING IN...' : 'SIGN IN' }}
          </button>
        </form>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly admin = inject(AdminSupabaseService);
  private readonly router = inject(Router);

  loading = signal(false);
  error = signal('');

  form = this.fb.nonNullable.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    this.error.set('');
    this.admin.signIn(this.form.getRawValue().email, this.form.getRawValue().password)
      .subscribe({
        next: ({ error }) => {
          if (error) {
            this.error.set(error.message);
            this.loading.set(false);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: () => {
          this.error.set('Failed to sign in. Please try again.');
          this.loading.set(false);
        },
      });
  }
}
