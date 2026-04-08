import { Component, OnInit, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminSupabaseService } from '../../services/admin-supabase.service';
import type { FaqItem } from 'shared';

@Component({
  selector: 'app-faq-admin',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="p-6 md:p-10 max-w-4xl">
      <h1 class="text-3xl mb-8" style="font-family:'Bebas Neue',sans-serif;color:#F0EBE0;">FAQ</h1>
      <div class="mb-10 space-y-2">
        @for (item of faq(); track item.id) {
          <div class="p-4" style="background:#141414;border:1px solid rgba(240,235,224,0.07);">
            <div class="flex items-start justify-between gap-4">
              <p class="text-sm" style="color:#F0EBE0;">{{ item.question }}</p>
              <div class="flex gap-4 shrink-0">
                <button type="button" (click)="edit(item)" class="text-xs uppercase" style="color:#C9A04A;">Edit</button>
                <button type="button" (click)="delete(item.id)" class="text-xs uppercase" style="color:#888880;">Delete</button>
              </div>
            </div>
            <p class="text-xs mt-2 leading-relaxed" style="color:#888880;">{{ item.answer }}</p>
          </div>
        }
      </div>
      <div style="border-top:1px solid rgba(240,235,224,0.07);" class="pt-8">
        <h2 class="text-xl mb-6" style="font-family:'Bebas Neue',sans-serif;color:#F0EBE0;">
          {{ editing() ? 'EDIT' : 'ADD' }} FAQ ITEM
        </h2>
        @if (saved()) {
          <div class="p-3 mb-4 text-xs" style="background:rgba(201,160,74,0.1);border:1px solid #C9A04A;color:#C9A04A;">Saved.</div>
        }
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4 max-w-lg">
          <div>
            <label for="question" class="block text-xs tracking-widest uppercase mb-1" style="color:#888880;">Question *</label>
            <input id="question" type="text" formControlName="question"
                   class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                   style="color:#F0EBE0;border:1px solid rgba(240,235,224,0.1);" />
          </div>
          <div>
            <label for="answer" class="block text-xs tracking-widest uppercase mb-1" style="color:#888880;">Answer *</label>
            <textarea id="answer" formControlName="answer" rows="4"
                      class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none resize-none"
                      style="color:#F0EBE0;border:1px solid rgba(240,235,224,0.1);"></textarea>
          </div>
          <div>
            <label for="display_order" class="block text-xs tracking-widest uppercase mb-1" style="color:#888880;">Display Order</label>
            <input id="display_order" type="number" formControlName="display_order"
                   class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                   style="color:#F0EBE0;border:1px solid rgba(240,235,224,0.1);" />
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
export class FaqAdminComponent implements OnInit {
  private readonly admin = inject(AdminSupabaseService);
  private readonly fb = inject(FormBuilder);
  faq = signal<FaqItem[]>([]); editing = signal(false); saving = signal(false); saved = signal(false);
  private editId = '';
  form = this.fb.nonNullable.group({ question:['',Validators.required], answer:['',Validators.required], display_order:[0] });
  ngOnInit(): void { this.load(); }
  load(): void { this.admin.list<FaqItem>('faq').subscribe((f) => this.faq.set(f)); }
  edit(item: FaqItem): void { this.editing.set(true); this.editId = item.id; this.form.patchValue(item); }
  reset(): void { this.editing.set(false); this.editId = ''; this.form.reset(); }
  delete(id: string): void { if (!confirm('Delete?')) return; this.admin.delete('faq', id).subscribe(() => this.load()); }
  onSubmit(): void { if (this.form.invalid||this.saving()) return; this.saving.set(true); const data=this.form.getRawValue(); (this.editing() ? this.admin.update('faq',this.editId,data) : this.admin.create('faq',data)).subscribe({ next:()=>{this.saving.set(false);this.saved.set(true);this.reset();this.load();setTimeout(()=>this.saved.set(false),2000);}, error:()=>this.saving.set(false) }); }
}
