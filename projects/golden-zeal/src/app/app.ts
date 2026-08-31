import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PostHogService } from './core/services/posthog.service';
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

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.posthogService.init(environment.posthogKey, {
        api_host: environment.posthogHost,
        capture_exceptions: true,
      });
    }
  }
}
