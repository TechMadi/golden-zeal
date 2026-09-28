import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { seo: {} },
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'commercial',
    data: { seo: { title: 'Commercials & TV Adverts', description: 'TV commercials, brand films and animations produced by Golden Zeal Pictures for brands across Africa and around the world.' } },
    loadComponent: () =>
      import('./pages/commercial/commercial.component').then((m) => m.CommercialComponent),
  },
  {
    path: 'narrative',
    data: { seo: { title: 'Narrative Films & Documentaries', description: 'Narrative films, documentaries and short-form work from Golden Zeal Pictures — stories rooted in Africa, told for global audiences.' } },
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
    data: { seo: { title: 'Our Crew', description: 'Meet the directors, cinematographers, producers and crew behind Golden Zeal Pictures, a film production company in Nairobi, Kenya.' } },
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
    data: { seo: { title: 'Screenings & Premieres', description: 'Premieres, screenings and Q&A sessions with the filmmakers behind Golden Zeal Pictures\' latest work.' } },
    loadComponent: () =>
      import('./pages/screening/screening.component').then((m) => m.ScreeningComponent),
  },
  {
    path: 'contact',
    data: { seo: { title: 'Contact Us', description: 'Start a project with Golden Zeal Pictures. Talk to our Nairobi team about commercials, documentaries and film productions across Africa and beyond.' } },
    loadComponent: () =>
      import('./pages/contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: 'apprenticeship',
    data: { seo: { title: 'Film Apprenticeship Programme', description: 'Hands-on film production training in Nairobi — work alongside the Golden Zeal Pictures crew on real commercial and narrative productions.' } },
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
