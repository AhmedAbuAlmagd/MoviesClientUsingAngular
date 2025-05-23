import { Component, OnInit } from '@angular/core';
import { MovieService } from '../core/services/movie.service';
import { CategoryService } from '../core/services/category.service';
import { AuthService } from '../core/services/auth.service';
import { WatchlistService } from '../core/services/watchlist.service';
import { Movie, Category, Pagination } from '../core/models/movie.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredMovies: Movie[] = [];
  categories: Category[] = [];
  searchQuery: string = '';
  watchlistStatus: { [key: number]: boolean } = {};

  constructor(
    private movieService: MovieService,
    private categoryService: CategoryService,
    public authService: AuthService,
    private watchlistService: WatchlistService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadFeaturedMovies();
    this.loadCategories();
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/movies'], {
        queryParams: { search: this.searchQuery.trim() }
      });
    }
  }

  private loadFeaturedMovies(): void {
    this.movieService.getMovies(1, 6, undefined, undefined, 'RatingDesc').subscribe({
      next: (response: Pagination<Movie>) => {
        this.featuredMovies = response.data;
        if (this.authService.currentUser$) {
          this.checkWatchlistStatus();
        }
      },
      error: (error: Error) => {
        console.error('Error loading featured movies:', error);
      }
    });
  }

  checkWatchlistStatus(): void {
    this.featuredMovies.forEach(movie => {
      this.watchlistService.isInWatchlist(movie.id).subscribe({
        next: (isInWatchlist: boolean) => {
          this.watchlistStatus[movie.id] = isInWatchlist;
        },
        error: (error: any) => {
          console.error('Error checking watchlist status:', error);
        }
      });
    });
  }

  toggleWatchlist(movieId: number): void {
    if (!this.authService.currentUser$) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.watchlistStatus[movieId]) {
      this.watchlistService.removeFromWatchlist(movieId).subscribe({
        next: () => {
          this.watchlistStatus[movieId] = false;
        },
        error: (error: any) => {
          console.error('Error removing from watchlist:', error);
        }
      });
    } else {
      this.watchlistService.addToWatchlist(movieId).subscribe({
        next: () => {
          this.watchlistStatus[movieId] = true;
        },
        error: (error: any) => {
          console.error('Error adding to watchlist:', error);
        }
      });
    }
  }

  private loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
      },
      error: (error: Error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  getCategoryIcon(categoryName: string): string {
    const iconMap: { [key: string]: string } = {
      'Action': 'local_fire_department',
      'Adventure': 'explore',
      'Comedy': 'sentiment_very_satisfied',
      'Drama': 'theater_comedy',
      'Horror': 'dark_mode',
      'Romance': 'favorite',
      'Sci-Fi': 'rocket_launch',
      'Thriller': 'psychology',
      'Animation': 'animation',
      'Documentary': 'videocam',
      'Family': 'family_restroom',
      'Fantasy': 'auto_awesome',
      'Mystery': 'psychology_alt',
      'Crime': 'gavel',
      'Biography': 'person',
      'History': 'history_edu',
      'Music': 'music_note',
      'Sport': 'sports_soccer',
      'War': 'military_tech',
      'Western': 'landscape'
    };

    return iconMap[categoryName] || 'movie';
  }
}
