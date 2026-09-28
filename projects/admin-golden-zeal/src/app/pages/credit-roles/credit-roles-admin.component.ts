import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminSupabaseService } from '../../services/admin-supabase.service';
import type { CreditRole } from 'shared';

@Component({
  selector: 'app-credit-roles-admin',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="p-6 md:p-10 max-w-4xl">
      <h1 class="text-3xl mb-2" style="font-family:'Bebas Neue',sans-serif;color:#F0EBE0;">CREDIT ROLES</h1>
      <p class="text-xs mb-6" style="color:#8a9e90;">Roles offered when adding crew credits to a project.</p>

      <div class="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text" placeholder="Search roles..."
          [value]="search()" (input)="search.set($any($event.target).value)"
          class="w-full sm:max-w-sm bg-transparent py-2 px-3 text-sm focus:outline-none"
          style="color:#F0EBE0;border:1px solid rgba(240,235,224,0.1);"
        />
        @if (!formOpen()) {
          <button type="button" (click)="openAdd()" class="shrink-0 px-4 py-2 text-xs uppercase tracking-widest" style="background:#C9A04A;color:#0a150f;">
            + Add Role
          </button>
        }
      </div>

      @if (errorMsg()) {
        <div class="p-3 mb-6 text-xs" style="background:rgba(220,50,50,0.1);border:1px solid #dc3232;color:#ff6b6b;">{{ errorMsg() }}</div>
      }

      @if (formOpen()) {
        <div class="mb-10 pb-8" style="border-bottom:1px solid rgba(240,235,224,0.07);">
          <h2 class="text-xl mb-6" style="font-family:'Bebas Neue',sans-serif;color:#F0EBE0;">
            {{ editing() ? 'EDIT' : 'ADD' }} ROLE
          </h2>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4 max-w-lg">
            <div>
              <label for="name" class="block text-xs tracking-widest uppercase mb-1" style="color:#8a9e90;">Name *</label>
              <input id="name" type="text" formControlName="name" placeholder="e.g. Gaffer"
                     class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                     style="color:#F0EBE0;border:1px solid rgba(240,235,224,0.1);" />
              @if (editing()) {
                <p class="mt-1 text-xs" style="color:#555;">Renaming also updates existing credits that use this role.</p>
              }
            </div>
            <div>
              <label for="display_order" class="block text-xs tracking-widest uppercase mb-1" style="color:#8a9e90;">Display Order</label>
              <input id="display_order" type="number" formControlName="display_order"
                     class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                     style="color:#F0EBE0;border:1px solid rgba(240,235,224,0.1);" />
            </div>
            <div class="flex flex-wrap gap-3 pt-2">
              <button type="submit" [disabled]="form.invalid || saving()" class="px-4 py-2 text-xs uppercase tracking-widest" style="background:#C9A04A;color:#0a150f;">
                {{ saving() ? 'Saving...' : 'Save' }}
              </button>
              <button type="button" (click)="closeForm()" class="px-4 py-2 text-xs uppercase tracking-widest" style="border:1px solid rgba(240,235,224,0.1);color:#8a9e90;">Cancel</button>
            </div>
          </form>
        </div>
      }

      <div class="space-y-2">
        @if (filtered().length === 0) {
          <p class="text-sm" style="color:#8a9e90;">No roles yet.</p>
        }
        @for (r of filtered(); track r.id) {
          <div class="flex items-center justify-between p-4" style="background:#0f1f16;border:1px solid rgba(240,235,224,0.07);">
            <div>
              <p class="text-sm" style="color:#F0EBE0;">{{ r.name }}</p>
              <p class="text-xs" style="color:#8a9e90;">Order {{ r.display_order }}</p>
            </div>
            <div class="flex gap-4">
              <button type="button" (click)="edit(r)" class="text-xs uppercase" style="color:#C9A04A;">Edit</button>
              <button type="button" (click)="delete(r)" class="text-xs uppercase" style="color:#8a9e90;">Delete</button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class CreditRolesAdminComponent implements OnInit {
  private readonly admin = inject(AdminSupabaseService);
  private readonly fb = inject(FormBuilder);

  roles = signal<CreditRole[]>([]);
  editing = signal<CreditRole | null>(null);
  saving = signal(false);
  formOpen = signal(false);
  errorMsg = signal('');
  search = signal('');

  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.roles();
    return this.roles().filter((r) => r.name.toLowerCase().includes(q));
  });

  form = this.fb.nonNullable.group({ name: ['', Validators.required], display_order: [0] });

  ngOnInit(): void { this.load(); }

  load(): void {
    this.admin.list<CreditRole>('credit_roles').subscribe((r) => this.roles.set(r));
  }

  openAdd(): void {
    this.reset();
    const next = Math.max(0, ...this.roles().map((r) => r.display_order)) + 1;
    this.form.patchValue({ display_order: next });
    this.formOpen.set(true);
  }

  edit(r: CreditRole): void {
    this.editing.set(r);
    this.form.reset({ name: r.name, display_order: r.display_order });
    this.formOpen.set(true);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  }

  reset(): void {
    this.editing.set(null);
    this.errorMsg.set('');
    this.form.reset({ name: '', display_order: 0 });
  }

  closeForm(): void { this.reset(); this.formOpen.set(false); }

  delete(r: CreditRole): void {
    if (!confirm(`Delete "${r.name}"? Existing credits keep this role text.`)) return;
    this.admin.delete('credit_roles', r.id).subscribe(() => this.load());
  }

  onSubmit(): void {
    if (this.form.invalid || this.saving()) return;
    const name = this.form.getRawValue().name.trim();
    const display_order = this.form.getRawValue().display_order;
    const current = this.editing();

    const duplicate = this.roles().some(
      (r) => r.id !== current?.id && r.name.toLowerCase() === name.toLowerCase()
    );
    if (duplicate) {
      this.errorMsg.set(`"${name}" already exists.`);
      return;
    }

    this.saving.set(true);
    this.errorMsg.set('');
    const save = current
      ? this.admin.update<CreditRole>('credit_roles', current.id, { name, display_order })
      : this.admin.create<CreditRole>('credit_roles', { name, display_order });

    save.subscribe({
      next: () => {
        const done = () => { this.saving.set(false); this.closeForm(); this.load(); };
        if (current && current.name !== name) {
          this.admin.renameCreditRole(current.name, name).subscribe({ next: done, error: done });
        } else {
          done();
        }
      },
      error: (err: unknown) => {
        this.saving.set(false);
        this.errorMsg.set(err instanceof Error ? err.message : 'Save failed');
      },
    });
  }
}
