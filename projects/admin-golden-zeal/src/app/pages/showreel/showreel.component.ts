import { Component, OnInit, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminSupabaseService } from '../../services/admin-supabase.service';
import type { Showreel } from 'shared';

@Component({
  selector: 'app-showreel-admin',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="p-6 md:p-10 max-w-2xl">
      <h1 class="text-3xl mb-4" style="font-family:'Bebas Neue',sans-serif;color:#F0EBE0;">SHOWREEL</h1>
      <p class="text-sm mb-8" style="color:#888880;">
        The active showreel plays as the full-screen background video on the home page hero.
        Enter only the Vimeo video ID (e.g. <span style="color:#C9A04A;">123456789</span>).
      </p>

      @if (current()) {
        <div class="p-4 mb-8" style="background:#141414;border:1px solid rgba(240,235,224,0.07);">
          <p class="text-xs tracking-widest uppercase mb-2" style="color:#C9A04A;">Current Showreel</p>
          <p class="text-sm" style="color:#F0EBE0;">{{ current()!.title ?? 'Untitled' }}</p>
          <p class="text-xs mt-1" style="color:#888880;">Vimeo ID: {{ current()!.vimeo_id }}</p>
          <a [href]="'https://vimeo.com/' + current()!.vimeo_id" target="_blank" rel="noopener"
             class="text-xs mt-2 inline-block" style="color:#C9A04A;">Preview on Vimeo ↗</a>
        </div>
      }

      @if (saved()) {
        <div class="p-3 mb-6 text-xs" style="background:rgba(201,160,74,0.1);border:1px solid #C9A04A;color:#C9A04A;">Showreel updated.</div>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
        <div>
          <label for="vimeo_id" class="block text-xs tracking-widest uppercase mb-1" style="color:#888880;">Vimeo ID *</label>
          <input id="vimeo_id" type="text" formControlName="vimeo_id" placeholder="e.g. 123456789"
                 class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                 style="color:#F0EBE0;border:1px solid rgba(240,235,224,0.1);" />
        </div>
        <div>
          <label for="title" class="block text-xs tracking-widest uppercase mb-1" style="color:#888880;">Title (optional)</label>
          <input id="title" type="text" formControlName="title"
                 class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                 style="color:#F0EBE0;border:1px solid rgba(240,235,224,0.1);" />
        </div>
        <div>
          <label for="thumbnail_url" class="block text-xs tracking-widest uppercase mb-1" style="color:#888880;">Thumbnail URL (fallback image)</label>
          <input id="thumbnail_url" type="text" formControlName="thumbnail_url"
                 class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                 style="color:#F0EBE0;border:1px solid rgba(240,235,224,0.1);" />
        </div>
        <button type="submit" [disabled]="form.invalid || saving()" class="px-6 py-2 text-xs uppercase tracking-widest" style="background:#C9A04A;color:#0f0f0f;">
          {{ saving() ? 'Saving...' : 'Set Active Showreel' }}
        </button>
      </form>
    </div>
  `,
})
export class ShowreelAdminComponent implements OnInit {
  private readonly admin = inject(AdminSupabaseService);
  private readonly fb = inject(FormBuilder);
  current = signal<Showreel | null>(null); saving = signal(false); saved = signal(false);

  form = this.fb.nonNullable.group({
    vimeo_id:      ['', Validators.required],
    title:         [''],
    thumbnail_url: [''],
  });

  ngOnInit(): void {
    this.admin.list<Showreel>('showreel').subscribe((rows) => {
      if (rows.length > 0) {
        this.current.set(rows[0]);
        const { vimeo_id, title, thumbnail_url } = rows[0];
        this.form.patchValue({ vimeo_id, title: title ?? '', thumbnail_url: thumbnail_url ?? '' });
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);
    const data = this.form.getRawValue();
    const c = this.current();
    const obs = c
      ? this.admin.update<Showreel>('showreel', c.id, data)
      : this.admin.create<Showreel>('showreel', data);
    obs.subscribe({
      next: (s) => { this.current.set(s); this.saving.set(false); this.saved.set(true); setTimeout(() => this.saved.set(false), 2000); },
      error: () => this.saving.set(false),
    });
  }
}
