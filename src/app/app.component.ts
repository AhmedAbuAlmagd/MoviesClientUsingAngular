import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-nav-bar></app-nav-bar>
    <div class="container-fluid px-4">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  title = 'MoviesClient';
}
