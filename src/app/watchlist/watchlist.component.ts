import { Component, OnInit } from '@angular/core';
import { WatchlistService } from '../core/services/watchlist.service';
import { Movie } from '../core/models/movie.model';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit {
  watchlist: Movie[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private watchlistService: WatchlistService,
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadWatchlist();
  }

  loadWatchlist(): void {
    this.isLoading = true;
    this.watchlistService.getUserWatchlist().subscribe({
      next: (movies) => {
        this.watchlist = movies;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Error loading watchlist';
        console.error('Error loading watchlist:', error);
        this.isLoading = false;
      }
    });
  }

  removeFromWatchlist(movieId: number): void {
    this.watchlistService.removeFromWatchlist(movieId).subscribe({
      next: () => {
        this.watchlist = this.watchlist.filter(movie => movie.id !== movieId);
      },
      error: (error) => {
        console.error('Error removing from watchlist:', error);
      }
    });
  }
} 