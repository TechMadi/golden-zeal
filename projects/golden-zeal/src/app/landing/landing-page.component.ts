import { Component } from '@angular/core';
import { AppHeaderComponent } from '../layout/header/header.component';
import { AppFooterComponent } from '../layout/footer/footer.component';
import { AppHeroComponent } from '../sections/hero/hero.component';
import { AppAboutComponent } from '../sections/about/about.component';
import { AppProjectsComponent } from '../sections/projects/projects.component';
import { AppServicesComponent } from '../sections/services/services.component';
import { AppProcessComponent } from '../sections/process/process.component';
import { AppFaqComponent } from '../sections/faq/faq.component';
import { AppContactComponent } from '../sections/contact/contact.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    AppHeaderComponent,
    AppFooterComponent,
    AppHeroComponent,
    AppAboutComponent,
    AppProjectsComponent,
    AppServicesComponent,
    AppProcessComponent,
    AppFaqComponent,
    AppContactComponent,
  ],
  template: `
    <app-header />
    <main class="flex flex-col min-h-screen bg-gz-ivory">
      <app-hero />
      <app-about />
      <app-projects />
      <app-services />
      <app-process />
      <app-faq />
      <app-contact />
    <app-footer/>
    </main>
   
  `,
  styles: [],
})
export class LandingPageComponent {}
