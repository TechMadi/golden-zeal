import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminSupabaseService } from '../../services/admin-supabase.service';
import type { Project } from 'shared';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="p-6 md:p-10">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl" style="font-family:'Bebas Neue',sans-serif; color:#F0EBE0;">PROJECTS</h1>
        <a routerLink="/projects/new" class="px-4 py-2 text-xs tracking-widest uppercase transition-colors"
           style="background:#C9A04A; color:#0a150f;">+ Add Project</a>
      </div>

      <input
        type="text" placeholder="Search by title, category or client..."
        [value]="search()" (input)="search.set($any($event.target).value)"
        class="w-full max-w-sm mb-6 bg-transparent py-2 px-3 text-sm focus:outline-none"
        style="color:#F0EBE0;border:1px solid rgba(240,235,224,0.1);"
      />

      @if (loading()) {
        <p class="text-sm" style="color:#8a9e90;">Loading...</p>
      } @else if (projects().length === 0) {
        <p class="text-sm" style="color:#8a9e90;">No projects yet. <a routerLink="/projects/new" style="color:#C9A04A;">Add one.</a></p>
      } @else if (filtered().length === 0) {
        <p class="text-sm" style="color:#8a9e90;">No matches.</p>
      } @else {
        <div class="overflow-x-auto">
          <table class="w-full text-sm" style="border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 1px solid rgba(240,235,224,0.1);">
                @for (col of cols; track col) {
                  <th class="text-left py-3 px-4 text-xs tracking-widest uppercase" style="color:#8a9e90;">{{ col }}</th>
                }
              </tr>
            </thead>
            <tbody>
              @for (p of filtered(); track p.id) {
                <tr style="border-bottom: 1px solid rgba(240,235,224,0.05);" class="hover:bg-[#0f1f16] transition-colors">
                  <td class="py-3 px-4" style="color:#F0EBE0;">{{ p.title }}</td>
                  <td class="py-3 px-4" style="color:#8a9e90;">{{ p.category }}</td>
                  <td class="py-3 px-4" style="color:#8a9e90;">{{ p.client ?? '—' }}</td>
                  <td class="py-3 px-4" style="color:#8a9e90;">{{ p.year ?? '—' }}</td>
                  <td class="py-3 px-4">
                    <div class="flex gap-3">
                      <a [routerLink]="['/projects', p.id]" class="text-xs uppercase tracking-widest transition-colors" style="color:#C9A04A;">Edit</a>
                      <button type="button" (click)="delete(p.id)" class="text-xs uppercase tracking-widest transition-colors" style="color:#8a9e90;">Delete</button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class ProjectsListComponent implements OnInit {
  private readonly admin = inject(AdminSupabaseService);
  projects = signal<Project[]>([]);
  loading = signal(true);
  search = signal('');
  readonly cols = ['Title', 'Category', 'Client', 'Year', 'Actions'];

  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.projects();
    return this.projects().filter((p) =>
      [p.title, p.category, p.client].some((v) => v?.toLowerCase().includes(q))
    );
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.admin.list<Project>('projects').subscribe((p) => {
      this.projects.set(p);
      this.loading.set(false);
    });
  }

  delete(id: string): void {
    if (!confirm('Delete this project?')) return;
    this.admin.delete('projects', id).subscribe(() => this.load());
  }
}
