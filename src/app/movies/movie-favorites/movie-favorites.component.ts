import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../core/services/movie.service';
import { WatchlistService } from '../../core/services/watchlist.service';
import { AuthService } from '../../core/services/auth.service';
import { Movie } from '../../core/models/movie.model';

@Component({
  selector: 'app-movie-favorites',
  templateUrl: './movie-favorites.component.html',
  styleUrls: ['./movie-favorites.component.scss']
})
export class MovieFavoritesComponent implements OnInit {
  movies: Movie[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private movieService: MovieService,
    private watchlistService: WatchlistService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.isLoading = true;
    this.watchlistService.getUserWatchlist().subscribe({
      next: (movies: Movie[]) => {
        this.movies = movies;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.error = 'Error loading favorites';
        console.error('Error loading favorites:', error);
        this.isLoading = false;
      }
    });
  }

  removeFromFavorites(movieId: number): void {
    this.watchlistService.removeFromWatchlist(movieId).subscribe({
      next: () => {
        this.movies = this.movies.filter(movie => movie.id !== movieId);
      },
      error: (error: any) => {
        console.error('Error removing from favorites:', error);
      }
    });
  }
} 