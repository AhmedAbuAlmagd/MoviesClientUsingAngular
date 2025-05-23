import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/auth.model';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  currentUser: User | null = null;

  constructor(
    private router: Router,
    public authService: AuthService
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
