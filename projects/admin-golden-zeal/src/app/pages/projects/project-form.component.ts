import { Component, OnInit, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminSupabaseService } from '../../services/admin-supabase.service';
import type { Director, Photographer } from 'shared';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="p-6 md:p-10 max-w-2xl">
      <div class="flex items-center gap-4 mb-8">
        <a routerLink="/projects" class="text-xs tracking-widest uppercase" style="color:#888880;">← Projects</a>
        <h1 class="text-3xl" style="font-family:'Bebas Neue',sans-serif; color:#F0EBE0;">
          {{ isEdit() ? 'EDIT PROJECT' : 'NEW PROJECT' }}
        </h1>
      </div>

      @if (saved()) {
        <div class="p-3 mb-6 text-sm" style="background:rgba(201,160,74,0.1); border:1px solid #C9A04A; color:#C9A04A;">
          Saved successfully.
        </div>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
        @for (field of textFields; track field.name) {
          <div>
            <label [for]="field.name" class="block text-xs tracking-[0.2em] uppercase mb-2" style="color:#888880;">{{ field.label }}</label>
            <input [id]="field.name" [type]="field.type" [formControlName]="field.name"
                   class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                   style="color:#F0EBE0; border:1px solid rgba(240,235,224,0.1);" />
          </div>
        }

        <!-- Category -->
        <div>
          <label class="block text-xs tracking-[0.2em] uppercase mb-2" style="color:#888880;">Category</label>
          <select formControlName="category" class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                  style="color:#F0EBE0; border:1px solid rgba(240,235,224,0.1); background:#141414;">
            <option value="commercial">Commercial</option>
            <option value="cinematic">Cinematic</option>
            <option value="music_video">Music Video</option>
            <option value="stills">Stills</option>
          </select>
        </div>

        <!-- Director -->
        <div>
          <label class="block text-xs tracking-[0.2em] uppercase mb-2" style="color:#888880;">Director (optional)</label>
          <select formControlName="director_id" class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                  style="color:#F0EBE0; border:1px solid rgba(240,235,224,0.1); background:#141414;">
            <option value="">— None —</option>
            @for (d of directors(); track d.id) {
              <option [value]="d.id">{{ d.name }}</option>
            }
          </select>
        </div>

        <!-- Photographer -->
        <div>
          <label class="block text-xs tracking-[0.2em] uppercase mb-2" style="color:#888880;">Photographer (optional)</label>
          <select formControlName="photographer_id" class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                  style="color:#F0EBE0; border:1px solid rgba(240,235,224,0.1); background:#141414;">
            <option value="">— None —</option>
            @for (p of photographers(); track p.id) {
              <option [value]="p.id">{{ p.name }}</option>
            }
          </select>
        </div>

        <!-- Featured -->
        <div class="flex items-center gap-3">
          <input id="featured" type="checkbox" formControlName="featured" class="w-4 h-4" />
          <label for="featured" class="text-xs tracking-[0.2em] uppercase" style="color:#888880;">Featured on Homepage</label>
        </div>

        <!-- Thumbnail upload -->
        <div>
          <label class="block text-xs tracking-[0.2em] uppercase mb-2" style="color:#888880;">Thumbnail Image</label>
          <input type="file" accept="image/*" (change)="onFileChange($event, 'thumbnail')"
                 class="text-sm" style="color:#888880;" />
          @if (form.get('thumbnail_url')?.value) {
            <img [src]="form.get('thumbnail_url')?.value" class="mt-3 h-24 object-cover" />
          }
        </div>

        <div class="flex gap-4 pt-4">
          <button type="submit" [disabled]="form.invalid || saving()" class="px-6 py-2 text-sm tracking-widest uppercase transition-colors"
                  style="background:#C9A04A; color:#0f0f0f;" [style.opacity]="saving() ? '0.6' : '1'">
            {{ saving() ? 'Saving...' : 'Save' }}
          </button>
          <a routerLink="/projects" class="px-6 py-2 text-sm tracking-widest uppercase transition-colors"
             style="border:1px solid rgba(240,235,224,0.1); color:#888880;">Cancel</a>
        </div>
      </form>
    </div>
  `,
})
export class ProjectFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly admin = inject(AdminSupabaseService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  isEdit = signal(false);
  saving = signal(false);
  saved = signal(false);
  directors = signal<Director[]>([]);
  photographers = signal<Photographer[]>([]);
  private projectId = '';

  readonly textFields = [
    { name: 'title',         label: 'Title *',         type: 'text'   },
    { name: 'slug',          label: 'Slug *',          type: 'text'   },
    { name: 'client',        label: 'Client',          type: 'text'   },
    { name: 'year',          label: 'Year',            type: 'number' },
    { name: 'vimeo_id',      label: 'Vimeo ID',        type: 'text'   },
    { name: 'thumbnail_url', label: 'Thumbnail URL',   type: 'text'   },
    { name: 'display_order', label: 'Display Order',   type: 'number' },
  ];

  form = this.fb.nonNullable.group({
    title:          ['', Validators.required],
    slug:           ['', Validators.required],
    client:         [''],
    year:           [new Date().getFullYear()],
    category:       ['commercial', Validators.required],
    director_id:    [''],
    photographer_id:[''],
    vimeo_id:       [''],
    thumbnail_url:  [''],
    featured:       [false],
    display_order:  [0],
  });

  ngOnInit(): void {
    this.admin.list<Director>('directors').subscribe((d) => this.directors.set(d));
    this.admin.list<Photographer>('photographers').subscribe((p) => this.photographers.set(p));

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit.set(true);
      this.projectId = id;
      this.admin.get<any>('projects', id).subscribe((p) => {
        if (p) this.form.patchValue(p);
      });
    }
  }

  async onFileChange(event: Event, field: string): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const path = `thumbnails/${Date.now()}-${file.name}`;
    const url = await this.admin.uploadImage('media', path, file);
    this.form.patchValue({ thumbnail_url: url });
  }

  onSubmit(): void {
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);
    const data = { ...this.form.getRawValue() };
    const obs = this.isEdit()
      ? this.admin.update('projects', this.projectId, data)
      : this.admin.create('projects', data);
    obs.subscribe({
      next: () => {
        this.saving.set(false);
        this.saved.set(true);
        setTimeout(() => this.router.navigate(['/projects']), 1000);
      },
      error: () => this.saving.set(false),
    });
  }
}
