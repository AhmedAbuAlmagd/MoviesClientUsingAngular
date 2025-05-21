import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  navigateToMovies(): void {
    this.router.navigate(['/movies']);
  }

  navigateToFavorites(): void {
    this.router.navigate(['/movies/favorites']);
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  navigateToAbout(): void {
    this.router.navigate(['/about']);
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  getCurrentUser() {
    return this.authService['currentUserSubject'].value;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
