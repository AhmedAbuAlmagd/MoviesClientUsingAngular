import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../core/services/movie.service';
import { ReviewService } from '../../core/services/review.service';
import { AuthService } from '../../core/services/auth.service';
import { WatchlistService } from '../../core/services/watchlist.service';
import { Movie } from '../../core/models/movie.model';
import { Review } from '../../core/models/review.model';
import { User } from '../../core/models/auth.model';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit {
  movie: Movie | null = null;
  reviews: Review[] = [];
  currentUser: User | null = null;
  isInWatchlist: boolean = false;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private reviewService: ReviewService,
    public authService: AuthService,
    private watchlistService: WatchlistService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadMovie();
      }
    });
  }

  loadMovie(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/movies']);
      return;
    }

    this.isLoading = true;
    this.movieService.getMovie(+id).subscribe({
      next: (movie: Movie) => {
        this.movie = movie;
        this.loadReviews();
        if (this.currentUser) {
          this.checkWatchlistStatus();
        }
      },
      error: (error: any) => {
        this.error = 'Error loading movie details';
        console.error('Error loading movie:', error);
        this.isLoading = false;
      }
    });
  }

  loadReviews(): void {
    if (!this.movie) return;

    this.reviewService.getMovieReviews(this.movie.id).subscribe({
      next: (reviews: Review[]) => {
        this.reviews = reviews;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading reviews:', error);
        this.isLoading = false;
      }
    });
  }

  checkWatchlistStatus(): void {
    if (!this.movie) return;

    this.watchlistService.isInWatchlist(this.movie.id).subscribe({
      next: (isInWatchlist: boolean) => {
        this.isInWatchlist = isInWatchlist;
      },
      error: (error: any) => {
        console.error('Error checking watchlist status:', error);
      }
    });
  }

  toggleWatchlist(): void {
    if (!this.movie || !this.currentUser) return;

    if (this.isInWatchlist) {
      this.watchlistService.removeFromWatchlist(this.movie.id).subscribe({
        next: () => {
          this.isInWatchlist = false;
        },
        error: (error: any) => {
          console.error('Error removing from watchlist:', error);
        }
      });
    } else {
      this.watchlistService.addToWatchlist(this.movie.id).subscribe({
        next: () => {
          this.isInWatchlist = true;
        },
        error: (error: any) => {
          console.error('Error adding to watchlist:', error);
        }
      });
    }
  }

  deleteMovie(): void {
    if (this.movie && confirm('Are you sure you want to delete this movie?')) {
      this.movieService.deleteMovie(this.movie.id).subscribe(
        () => {
          this.router.navigate(['/movies']);
        },
        (error: Error) => {
          console.error('Error deleting movie:', error);
        }
      );
    }
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  getCategoryIcon(categoryName: string): string {
    switch (categoryName.toLowerCase()) {
      case 'action':
        return 'local_fire_department';
      case 'comedy':
        return 'sentiment_very_satisfied';
      case 'drama':
        return 'theater_comedy';
      case 'horror':
        return 'ghost';
      case 'romance':
        return 'favorite';
      case 'sci-fi':
        return 'rocket';
      case 'thriller':
        return 'psychology';
      default:
        return 'local_movies';
    }
  }
}
