import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./pages/projects/projects-list.component').then((m) => m.ProjectsListComponent),
      },
      {
        path: 'projects/:id',
        loadComponent: () =>
          import('./pages/projects/project-form.component').then((m) => m.ProjectFormComponent),
      },
      {
        path: 'directors',
        loadComponent: () =>
          import('./pages/directors/directors-admin.component').then((m) => m.DirectorsAdminComponent),
      },
      {
        path: 'photographers',
        loadComponent: () =>
          import('./pages/photographers/photographers-admin.component').then((m) => m.PhotographersAdminComponent),
      },
      {
        path: 'team',
        loadComponent: () =>
          import('./pages/team/team-admin.component').then((m) => m.TeamAdminComponent),
      },
      {
        path: 'reps',
        loadComponent: () =>
          import('./pages/reps/reps-admin.component').then((m) => m.RepsAdminComponent),
      },
      {
        path: 'faq',
        loadComponent: () =>
          import('./pages/faq/faq-admin.component').then((m) => m.FaqAdminComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/settings.component').then((m) => m.SettingsComponent),
      },
      {
        path: 'showreel',
        loadComponent: () =>
          import('./pages/showreel/showreel.component').then((m) => m.ShowreelAdminComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
