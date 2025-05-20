import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-nav-menu></app-nav-menu>
    <div class="container mt-4">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  title = 'MoviesClient';
}
