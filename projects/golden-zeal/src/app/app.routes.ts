import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'commercial',
    loadComponent: () =>
      import('./pages/commercial/commercial.component').then((m) => m.CommercialComponent),
  },
  {
    path: 'narrative',
    loadComponent: () =>
      import('./pages/cinematic/cinematic.component').then((m) => m.CinematicComponent),
  },
  {
    path: 'cinematic',
    redirectTo: 'narrative',
  },
  {
    path: 'projects/:slug',
    loadComponent: () =>
      import('./pages/project-detail/project-detail.component').then((m) => m.ProjectDetailComponent),
  },
  {
    path: 'directors',
    redirectTo: 'crew',
  },
  {
    path: 'directors/:slug',
    redirectTo: 'crew',
  },
  {
    path: 'photographers',
    redirectTo: 'crew',
  },
  {
    path: 'photographers/:slug',
    redirectTo: 'crew',
  },
  {
    path: 'crew',
    loadComponent: () =>
      import('./pages/crew/crew.component').then((m) => m.CrewComponent),
  },
  {
    path: 'crew/:slug',
    loadComponent: () =>
      import('./pages/team-detail/team-detail.component').then((m) => m.TeamDetailComponent),
  },
  {
    path: 'screening',
    loadComponent: () =>
      import('./pages/screening/screening.component').then((m) => m.ScreeningComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: 'apprenticeship',
    loadComponent: () =>
      import('./pages/apprenticeship/apprenticeship.component').then((m) => m.ApprenticeshipComponent),
  },
  {
    path: 'apprenticeship/:slug',
    loadComponent: () =>
      import('./pages/apprenticeship/apprenticeship-detail.component').then((m) => m.ApprenticeshipDetailComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
