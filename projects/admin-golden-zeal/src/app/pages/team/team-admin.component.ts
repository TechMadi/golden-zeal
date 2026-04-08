import { Component, OnInit, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminSupabaseService } from '../../services/admin-supabase.service';
import type { TeamMember } from 'shared';

@Component({
  selector: 'app-team-admin',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="p-6 md:p-10 max-w-4xl">
      <h1 class="text-3xl mb-8" style="font-family:'Bebas Neue',sans-serif;color:#F0EBE0;">TEAM MEMBERS</h1>
      <div class="mb-10 space-y-2">
        @for (m of team(); track m.id) {
          <div class="flex items-center justify-between p-4" style="background:#141414;border:1px solid rgba(240,235,224,0.07);">
            <div>
              <p class="text-sm" style="color:#F0EBE0;">{{ m.name }}</p>
              <p class="text-xs" style="color:#888880;">{{ m.role }} · {{ m.is_core ? 'Core' : 'Extended' }}</p>
            </div>
            <div class="flex gap-4">
              <button type="button" (click)="edit(m)" class="text-xs uppercase" style="color:#C9A04A;">Edit</button>
              <button type="button" (click)="delete(m.id)" class="text-xs uppercase" style="color:#888880;">Delete</button>
            </div>
          </div>
        }
      </div>
      <div style="border-top:1px solid rgba(240,235,224,0.07);" class="pt-8">
        <h2 class="text-xl mb-6" style="font-family:'Bebas Neue',sans-serif;color:#F0EBE0;">
          {{ editing() ? 'EDIT' : 'ADD' }} MEMBER
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
          <div class="flex items-center gap-3">
            <input id="is_core" type="checkbox" formControlName="is_core" class="w-4 h-4" />
            <label for="is_core" class="text-xs tracking-widest uppercase" style="color:#888880;">Core Team Member</label>
          </div>
          <div>
            <label class="block text-xs tracking-widest uppercase mb-1" style="color:#888880;">Photo</label>
            <input type="file" accept="image/*" (change)="onFile($event)" class="text-xs" style="color:#888880;" />
            @if (form.get('photo_url')?.value) {
              <img [src]="form.get('photo_url')?.value" class="mt-2 h-20 w-20 object-cover rounded" />
            }
          </div>
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
export class TeamAdminComponent implements OnInit {
  private readonly admin = inject(AdminSupabaseService);
  private readonly fb = inject(FormBuilder);
  team = signal<TeamMember[]>([]); editing = signal(false); saving = signal(false); saved = signal(false);
  private editId = '';
  readonly fields = [
    { name: 'name',          label: 'Name *',       type: 'text'   },
    { name: 'role',          label: 'Role *',       type: 'text'   },
    { name: 'location',      label: 'Location',     type: 'text'   },
    { name: 'email',         label: 'Email',        type: 'email'  },
    { name: 'photo_url',     label: 'Photo URL',    type: 'text'   },
    { name: 'display_order', label: 'Display Order',type: 'number' },
  ];
  form = this.fb.nonNullable.group({ name:['',Validators.required], role:['',Validators.required], location:[''], email:[''], photo_url:[''], is_core:[true], display_order:[0] });
  ngOnInit(): void { this.load(); }
  load(): void { this.admin.list<TeamMember>('team_members').subscribe((t) => this.team.set(t)); }
  edit(m: TeamMember): void { this.editing.set(true); this.editId = m.id; this.form.patchValue(m as never); }
  reset(): void { this.editing.set(false); this.editId = ''; this.form.reset(); this.form.patchValue({ is_core: true }); }
  delete(id: string): void { if (!confirm('Delete?')) return; this.admin.delete('team_members', id).subscribe(() => this.load()); }
  async onFile(e: Event): Promise<void> { const f = (e.target as HTMLInputElement).files?.[0]; if (!f) return; const url = await this.admin.uploadImage('media', `team/${Date.now()}-${f.name}`, f); this.form.patchValue({ photo_url: url }); }
  onSubmit(): void { if (this.form.invalid||this.saving()) return; this.saving.set(true); const data=this.form.getRawValue(); (this.editing() ? this.admin.update('team_members',this.editId,data) : this.admin.create('team_members',data)).subscribe({ next:()=>{this.saving.set(false);this.saved.set(true);this.reset();this.load();setTimeout(()=>this.saved.set(false),2000);}, error:()=>this.saving.set(false) }); }
}
