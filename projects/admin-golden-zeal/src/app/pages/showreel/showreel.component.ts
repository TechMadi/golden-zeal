import { Component, OnInit, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AdminSupabaseService } from '../../services/admin-supabase.service';
import type { Showreel } from 'shared';

@Component({
  selector: 'app-showreel-admin',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="p-6 md:p-10 max-w-4xl">

      <!-- Header -->
      <div class="flex items-end justify-between mb-2">
        <h1 class="text-3xl" style="font-family:'Bebas Neue',sans-serif;color:#F0EBE0;">SHOWREELS</h1>
        <span class="text-xs tracking-widest uppercase px-2 py-1"
              style="background:rgba(201,160,74,0.12);color:#C9A04A;">
          {{ reels().length }} reel{{ reels().length !== 1 ? 's' : '' }}
        </span>
      </div>
      <p class="text-xs mb-8" style="color:#555550;">
        Active reels cycle every 5 s on the home page hero. YouTube ID takes priority over Vimeo if both are set.
      </p>

      <!-- Banners -->
      @if (loadError()) {
        <div class="p-3 mb-6 text-xs" style="background:rgba(220,50,50,0.1);border:1px solid #dc3232;color:#ff6b6b;">
          ⚠ Could not load reels — the DB migration may not have been applied yet.<br/>
          <span style="color:#888880;">{{ loadError() }}</span>
        </div>
      }
      @if (saved()) {
        <div class="p-3 mb-4 text-xs" style="background:rgba(201,160,74,0.1);border:1px solid #C9A04A;color:#C9A04A;">Saved.</div>
      }
      @if (errorMsg()) {
        <div class="p-3 mb-4 text-xs" style="background:rgba(220,50,50,0.1);border:1px solid #dc3232;color:#ff6b6b;">{{ errorMsg() }}</div>
      }

      <!-- ── Reels table ── -->
      <div class="mb-10" style="border:1px solid rgba(240,235,224,0.08);">

        <!-- Table header -->
        <div class="grid gap-3 px-4 py-2 text-[10px] uppercase tracking-widest"
             style="grid-template-columns:2fr 1fr 1fr 1fr auto;background:#0d0d0d;color:#555550;border-bottom:1px solid rgba(240,235,224,0.06);">
          <span>Title</span>
          <span>Client</span>
          <span>Source</span>
          <span>Status</span>
          <span></span>
        </div>

        @if (loading()) {
          @for (i of [1,2,3]; track i) {
            <div class="px-4 py-4 flex gap-3" style="border-bottom:1px solid rgba(240,235,224,0.05);">
              <div class="h-3 rounded flex-1" style="background:#1a1a1a;"></div>
              <div class="h-3 rounded w-24" style="background:#1a1a1a;"></div>
              <div class="h-3 rounded w-20" style="background:#1a1a1a;"></div>
            </div>
          }
        } @else if (reels().length === 0) {
          <div class="px-4 py-12 text-center">
            <p class="text-sm mb-1" style="color:#555550;">No showreels yet</p>
            <p class="text-xs" style="color:#3a3a3a;">Use the form below to add your first one.</p>
          </div>
        } @else {
          @for (reel of reels(); track reel.id) {
            <div class="grid gap-3 px-4 py-4 items-center transition-colors"
                 [style.background]="editingId() === reel.id ? 'rgba(201,160,74,0.05)' : 'transparent'"
                 style="grid-template-columns:2fr 1fr 1fr 1fr auto;border-bottom:1px solid rgba(240,235,224,0.05);">

              <!-- Title + thumbnail preview -->
              <div class="flex items-center gap-3 min-w-0">
                @if (reel.thumbnail_url || reel.youtube_id) {
                  <img
                    [src]="thumbSrc(reel)"
                    class="w-14 h-9 object-cover shrink-0"
                    style="background:#1a1a1a;"
                    loading="lazy"
                  />
                } @else {
                  <div class="w-14 h-9 shrink-0 flex items-center justify-center" style="background:#1a1a1a;">
                    <span style="color:#333;font-size:10px;">—</span>
                  </div>
                }
                <p class="text-sm truncate" style="color:#F0EBE0;">{{ reel.title ?? 'Untitled' }}</p>
              </div>

              <!-- Client -->
              <p class="text-xs truncate" style="color:#888880;">{{ reel.client ?? '—' }}</p>

              <!-- Source ID -->
              @if (reel.youtube_id) {
                <p class="text-xs" style="color:#555550;">YT · {{ reel.youtube_id }}</p>
              } @else if (reel.vimeo_id) {
                <p class="text-xs" style="color:#555550;">Vi · {{ reel.vimeo_id }}</p>
              } @else {
                <p class="text-xs" style="color:#333;">—</p>
              }

              <!-- Status badge -->
              <span class="text-[10px] px-2 py-0.5 uppercase tracking-widest w-fit"
                    [style.background]="reel.is_active ? 'rgba(201,160,74,0.15)' : 'rgba(255,255,255,0.04)'"
                    [style.color]="reel.is_active ? '#C9A04A' : '#444440'">
                {{ reel.is_active ? 'Active' : 'Hidden' }}
              </span>

              <!-- Actions -->
              <div class="flex gap-2 shrink-0">
                <button (click)="startEdit(reel)" title="Edit"
                        class="text-[11px] px-2 py-1 uppercase tracking-widest transition-colors"
                        [style.background]="editingId() === reel.id ? 'rgba(201,160,74,0.2)' : 'transparent'"
                        style="border:1px solid rgba(240,235,224,0.12);color:#F0EBE0;">
                  Edit
                </button>
                <button (click)="toggleActive(reel)" title="Toggle visibility"
                        class="text-[11px] px-2 py-1 uppercase tracking-widest"
                        style="border:1px solid rgba(240,235,224,0.08);color:#666660;">
                  {{ reel.is_active ? 'Hide' : 'Show' }}
                </button>
                <button (click)="deleteReel(reel)" title="Delete"
                        class="text-[11px] px-2 py-1 uppercase tracking-widest"
                        style="border:1px solid rgba(220,50,50,0.25);color:#aa3333;">
                  ✕
                </button>
              </div>
            </div>
          }
        }
      </div>

      <!-- ── Add / Edit form ── -->
      <div class="p-6" style="background:#111;border:1px solid rgba(240,235,224,0.08);">
        <div class="flex items-center justify-between mb-5">
          <p class="text-xs tracking-widest uppercase" style="color:#C9A04A;">
            {{ editingId() ? 'Editing Showreel' : 'Add New Showreel' }}
          </p>
          @if (editingId()) {
            <button type="button" (click)="cancelEdit()"
                    class="text-[11px] px-3 py-1 uppercase tracking-widest"
                    style="border:1px solid rgba(240,235,224,0.1);color:#666660;">
              Cancel
            </button>
          }
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] tracking-widest uppercase mb-1" style="color:#666660;">YouTube ID</label>
              <input type="text" formControlName="youtube_id" placeholder="e.g. dQw4w9WgXcQ"
                     class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                     style="color:#F0EBE0;border:1px solid rgba(240,235,224,0.1);" />
            </div>
            <div>
              <label class="block text-[10px] tracking-widest uppercase mb-1" style="color:#666660;">Vimeo ID</label>
              <input type="text" formControlName="vimeo_id" placeholder="e.g. 123456789"
                     class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                     style="color:#F0EBE0;border:1px solid rgba(240,235,224,0.1);" />
            </div>
          </div>

          <div>
            <label class="block text-[10px] tracking-widest uppercase mb-1" style="color:#666660;">Title</label>
            <input type="text" formControlName="title" placeholder="e.g. Commercial Reel 2024"
                   class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                   style="color:#F0EBE0;border:1px solid rgba(240,235,224,0.1);" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] tracking-widest uppercase mb-1" style="color:#666660;">Client / Brand</label>
              <input type="text" formControlName="client"
                     class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                     style="color:#F0EBE0;border:1px solid rgba(240,235,224,0.1);" />
            </div>
            <div>
              <label class="block text-[10px] tracking-widest uppercase mb-1" style="color:#666660;">Director</label>
              <input type="text" formControlName="director"
                     class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                     style="color:#F0EBE0;border:1px solid rgba(240,235,224,0.1);" />
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div class="col-span-2">
              <label class="block text-[10px] tracking-widest uppercase mb-1" style="color:#666660;">Thumbnail URL (optional — YouTube auto-generates one)</label>
              <input type="text" formControlName="thumbnail_url"
                     class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                     style="color:#F0EBE0;border:1px solid rgba(240,235,224,0.1);" />
            </div>
            <div>
              <label class="block text-[10px] tracking-widest uppercase mb-1" style="color:#666660;">Sort Order</label>
              <input type="number" formControlName="sort_order"
                     class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                     style="color:#F0EBE0;border:1px solid rgba(240,235,224,0.1);" />
            </div>
          </div>

          <div class="pt-2">
            <button type="submit" [disabled]="saving()"
                    class="px-8 py-2 text-xs uppercase tracking-widest"
                    style="background:#C9A04A;color:#0f0f0f;">
              {{ saving() ? 'Saving…' : (editingId() ? 'Update Showreel' : 'Add Showreel') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class ShowreelAdminComponent implements OnInit {
  private readonly admin = inject(AdminSupabaseService);
  private readonly fb = inject(FormBuilder);

  reels     = signal<Showreel[]>([]);
  loading   = signal(true);
  saving    = signal(false);
  saved     = signal(false);
  errorMsg  = signal('');
  loadError = signal('');
  editingId = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    vimeo_id:      [''],
    youtube_id:    [''],
    title:         [''],
    client:        [''],
    director:      [''],
    thumbnail_url: [''],
    sort_order:    [0],
    is_active:     [true],
  });

  thumbSrc(reel: Showreel): string {
    if (reel.thumbnail_url) return reel.thumbnail_url;
    if (reel.youtube_id) return `https://img.youtube.com/vi/${reel.youtube_id}/mqdefault.jpg`;
    return '';
  }

  ngOnInit(): void {
    this.loadReels();
  }

  private loadReels(): void {
    this.loading.set(true);
    this.loadError.set('');
    // Use created_at ordering as safe fallback — sort_order may not exist before migration
    this.admin.list<Showreel>('showreel', 'created_at').subscribe({
      next: (rows) => {
        this.reels.set(rows);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        const msg = (err instanceof Error ? err.message : (err as { message?: string })?.message) ?? String(err);
        this.loadError.set(msg);
        this.loading.set(false);
      },
    });
  }

  startEdit(reel: Showreel): void {
    this.editingId.set(reel.id);
    this.form.patchValue({
      vimeo_id:      reel.vimeo_id      ?? '',
      youtube_id:    reel.youtube_id    ?? '',
      title:         reel.title         ?? '',
      client:        (reel as any).client        ?? '',
      director:      (reel as any).director      ?? '',
      thumbnail_url: reel.thumbnail_url ?? '',
      sort_order:    (reel as any).sort_order    ?? 0,
      is_active:     (reel as any).is_active     ?? true,
    });
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 50);
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form.reset({ sort_order: 0, is_active: true });
  }

  toggleActive(reel: Showreel): void {
    this.admin.update<Showreel>('showreel', reel.id, { is_active: !(reel as any).is_active } as any).subscribe({
      next: () => this.loadReels(),
      error: (err: unknown) => this.showError(err),
    });
  }

  deleteReel(reel: Showreel): void {
    if (!confirm(`Delete "${reel.title ?? 'this reel'}"?`)) return;
    this.admin.delete('showreel', reel.id).subscribe({
      next: () => {
        if (this.editingId() === reel.id) this.cancelEdit();
        this.loadReels();
      },
      error: (err: unknown) => this.showError(err),
    });
  }

  onSubmit(): void {
    if (this.saving()) return;
    this.saving.set(true);
    this.errorMsg.set('');

    const raw = this.form.getRawValue();
    const data = Object.fromEntries(
      Object.entries(raw).map(([k, v]) => [k, v === '' ? null : v])
    );

    const id = this.editingId();
    const obs = id
      ? this.admin.update<Showreel>('showreel', id, data as any)
      : this.admin.create<Showreel>('showreel', data as any);

    obs.subscribe({
      next: () => {
        this.saving.set(false);
        this.saved.set(true);
        this.editingId.set(null);
        this.form.reset({ sort_order: 0, is_active: true });
        this.loadReels();
        setTimeout(() => this.saved.set(false), 2500);
      },
      error: (err: unknown) => {
        this.saving.set(false);
        this.showError(err);
      },
    });
  }

  private showError(err: unknown): void {
    const msg = (err instanceof Error ? err.message : (err as { message?: string })?.message) ?? JSON.stringify(err);
    this.errorMsg.set(`Error: ${msg}`);
  }
}
