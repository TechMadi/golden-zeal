import { Component, OnInit, signal, computed, inject, HostListener } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { forkJoin, of, switchMap, map } from 'rxjs';
import { AdminSupabaseService } from '../../services/admin-supabase.service';
import type { Partner, Project } from 'shared';

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

@Component({
  selector: 'app-partners-admin',
  standalone: true,
  imports: [ReactiveFormsModule],
  styles: [`
    .lbl { display:block; font-size:0.75rem; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:0.25rem; color:#8a9e90; }
    .lbl small { text-transform:none; letter-spacing:0; color:#555; font-size:0.75rem; }
    .inp { width:100%; background:transparent; padding:0.5rem 0.75rem; font-size:0.875rem; color:#F0EBE0; border:1px solid rgba(240,235,224,0.1); }
    .inp:focus { outline:none; border-color:#C9A04A; }
    .fs { border:1px solid rgba(240,235,224,0.07); background:#0f1f16; padding:1.25rem; }
    .fs-title { font-size:0.7rem; letter-spacing:0.2em; text-transform:uppercase; color:#C9A04A; margin-bottom:1rem; }
  `],
  template: `
    <div class="p-6 md:p-10 max-w-4xl">
      <h1 class="text-3xl mb-2" style="font-family:'Bebas Neue',sans-serif;color:#F0EBE0;">PARTNERS</h1>
      <p class="text-sm mb-6" style="color:#8a9e90;">
        Published partners appear on /partners in this order. A partner's profile page opens once it has at least one project linked.
      </p>

      @if (!formOpen()) {
        <button type="button" (click)="openAdd()" class="mb-6 px-4 py-2 text-xs uppercase tracking-widest" style="background:#C9A04A;color:#0a150f;">
          + Add Partner
        </button>
      }

      @if (saved()) {
        <div class="p-3 mb-4 text-xs" style="background:rgba(201,160,74,0.1);border:1px solid #C9A04A;color:#C9A04A;">Saved.</div>
      }
      @if (errorMsg()) {
        <div class="p-3 mb-4 text-xs" style="background:rgba(220,50,50,0.1);border:1px solid #dc3232;color:#ff6b6b;">{{ errorMsg() }}</div>
      }

      @if (formOpen()) {
        <div class="mb-10 pb-8" style="border-bottom:1px solid rgba(240,235,224,0.07);">
          <h2 class="text-xl mb-6" style="font-family:'Bebas Neue',sans-serif;color:#F0EBE0;">{{ editing() ? 'EDIT' : 'ADD' }} PARTNER</h2>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
            <!-- Who they are -->
            <div class="fs space-y-4">
              <p class="fs-title">Who they are</p>
              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label for="name" class="lbl">Name *</label>
                  <input id="name" formControlName="name" class="inp" />
                  @if (form.get('slug')?.value) {
                    <p class="mt-1 text-xs" style="color:#555;">/partners/{{ form.get('slug')?.value }}</p>
                  }
                </div>
                <div>
                  <label for="specialty" class="lbl">Specialty *</label>
                  <input id="specialty" formControlName="specialty" placeholder="e.g. Location Sound & Production" class="inp" />
                </div>
              </div>
              <div>
                <label for="role_with_us" class="lbl">Their role with Golden Zeal * <small>one sentence, shown on the card and at the top of the profile</small></label>
                <input id="role_with_us" formControlName="role_with_us" class="inp"
                       placeholder="e.g. Location sound and field production on our documentary and commercial shoots." />
              </div>
              <div>
                <label for="bio" class="lbl">Short bio <small>one paragraph</small></label>
                <textarea id="bio" formControlName="bio" rows="4" class="inp resize-y"></textarea>
              </div>
              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label for="location" class="lbl">Location</label>
                  <input id="location" formControlName="location" placeholder="e.g. Nairobi, Kenya" class="inp" />
                </div>
                <div>
                  <label for="website" class="lbl">Website</label>
                  <input id="website" type="url" formControlName="website" placeholder="https://" class="inp" />
                </div>
              </div>
            </div>

            <!-- Photos -->
            <div class="fs space-y-5">
              <p class="fs-title">Photos</p>
              <div>
                <label class="lbl">Cover photo *</label>
                <input type="file" accept="image/*" (change)="onCover($event)" [disabled]="uploading()" class="text-xs" style="color:#8a9e90;" />
                @if (form.get('cover_url')?.value) {
                  <img [src]="form.get('cover_url')?.value" alt="" class="mt-3 h-28 aspect-video object-cover" />
                }
              </div>
              <div>
                <label class="lbl">Gallery <small>the first photo is shown larger</small></label>
                <input type="file" accept="image/*" multiple (change)="onGallery($event)" [disabled]="uploading()" class="text-xs" style="color:#8a9e90;" />
                @if (gallery().length) {
                  <div class="mt-3 flex flex-wrap gap-3">
                    @for (url of gallery(); track url; let i = $index; let first = $first; let last = $last) {
                      <div class="relative">
                        <img [src]="url" alt="" class="w-24 h-24 object-cover" style="border:1px solid rgba(240,235,224,0.1);" />
                        <div class="flex justify-between mt-1 text-xs">
                          <button type="button" (click)="moveGallery(i, -1)" [disabled]="first" [style.opacity]="first ? 0.3 : 1" style="color:#8a9e90;" title="Move left">←</button>
                          <button type="button" (click)="removeGallery(i)" style="color:#ff6b6b;" title="Remove">✕</button>
                          <button type="button" (click)="moveGallery(i, 1)" [disabled]="last" [style.opacity]="last ? 0.3 : 1" style="color:#8a9e90;" title="Move right">→</button>
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
              @if (uploading()) {
                <p class="text-xs" style="color:#C9A04A;">Uploading…</p>
              }
            </div>

            <!-- Projects together -->
            <div class="fs">
              <p class="fs-title">Projects together</p>
              <p class="text-xs mb-3" style="color:#8a9e90;">Golden Zeal projects made with this partner. You can also set this from the "Partners" field on a project.</p>
              @if (selectedProjects().length) {
                <div class="flex flex-wrap gap-2 mb-3">
                  @for (p of selectedProjects(); track p.id) {
                    <span class="inline-flex items-center gap-2 px-2.5 py-1 text-xs" style="background:rgba(201,160,74,0.15);color:#C9A04A;">
                      {{ p.title }}
                      <button type="button" (click)="toggleProject(p.id)" title="Remove">✕</button>
                    </span>
                  }
                </div>
              }
              <div class="relative project-combobox">
                <input type="text" placeholder="Search projects to add…" [value]="projectQuery()"
                       (input)="projectQuery.set($any($event.target).value); projectDropdownOpen.set(true)"
                       (focus)="projectDropdownOpen.set(true)" class="inp" />
                @if (projectDropdownOpen() && projectOptions().length) {
                  <div class="absolute top-full left-0 right-0 mt-1 max-h-56 overflow-y-auto z-10" style="background:#0f1f16;border:1px solid rgba(240,235,224,0.1);">
                    @for (p of projectOptions(); track p.id) {
                      <button type="button" (click)="toggleProject(p.id); projectQuery.set('')"
                              class="block w-full text-left px-3 py-2 text-sm hover:bg-[#152a1d]" style="color:#F0EBE0;">
                        {{ p.title }}<span style="color:#8a9e90;">{{ p.client ? ' · ' + p.client : '' }}{{ p.year ? ' · ' + p.year : '' }}</span>
                      </button>
                    }
                  </div>
                }
              </div>
            </div>

            <!-- Visibility -->
            <div class="fs flex flex-wrap items-center gap-8">
              <label class="flex items-center gap-2 text-xs tracking-widest uppercase" style="color:#8a9e90;">
                <input type="checkbox" formControlName="published" class="w-4 h-4" /> Published
              </label>
              <label class="flex items-center gap-2 text-xs tracking-widest uppercase" style="color:#8a9e90;">
                Display order <input type="number" formControlName="display_order" class="inp" style="width:5rem;" />
              </label>
            </div>

            <div class="flex flex-wrap gap-3 pt-2">
              <button type="submit" [disabled]="form.invalid || saving() || uploading()" class="px-4 py-2 text-xs uppercase tracking-widest"
                      style="background:#C9A04A;color:#0a150f;" [style.opacity]="form.invalid || saving() || uploading() ? 0.6 : 1">
                {{ saving() ? 'Saving...' : 'Save Partner' }}
              </button>
              <button type="button" (click)="closeForm()" class="px-4 py-2 text-xs uppercase tracking-widest" style="border:1px solid rgba(240,235,224,0.1);color:#8a9e90;">Cancel</button>
              @if (form.invalid && form.touched) {
                <span class="self-center text-xs" style="color:#8a9e90;">Name, specialty, role and cover photo are required.</span>
              }
            </div>
          </form>
        </div>
      }

      <div class="space-y-2">
        @if (partners().length === 0) {
          <p class="text-sm" style="color:#8a9e90;">No partners yet.</p>
        }
        @for (p of partners(); track p.id) {
          <div class="flex items-center justify-between gap-4 p-4" style="background:#0f1f16;border:1px solid rgba(240,235,224,0.07);">
            <div class="flex items-center gap-4 min-w-0">
              @if (p.cover_url) {
                <img [src]="p.cover_url" alt="" class="w-14 h-14 object-cover shrink-0" />
              }
              <div class="min-w-0">
                <p class="text-sm" style="color:#F0EBE0;">{{ p.display_order }}. {{ p.name }}</p>
                <p class="text-xs" style="color:#8a9e90;">
                  {{ p.specialty }} · {{ countFor(p.id) }} project{{ countFor(p.id) === 1 ? '' : 's' }} ·
                  <span [style.color]="p.published ? '#C9A04A' : '#8a9e90'">{{ p.published ? 'Published' : 'Draft' }}</span>
                </p>
              </div>
            </div>
            <div class="flex gap-4 shrink-0">
              <button type="button" (click)="edit(p)" class="text-xs uppercase" style="color:#C9A04A;">Edit</button>
              <button type="button" (click)="delete(p)" class="text-xs uppercase" style="color:#8a9e90;">Delete</button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class PartnersAdminComponent implements OnInit {
  private readonly admin = inject(AdminSupabaseService);
  private readonly fb = inject(FormBuilder);

  partners = signal<Partner[]>([]);
  projects = signal<Project[]>([]);
  projectCounts = signal<Record<string, number>>({});
  editing = signal(false);
  formOpen = signal(false);
  saving = signal(false);
  saved = signal(false);
  uploading = signal(false);
  errorMsg = signal('');

  gallery = signal<string[]>([]);
  selectedProjectIds = signal<string[]>([]);
  private originalProjectIds: string[] = [];
  projectQuery = signal('');
  projectDropdownOpen = signal(false);
  private editId = '';

  selectedProjects = computed(() => {
    const byId = new Map(this.projects().map((p) => [p.id, p]));
    return this.selectedProjectIds().map((id) => byId.get(id)).filter((p): p is Project => !!p);
  });

  projectOptions = computed(() => {
    const q = this.projectQuery().trim().toLowerCase();
    const selected = new Set(this.selectedProjectIds());
    return this.projects()
      .filter((p) => !selected.has(p.id))
      .filter((p) => !q || [p.title, p.client].some((v) => v?.toLowerCase().includes(q)))
      .slice(0, 30);
  });

  form = this.fb.nonNullable.group({
    name:          ['', Validators.required],
    slug:          ['', Validators.required],
    specialty:     ['', Validators.required],
    role_with_us:  ['', Validators.required],
    bio:           [''],
    location:      [''],
    website:       [''],
    cover_url:     ['', Validators.required],
    published:     [true],
    display_order: [0],
  });

  ngOnInit(): void {
    this.load();
    this.admin.list<Project>('projects').subscribe((p) => this.projects.set(p));
    // The URL slug follows the name for new partners; it stays fixed once saved so links don't break.
    this.form.get('name')!.valueChanges.subscribe((name) => {
      if (!this.editing()) this.form.patchValue({ slug: slugify(name) }, { emitEvent: false });
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.projectDropdownOpen() && !(event.target as HTMLElement).closest('.project-combobox')) {
      this.projectDropdownOpen.set(false);
    }
  }

  load(): void {
    this.admin.list<Partner>('partners').subscribe((p) => this.partners.set(p));
    this.admin.countProjectsPerPartner().subscribe((c) => this.projectCounts.set(c));
  }

  openAdd(): void {
    this.reset();
    this.form.patchValue({ display_order: this.partners().length + 1 });
    this.formOpen.set(true);
    this.scrollTop();
  }

  edit(p: Partner): void {
    this.reset();
    this.editing.set(true);
    this.editId = p.id;
    this.form.patchValue({ ...p, bio: p.bio ?? '', location: p.location ?? '', website: p.website ?? '', cover_url: p.cover_url ?? '' });
    this.gallery.set([...(p.gallery_urls ?? [])]);
    this.admin.listProjectIdsForPartner(p.id).subscribe((ids) => {
      this.originalProjectIds = ids;
      this.selectedProjectIds.set(ids);
    });
    this.formOpen.set(true);
    this.scrollTop();
  }

  closeForm(): void {
    this.reset();
    this.formOpen.set(false);
  }

  private reset(): void {
    this.editing.set(false);
    this.editId = '';
    this.errorMsg.set('');
    this.form.reset();
    this.gallery.set([]);
    this.selectedProjectIds.set([]);
    this.originalProjectIds = [];
    this.projectQuery.set('');
  }

  countFor(id: string): number {
    return this.projectCounts()[id] ?? 0;
  }

  toggleProject(id: string): void {
    this.selectedProjectIds.update((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  }

  async onCover(e: Event): Promise<void> {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const [url] = await this.upload([file]);
    if (url) this.form.patchValue({ cover_url: url });
  }

  async onGallery(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    const urls = await this.upload(Array.from(input.files ?? []));
    this.gallery.update((g) => [...g, ...urls]);
    input.value = '';
  }

  moveGallery(i: number, dir: -1 | 1): void {
    this.gallery.update((g) => {
      const next = [...g];
      [next[i], next[i + dir]] = [next[i + dir], next[i]];
      return next;
    });
  }

  removeGallery(i: number): void {
    this.gallery.update((g) => g.filter((_, j) => j !== i));
  }

  private async upload(files: File[]): Promise<string[]> {
    if (!files.length) return [];
    this.uploading.set(true);
    this.errorMsg.set('');
    try {
      return await Promise.all(
        files.map((f) => this.admin.uploadImage('media', `partners/${Date.now()}-${f.name.replace(/[^\w.-]+/g, '-')}`, f))
      );
    } catch (err: unknown) {
      this.errorMsg.set(`Upload failed: ${(err as { message?: string })?.message ?? err}`);
      return [];
    } finally {
      this.uploading.set(false);
    }
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);
    this.errorMsg.set('');

    const raw = this.form.getRawValue();
    const data = {
      ...Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, typeof v === 'string' ? v.trim() || null : v])),
      gallery_urls: this.gallery(),
    } as Partial<Partner>;

    const selected = this.selectedProjectIds();
    const original = this.originalProjectIds;

    (this.editing() ? this.admin.update<Partner>('partners', this.editId, data) : this.admin.create<Partner>('partners', data))
      .pipe(
        switchMap((partner) => {
          const ops = [
            ...selected.filter((id) => !original.includes(id)).map((id) => this.admin.linkProjectPartner(id, partner.id)),
            ...original.filter((id) => !selected.includes(id)).map((id) => this.admin.unlinkProjectPartner(id, partner.id)),
          ];
          return ops.length ? forkJoin(ops).pipe(map(() => partner)) : of(partner);
        })
      )
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.saved.set(true);
          this.closeForm();
          this.load();
          setTimeout(() => this.saved.set(false), 2000);
        },
        error: (err: unknown) => {
          this.saving.set(false);
          const msg = (err as { message?: string })?.message ?? String(err);
          this.errorMsg.set(msg.includes('partners_slug_key') ? 'A partner with this name already exists.' : `Save failed: ${msg}`);
        },
      });
  }

  delete(p: Partner): void {
    if (!confirm(`Delete ${p.name}? Their links to projects are removed too.`)) return;
    this.admin.delete('partners', p.id).subscribe(() => this.load());
  }

  private scrollTop(): void {
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  }
}
