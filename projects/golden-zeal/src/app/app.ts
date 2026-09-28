import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { PostHogService } from './core/services/posthog.service';
import { SeoService, type SeoData } from './core/services/seo.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly posthogService = inject(PostHogService);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    // Static pages declare `data.seo` on their route. Detail pages (projects, crew,
    // cohorts) get the canonical here and fill in their own title once data loads.
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        let snapshot: ActivatedRouteSnapshot = this.router.routerState.snapshot.root;
        while (snapshot.firstChild) snapshot = snapshot.firstChild;
        const seo = snapshot.data['seo'] as Omit<SeoData, 'path'> | undefined;
        this.seo.update({ ...seo, path: e.urlAfterRedirects });
      });

    if (isPlatformBrowser(this.platformId)) {
      this.posthogService.init(environment.posthogKey, {
        api_host: environment.posthogHost,
        capture_exceptions: true,
      });
    }
  }
}
