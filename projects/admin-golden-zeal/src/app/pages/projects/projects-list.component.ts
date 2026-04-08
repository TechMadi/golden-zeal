import { Component, OnInit, signal, inject } from '@angular/core';
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
           style="background:#C9A04A; color:#0f0f0f;">+ Add Project</a>
      </div>

      @if (loading()) {
        <p class="text-sm" style="color:#888880;">Loading...</p>
      } @else if (projects().length === 0) {
        <p class="text-sm" style="color:#888880;">No projects yet. <a routerLink="/projects/new" style="color:#C9A04A;">Add one.</a></p>
      } @else {
        <div class="overflow-x-auto">
          <table class="w-full text-sm" style="border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 1px solid rgba(240,235,224,0.1);">
                @for (col of cols; track col) {
                  <th class="text-left py-3 px-4 text-xs tracking-widest uppercase" style="color:#888880;">{{ col }}</th>
                }
              </tr>
            </thead>
            <tbody>
              @for (p of projects(); track p.id) {
                <tr style="border-bottom: 1px solid rgba(240,235,224,0.05);" class="hover:bg-[#141414] transition-colors">
                  <td class="py-3 px-4" style="color:#F0EBE0;">{{ p.title }}</td>
                  <td class="py-3 px-4" style="color:#888880;">{{ p.category }}</td>
                  <td class="py-3 px-4" style="color:#888880;">{{ p.client ?? '—' }}</td>
                  <td class="py-3 px-4" style="color:#888880;">{{ p.year ?? '—' }}</td>
                  <td class="py-3 px-4">
                    <span class="text-xs px-2 py-1" [style.background]="p.featured ? 'rgba(201,160,74,0.2)' : 'rgba(240,235,224,0.05)'"
                          [style.color]="p.featured ? '#C9A04A' : '#888880'">
                      {{ p.featured ? 'Featured' : 'Standard' }}
                    </span>
                  </td>
                  <td class="py-3 px-4">
                    <div class="flex gap-3">
                      <a [routerLink]="['/projects', p.id]" class="text-xs uppercase tracking-widest transition-colors" style="color:#C9A04A;">Edit</a>
                      <button type="button" (click)="delete(p.id)" class="text-xs uppercase tracking-widest transition-colors" style="color:#888880;">Delete</button>
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
  readonly cols = ['Title', 'Category', 'Client', 'Year', 'Status', 'Actions'];

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
