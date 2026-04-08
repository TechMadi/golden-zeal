import { Component, OnInit, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminSupabaseService } from '../../services/admin-supabase.service';
import type { RegionalRep } from 'shared';

@Component({
  selector: 'app-reps-admin',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="p-6 md:p-10 max-w-4xl">
      <h1 class="text-3xl mb-8" style="font-family:'Bebas Neue',sans-serif;color:#F0EBE0;">REGIONAL REPS</h1>
      <div class="mb-10 space-y-2">
        @for (r of reps(); track r.id) {
          <div class="flex items-center justify-between p-4" style="background:#141414;border:1px solid rgba(240,235,224,0.07);">
            <div>
              <p class="text-sm" style="color:#F0EBE0;">{{ r.name }}</p>
              <p class="text-xs" style="color:#888880;">{{ r.region }} · {{ r.email }}</p>
            </div>
            <div class="flex gap-4">
              <button type="button" (click)="edit(r)" class="text-xs uppercase" style="color:#C9A04A;">Edit</button>
              <button type="button" (click)="delete(r.id)" class="text-xs uppercase" style="color:#888880;">Delete</button>
            </div>
          </div>
        }
      </div>
      <div style="border-top:1px solid rgba(240,235,224,0.07);" class="pt-8">
        <h2 class="text-xl mb-6" style="font-family:'Bebas Neue',sans-serif;color:#F0EBE0;">
          {{ editing() ? 'EDIT' : 'ADD' }} REP
        </h2>
        @if (saved()) {
          <div class="p-3 mb-4 text-xs" style="background:rgba(201,160,74,0.1);border:1px solid #C9A04A;color:#C9A04A;">Saved.</div>
        }
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4 max-w-lg">
          @for (f of fields; track f.name) {
            <div>
              <label [for]="f.name" class="block text-xs tracking-widest uppercase mb-1" style="color:#888880;">{{ f.label }}</label>
              <input [id]="f.name" [type]="f.type" [formControlName]="f.name"
                     class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                     style="color:#F0EBE0;border:1px solid rgba(240,235,224,0.1);" />
            </div>
          }
          <div class="flex gap-3 pt-2">
            <button type="submit" [disabled]="saving()" class="px-4 py-2 text-xs uppercase tracking-widest" style="background:#C9A04A;color:#0f0f0f;">
              {{ saving() ? 'Saving...' : 'Save' }}
            </button>
            @if (editing()) {
              <button type="button" (click)="reset()" class="px-4 py-2 text-xs uppercase tracking-widest" style="border:1px solid rgba(240,235,224,0.1);color:#888880;">Cancel</button>
            }
          </div>
        </form>
      </div>
    </div>
  `,
})
export class RepsAdminComponent implements OnInit {
  private readonly admin = inject(AdminSupabaseService);
  private readonly fb = inject(FormBuilder);
  reps = signal<RegionalRep[]>([]); editing = signal(false); saving = signal(false); saved = signal(false);
  private editId = '';
  readonly fields = [
    { name: 'name',          label: 'Name *',       type: 'text'   },
    { name: 'region',        label: 'Region *',     type: 'text'   },
    { name: 'phone',         label: 'Phone',        type: 'tel'    },
    { name: 'email',         label: 'Email',        type: 'email'  },
    { name: 'display_order', label: 'Display Order',type: 'number' },
  ];
  form = this.fb.nonNullable.group({ name:['',Validators.required], region:['',Validators.required], phone:[''], email:[''], display_order:[0] });
  ngOnInit(): void { this.load(); }
  load(): void { this.admin.list<RegionalRep>('regional_reps').subscribe((r) => this.reps.set(r)); }
  edit(r: RegionalRep): void { this.editing.set(true); this.editId = r.id; this.form.patchValue(r as never); }
  reset(): void { this.editing.set(false); this.editId = ''; this.form.reset(); }
  delete(id: string): void { if (!confirm('Delete?')) return; this.admin.delete('regional_reps', id).subscribe(() => this.load()); }
  onSubmit(): void { if (this.form.invalid||this.saving()) return; this.saving.set(true); const data=this.form.getRawValue(); (this.editing() ? this.admin.update('regional_reps',this.editId,data) : this.admin.create('regional_reps',data)).subscribe({ next:()=>{this.saving.set(false);this.saved.set(true);this.reset();this.load();setTimeout(()=>this.saved.set(false),2000);}, error:()=>this.saving.set(false) }); }
}
