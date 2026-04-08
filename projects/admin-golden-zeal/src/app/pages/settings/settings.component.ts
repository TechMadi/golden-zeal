import { Component, OnInit, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AdminSupabaseService } from '../../services/admin-supabase.service';
import type { SiteSetting } from 'shared';

const SETTING_KEYS = [
  { key: 'hero_headline',   label: 'Hero Headline'   },
  { key: 'hero_tagline',    label: 'Hero Tagline'    },
  { key: 'about_text',      label: 'About Text'      },
  { key: 'stat_founded',    label: 'Stat: Founded'   },
  { key: 'stat_producers',  label: 'Stat: Producers' },
  { key: 'stat_projects',   label: 'Stat: Projects'  },
  { key: 'stat_awards',     label: 'Stat: Awards'    },
  { key: 'contact_phone',   label: 'Contact Phone'   },
  { key: 'contact_email',   label: 'Contact Email'   },
  { key: 'contact_address', label: 'Contact Address' },
];

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="p-6 md:p-10 max-w-2xl">
      <h1 class="text-3xl mb-8" style="font-family:'Bebas Neue',sans-serif;color:#F0EBE0;">SITE SETTINGS</h1>
      @if (saved()) {
        <div class="p-3 mb-6 text-xs" style="background:rgba(201,160,74,0.1);border:1px solid #C9A04A;color:#C9A04A;">Settings saved.</div>
      }
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
        @for (s of settingKeys; track s.key) {
          <div>
            <label [for]="s.key" class="block text-xs tracking-widest uppercase mb-1" style="color:#888880;">{{ s.label }}</label>
            <input [id]="s.key" type="text" [formControlName]="s.key"
                   class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                   style="color:#F0EBE0;border:1px solid rgba(240,235,224,0.1);" />
          </div>
        }
        <button type="submit" [disabled]="saving()" class="px-6 py-2 text-xs uppercase tracking-widest mt-4" style="background:#C9A04A;color:#0f0f0f;">
          {{ saving() ? 'Saving...' : 'Save All Settings' }}
        </button>
      </form>
    </div>
  `,
})
export class SettingsComponent implements OnInit {
  private readonly admin = inject(AdminSupabaseService);
  private readonly fb = inject(FormBuilder);
  saving = signal(false); saved = signal(false);
  readonly settingKeys = SETTING_KEYS;

  form = this.fb.nonNullable.group(
    Object.fromEntries(SETTING_KEYS.map((s) => [s.key, '']))
  );

  ngOnInit(): void {
    this.admin.list<SiteSetting>('site_settings', 'key').subscribe((settings) => {
      const patch: Record<string, string> = {};
      settings.forEach((s) => { patch[s.key] = s.value; });
      this.form.patchValue(patch);
    });
  }

  onSubmit(): void {
    if (this.saving()) return;
    this.saving.set(true);
    const values = this.form.getRawValue() as Record<string, string>;
    const upserts = Object.entries(values).map(([key, value]) =>
      this.admin.upsertSetting(key, value)
    );
    let done = 0;
    upserts.forEach((obs) => obs.subscribe({
      next: () => { done++; if (done === upserts.length) { this.saving.set(false); this.saved.set(true); setTimeout(() => this.saved.set(false), 2000); } },
      error: () => this.saving.set(false),
    }));
  }
}
