import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [NgIcon, RouterLink],
  templateUrl: './hero.component.html',
})
export class AppHeroComponent {}
