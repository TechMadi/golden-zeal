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
    path: 'cinematic',
    loadComponent: () =>
      import('./pages/cinematic/cinematic.component').then((m) => m.CinematicComponent),
  },
  {
    path: 'projects/:slug',
    loadComponent: () =>
      import('./pages/project-detail/project-detail.component').then((m) => m.ProjectDetailComponent),
  },
  {
    path: 'directors',
    loadComponent: () =>
      import('./pages/directors/directors.component').then((m) => m.DirectorsComponent),
  },
  {
    path: 'directors/:slug',
    loadComponent: () =>
      import('./pages/director-detail/director-detail.component').then((m) => m.DirectorDetailComponent),
  },
  {
    path: 'photographers',
    loadComponent: () =>
      import('./pages/photographers/photographers.component').then((m) => m.PhotographersComponent),
  },
  {
    path: 'photographers/:slug',
    loadComponent: () =>
      import('./pages/photographer-detail/photographer-detail.component').then(
        (m) => m.PhotographerDetailComponent
      ),
  },
  {
    path: 'crew',
    loadComponent: () =>
      import('./pages/crew/crew.component').then((m) => m.CrewComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
