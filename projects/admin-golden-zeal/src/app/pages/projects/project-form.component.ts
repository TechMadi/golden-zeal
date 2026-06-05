import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminSupabaseService } from '../../services/admin-supabase.service';
import type { Director, Photographer } from 'shared';

const SUB_CATEGORIES: Record<string, { value: string; label: string }[]> = {
  commercial: [
    { value: 'tvc',        label: 'TVC'        },
    { value: 'animations', label: 'Animations' },
  ],
  cinematic: [
    { value: 'commissioned',  label: 'Commissioned Work' },
    { value: 'original_film', label: 'Original Film'     },
  ],
};

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

      @if (errorMsg()) {
        <div class="p-3 mb-6 text-sm" style="background:rgba(220,50,50,0.1); border:1px solid #dc3232; color:#ff6b6b;">
          {{ errorMsg() }}
        </div>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">

        <!-- Title -->
        <div>
          <label for="title" class="block text-xs tracking-[0.2em] uppercase mb-2" style="color:#888880;">Title *</label>
          <input id="title" type="text" formControlName="title"
                 class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                 style="color:#F0EBE0; border:1px solid rgba(240,235,224,0.1);" />
        </div>

        <!-- Slug -->
        <div>
          <label for="slug" class="block text-xs tracking-[0.2em] uppercase mb-2" style="color:#888880;">
            Slug * <span style="color:#555; font-weight:400; text-transform:none; letter-spacing:0;">(auto-filled from title)</span>
          </label>
          <input id="slug" type="text" formControlName="slug"
                 class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                 style="color:#F0EBE0; border:1px solid rgba(240,235,224,0.1);" />
        </div>

        <!-- Client -->
        <div>
          <label for="client" class="block text-xs tracking-[0.2em] uppercase mb-2" style="color:#888880;">Client</label>
          <input id="client" type="text" formControlName="client"
                 class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                 style="color:#F0EBE0; border:1px solid rgba(240,235,224,0.1);" />
        </div>

        <!-- Year -->
        <div>
          <label for="year" class="block text-xs tracking-[0.2em] uppercase mb-2" style="color:#888880;">Year</label>
          <input id="year" type="number" formControlName="year"
                 class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                 style="color:#F0EBE0; border:1px solid rgba(240,235,224,0.1);" />
        </div>

        <!-- Vimeo ID -->
        <div>
          <label for="vimeo_id" class="block text-xs tracking-[0.2em] uppercase mb-2" style="color:#888880;">Vimeo ID</label>
          <input id="vimeo_id" type="text" formControlName="vimeo_id" placeholder="e.g. 123456789"
                 class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                 style="color:#F0EBE0; border:1px solid rgba(240,235,224,0.1);" />
        </div>

        <!-- YouTube ID -->
        <div>
          <label for="youtube_id" class="block text-xs tracking-[0.2em] uppercase mb-2" style="color:#888880;">YouTube ID</label>
          <input id="youtube_id" type="text" formControlName="youtube_id" placeholder="e.g. dQw4w9WgXcQ"
                 class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                 style="color:#F0EBE0; border:1px solid rgba(240,235,224,0.1);" />
        </div>

        <!-- Thumbnail URL -->
        <div>
          <label for="thumbnail_url" class="block text-xs tracking-[0.2em] uppercase mb-2" style="color:#888880;">Thumbnail URL</label>
          <input id="thumbnail_url" type="text" formControlName="thumbnail_url"
                 class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                 style="color:#F0EBE0; border:1px solid rgba(240,235,224,0.1);" />
        </div>

        <!-- Display Order -->
        <div>
          <label for="display_order" class="block text-xs tracking-[0.2em] uppercase mb-2" style="color:#888880;">Display Order</label>
          <input id="display_order" type="number" formControlName="display_order"
                 class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                 style="color:#F0EBE0; border:1px solid rgba(240,235,224,0.1);" />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-xs tracking-[0.2em] uppercase mb-2" style="color:#888880;">Description</label>
          <textarea formControlName="description" rows="4"
                    class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none resize-vertical"
                    style="color:#F0EBE0; border:1px solid rgba(240,235,224,0.1);"
                    placeholder="Brief project description shown on the project page..."></textarea>
        </div>

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

        <!-- Sub-category (shown only when options exist) -->
        @if (subCategoryOptions().length > 0) {
          <div>
            <label class="block text-xs tracking-[0.2em] uppercase mb-2" style="color:#888880;">Sub-category</label>
            <select formControlName="sub_category" class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                    style="color:#F0EBE0; border:1px solid rgba(240,235,224,0.1); background:#141414;">
              <option value="">— None —</option>
              @for (opt of subCategoryOptions(); track opt.value) {
                <option [value]="opt.value">{{ opt.label }}</option>
              }
            </select>
          </div>
        }

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
          <input type="file" accept="image/*" (change)="onFileChange($event)"
                 [disabled]="uploadingImage()"
                 class="text-sm" style="color:#888880;" />
          @if (uploadingImage()) {
            <p class="mt-2 text-xs" style="color:#C9A04A;">Uploading image...</p>
          }
          @if (form.get('thumbnail_url')?.value) {
            <img [src]="form.get('thumbnail_url')?.value" class="mt-3 h-24 object-cover" />
            <p class="mt-1 text-xs break-all" style="color:#555;">{{ form.get('thumbnail_url')?.value }}</p>
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
  errorMsg = signal('');
  uploadingImage = signal(false);
  directors = signal<Director[]>([]);
  photographers = signal<Photographer[]>([]);
  selectedCategory = signal('commercial');
  private projectId = '';

  subCategoryOptions = computed(() => SUB_CATEGORIES[this.selectedCategory()] ?? []);

  form = this.fb.nonNullable.group({
    title:           ['', Validators.required],
    slug:            ['', Validators.required],
    client:          [''],
    description:     [''],
    year:            [new Date().getFullYear()],
    category:        ['commercial', Validators.required],
    sub_category:    [''],
    director_id:     [''],
    photographer_id: [''],
    vimeo_id:        [''],
    youtube_id:      [''],
    thumbnail_url:   [''],
    featured:        [false],
    display_order:   [0],
  });

  ngOnInit(): void {
    this.admin.list<Director>('directors').subscribe((d) => this.directors.set(d));
    this.admin.list<Photographer>('photographers').subscribe((p) => this.photographers.set(p));

    // Auto-generate slug from title (new projects only)
    this.form.get('title')!.valueChanges.subscribe((title) => {
      if (!this.isEdit()) {
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        this.form.patchValue({ slug }, { emitEvent: false });
      }
    });

    // Track category for sub-category options, clear sub_category on change
    this.form.get('category')!.valueChanges.subscribe((cat) => {
      this.selectedCategory.set(cat);
      this.form.patchValue({ sub_category: '' }, { emitEvent: false });
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit.set(true);
      this.projectId = id;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.admin.get<any>('projects', id).subscribe((p) => {
        if (p) {
          this.selectedCategory.set(p.category ?? 'commercial');
          this.form.patchValue(p);
        }
      });
    }
  }

  async onFileChange(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.uploadingImage.set(true);
    try {
      const path = `thumbnails/${Date.now()}-${file.name}`;
      const url = await this.admin.uploadImage('media', path, file);
      this.form.patchValue({ thumbnail_url: url });
    } catch (err: unknown) {
      const msg = (err instanceof Error ? err.message : (err as { message?: string })?.message) ?? 'Upload failed';
      this.errorMsg.set(msg);
    } finally {
      this.uploadingImage.set(false);
    }
  }

  onSubmit(): void {
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);
    this.errorMsg.set('');

    // Convert empty strings to null for optional fields
    const data = Object.fromEntries(
      Object.entries(this.form.getRawValue()).map(([k, v]) => [k, v === '' ? null : v])
    );

    const obs = this.isEdit()
      ? this.admin.update('projects', this.projectId, data)
      : this.admin.create('projects', data);

    obs.subscribe({
      next: () => {
        this.saving.set(false);
        this.saved.set(true);
        setTimeout(() => this.router.navigate(['/projects']), 1000);
      },
      error: (err: unknown) => {
        this.saving.set(false);
        const msg = (err instanceof Error ? err.message : (err as { message?: string })?.message) ?? JSON.stringify(err);
        this.errorMsg.set(`Save failed: ${msg}`);
      },
    });
  }
}
