import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminSupabaseService } from '../../services/admin-supabase.service';
import type { Photographer } from 'shared';

@Component({
  selector: 'app-photographers-admin',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="p-6 md:p-10 max-w-4xl">
      <h1 class="text-3xl mb-6" style="font-family:'Bebas Neue',sans-serif;color:#F0EBE0;">PHOTOGRAPHERS</h1>

      <div class="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text" placeholder="Search by name, specialty or location..."
          [value]="search()" (input)="search.set($any($event.target).value)"
          class="w-full sm:max-w-sm bg-transparent py-2 px-3 text-sm focus:outline-none"
          style="color:#F0EBE0;border:1px solid rgba(240,235,224,0.1);"
        />
        @if (!formOpen()) {
          <button type="button" (click)="openAdd()" class="shrink-0 px-4 py-2 text-xs uppercase tracking-widest" style="background:#C9A04A;color:#0a150f;">
            + Add Photographer
          </button>
        }
      </div>

      @if (formOpen()) {
        <div class="mb-10 pb-8" style="border-bottom:1px solid rgba(240,235,224,0.07);">
          <h2 class="text-xl mb-6" style="font-family:'Bebas Neue',sans-serif;color:#F0EBE0;">
            {{ editing() ? 'EDIT' : 'ADD' }} PHOTOGRAPHER
          </h2>
          @if (saved()) {
            <div class="p-3 mb-4 text-xs" style="background:rgba(201,160,74,0.1);border:1px solid #C9A04A;color:#C9A04A;">Saved.</div>
          }
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4 max-w-lg">
            @for (f of fields; track f.name) {
              <div>
                <label [for]="f.name" class="block text-xs tracking-widest uppercase mb-1" style="color:#8a9e90;">{{ f.label }}</label>
                @if (f.type === 'textarea') {
                  <textarea [id]="f.name" [formControlName]="f.name" rows="3"
                            class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none resize-none"
                            style="color:#F0EBE0;border:1px solid rgba(240,235,224,0.1);"></textarea>
                } @else {
                  <input [id]="f.name" [type]="f.type" [formControlName]="f.name"
                         class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                         style="color:#F0EBE0;border:1px solid rgba(240,235,224,0.1);" />
                }
              </div>
            }
            <div>
              <label class="block text-xs tracking-widest uppercase mb-1" style="color:#8a9e90;">Hero Photo</label>
              <input type="file" accept="image/*" (change)="onFile($event)" class="text-xs" style="color:#8a9e90;" />
              @if (form.get('hero_image_url')?.value) {
                <img [src]="form.get('hero_image_url')?.value" class="mt-2 h-20 object-cover" />
              }
            </div>
            <div class="flex flex-wrap gap-3 pt-2">
              <button type="submit" [disabled]="saving()" class="px-4 py-2 text-xs uppercase tracking-widest" style="background:#C9A04A;color:#0a150f;">
                {{ saving() ? 'Saving...' : 'Save' }}
              </button>
              <button type="button" (click)="closeForm()" class="px-4 py-2 text-xs uppercase tracking-widest" style="border:1px solid rgba(240,235,224,0.1);color:#8a9e90;">Cancel</button>
            </div>
          </form>
        </div>
      }

      <div class="space-y-2">
        @if (filtered().length === 0) {
          <p class="text-sm" style="color:#8a9e90;">No matches.</p>
        }
        @for (p of filtered(); track p.id) {
          <div class="flex items-center justify-between p-4" style="background:#0f1f16;border:1px solid rgba(240,235,224,0.07);">
            <div>
              <p class="text-sm" style="color:#F0EBE0;">{{ p.name }}</p>
              <p class="text-xs" style="color:#8a9e90;">{{ p.specialty }} · {{ p.location }}</p>
            </div>
            <div class="flex gap-4">
              <button type="button" (click)="edit(p)" class="text-xs uppercase" style="color:#C9A04A;">Edit</button>
              <button type="button" (click)="delete(p.id)" class="text-xs uppercase" style="color:#8a9e90;">Delete</button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class PhotographersAdminComponent implements OnInit {
  private readonly admin = inject(AdminSupabaseService);
  private readonly fb = inject(FormBuilder);
  photographers = signal<Photographer[]>([]);
  editing = signal(false); saving = signal(false); saved = signal(false);
  formOpen = signal(false);
  search = signal('');
  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.photographers();
    return this.photographers().filter((p) =>
      [p.name, p.specialty, p.location].some((v) => v?.toLowerCase().includes(q))
    );
  });
  private editId = '';
  readonly fields = [
    { name: 'name',           label: 'Name *',         type: 'text'     },
    { name: 'slug',           label: 'Slug *',         type: 'text'     },
    { name: 'specialty',      label: 'Specialty',      type: 'text'     },
    { name: 'location',       label: 'Location',       type: 'text'     },
    { name: 'bio',            label: 'Bio',            type: 'textarea' },
    { name: 'hero_image_url', label: 'Hero Image URL', type: 'text'     },
    { name: 'display_order',  label: 'Display Order',  type: 'number'   },
  ];
  form = this.fb.nonNullable.group({ name:['',Validators.required], slug:['',Validators.required], specialty:[''], location:[''], bio:[''], hero_image_url:[''], display_order:[0] });
  ngOnInit(): void { this.load(); }
  load(): void { this.admin.list<Photographer>('photographers').subscribe((p) => this.photographers.set(p)); }
  openAdd(): void { this.reset(); this.formOpen.set(true); this.scrollTop(); }
  edit(p: Photographer): void { this.editing.set(true); this.editId = p.id; this.form.patchValue(p as never); this.formOpen.set(true); this.scrollTop(); }
  reset(): void { this.editing.set(false); this.editId = ''; this.form.reset(); }
  closeForm(): void { this.reset(); this.formOpen.set(false); }
  delete(id: string): void { if (!confirm('Delete?')) return; this.admin.delete('photographers', id).subscribe(() => this.load()); }
  async onFile(e: Event): Promise<void> { const f = (e.target as HTMLInputElement).files?.[0]; if (!f) return; const url = await this.admin.uploadImage('media', `heroes/${Date.now()}-${f.name}`, f); this.form.patchValue({ hero_image_url: url }); }
  onSubmit(): void { if (this.form.invalid||this.saving()) return; this.saving.set(true); const data=this.form.getRawValue(); (this.editing() ? this.admin.update('photographers',this.editId,data) : this.admin.create('photographers',data)).subscribe({ next:()=>{this.saving.set(false);this.saved.set(true);this.closeForm();this.load();setTimeout(()=>this.saved.set(false),2000);}, error:()=>this.saving.set(false) }); }
  private scrollTop(): void { setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0); }
}
