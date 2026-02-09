import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./landing/landing-page.component').then(m => m.LandingPageComponent) },
];
