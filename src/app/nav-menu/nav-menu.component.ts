import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-nav-menu',
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" [routerLink]="['/']">Movies App</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" [routerLink]="['/']" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" [routerLink]="['/movies']" routerLinkActive="active">Movies</a>
            </li>
          </ul>
          <ul class="navbar-nav">
            <ng-container *ngIf="isAuthenticated(); else notAuthenticated">
              <li class="nav-item" *ngIf="isAdmin()">
                <a class="nav-link" [routerLink]="['/movies/add']">Add Movie</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" (click)="logout()" style="cursor: pointer;">Logout</a>
              </li>
            </ng-container>
            <ng-template #notAuthenticated>
              <li class="nav-item">
                <a class="nav-link" [routerLink]="['/login']" routerLinkActive="active">Login</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" [routerLink]="['/register']" routerLinkActive="active">Register</a>
              </li>
            </ng-template>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      margin-bottom: 20px;
    }
  `]
})
export class NavMenuComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
} 