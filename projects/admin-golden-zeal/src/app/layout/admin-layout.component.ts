import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AdminSupabaseService } from '../services/admin-supabase.service';

interface NavItem { label: string; path: string; }

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="min-h-screen flex" style="background: #0f0f0f; color: #F0EBE0;">
      <!-- Sidebar -->
      <aside
        class="hidden md:flex flex-col w-56 shrink-0 py-8 px-4"
        style="background: #141414; border-right: 1px solid rgba(240,235,224,0.07);"
      >
        <!-- Logo -->
        <a routerLink="/dashboard" class="mb-10 px-2">
          <img src="assets/brand/full_logo.png" alt="GZP" class="h-8 w-auto" style="filter: brightness(0) invert(1);" />
        </a>

        <!-- Nav -->
        <nav class="flex-1 space-y-1">
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="!text-gz-gold"
              class="flex items-center px-3 py-2 text-xs tracking-[0.15em] uppercase rounded transition-colors"
              style="color: #888880;"
              [routerLinkActiveOptions]="{ exact: item.path === '/dashboard' }"
            >{{ item.label }}</a>
          }
        </nav>

        <!-- Sign out -->
        <button
          type="button"
          (click)="signOut()"
          class="px-3 py-2 text-xs tracking-[0.15em] uppercase text-left transition-colors mt-4"
          style="color: #888880; border-top: 1px solid rgba(240,235,224,0.07); padding-top: 1rem;"
        >Sign Out</button>
      </aside>

      <!-- Mobile header -->
      <div class="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3"
           style="background: #141414; border-bottom: 1px solid rgba(240,235,224,0.07);">
        <img src="assets/brand/full_logo.png" alt="GZP" class="h-7 w-auto" style="filter: brightness(0) invert(1);" />
        <button type="button" (click)="mobileOpen.set(!mobileOpen())" class="text-xs tracking-widest uppercase" style="color: #888880;">Menu</button>
      </div>

      <!-- Mobile drawer -->
      @if (mobileOpen()) {
        <div class="md:hidden fixed inset-0 z-50 flex" style="background: rgba(0,0,0,0.7);" (click)="mobileOpen.set(false)">
          <div class="w-56 h-full py-8 px-4 space-y-1" style="background: #141414;" (click)="$event.stopPropagation()">
            @for (item of navItems; track item.path) {
              <a [routerLink]="item.path" (click)="mobileOpen.set(false)"
                 class="flex items-center px-3 py-2 text-xs tracking-[0.15em] uppercase rounded transition-colors"
                 style="color: #888880;">{{ item.label }}</a>
            }
          </div>
        </div>
      }

      <!-- Main content -->
      <main class="flex-1 overflow-auto pt-14 md:pt-0">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AdminLayoutComponent {
  private readonly admin = inject(AdminSupabaseService);
  private readonly router = inject(Router);
  mobileOpen = signal(false);

  readonly navItems: NavItem[] = [
    { label: 'Dashboard',     path: '/dashboard'    },
    { label: 'Projects',      path: '/projects'     },
    { label: 'Directors',     path: '/directors'    },
    { label: 'Photographers', path: '/photographers'},
    { label: 'Team',          path: '/team'         },
    { label: 'Reps',          path: '/reps'         },
    { label: 'Services',      path: '/services'     },
    { label: 'FAQ',           path: '/faq'          },
    { label: 'Showreel',      path: '/showreel'     },
    { label: 'Settings',      path: '/settings'     },
  ];

  signOut(): void {
    this.admin.signOut().subscribe(() => this.router.navigate(['/login']));
  }
}
