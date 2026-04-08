import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminSupabaseService } from '../../services/admin-supabase.service';
import type { Project, Director, TeamMember } from 'shared';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="p-6 md:p-10 max-w-5xl">
      <div class="mb-10">
        <p class="text-xs tracking-[0.3em] uppercase mb-2" style="color: #C9A04A;">Golden Zeal Pictures</p>
        <h1 class="text-4xl md:text-5xl" style="font-family: 'Bebas Neue', sans-serif; color: #F0EBE0;">CMS DASHBOARD</h1>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        @for (stat of stats(); track stat.label) {
          <div class="p-5 rounded" style="background: #141414; border: 1px solid rgba(240,235,224,0.07);">
            <p class="text-3xl mb-1" style="color: #C9A04A; font-family: 'Bebas Neue', sans-serif;">{{ stat.value }}</p>
            <p class="text-xs tracking-widest uppercase" style="color: #888880;">{{ stat.label }}</p>
          </div>
        }
      </div>

      <!-- Quick actions -->
      <div>
        <p class="text-xs tracking-[0.3em] uppercase mb-4" style="color: #888880;">Quick Actions</p>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          @for (action of actions; track action.label) {
            <a
              [routerLink]="action.path"
              class="block p-4 text-sm transition-colors"
              style="background: #141414; border: 1px solid rgba(240,235,224,0.07); color: #F0EBE0;"
            >
              <p class="text-xs tracking-widest uppercase mb-1" style="color: #C9A04A;">{{ action.section }}</p>
              {{ action.label }}
            </a>
          }
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private readonly admin = inject(AdminSupabaseService);
  stats = signal<{ label: string; value: number | string }[]>([
    { label: 'Projects',   value: '—' },
    { label: 'Directors',  value: '—' },
    { label: 'Team',       value: '—' },
    { label: 'FAQ Items',  value: '—' },
  ]);

  readonly actions = [
    { section: 'Projects',   label: 'Add New Project',   path: '/projects/new'   },
    { section: 'Directors',  label: 'Add Director',      path: '/directors/new'  },
    { section: 'Team',       label: 'Add Team Member',   path: '/team/new'       },
    { section: 'Showreel',   label: 'Update Showreel',   path: '/showreel'       },
    { section: 'Settings',   label: 'Edit Site Settings',path: '/settings'       },
    { section: 'FAQ',        label: 'Edit FAQ',          path: '/faq'            },
  ];

  ngOnInit(): void {
    this.admin.list<Project>('projects').subscribe((p) => {
      this.admin.list<Director>('directors').subscribe((d) => {
        this.admin.list<TeamMember>('team_members').subscribe((t) => {
          this.stats.set([
            { label: 'Projects',  value: p.length },
            { label: 'Directors', value: d.length },
            { label: 'Team',      value: t.length },
            { label: 'FAQ Items', value: '—' },
          ]);
        });
      });
    });
  }
}
