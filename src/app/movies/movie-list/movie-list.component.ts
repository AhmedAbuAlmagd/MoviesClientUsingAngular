import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../core/services/movie.service';
import { CategoryService } from '../../core/services/category.service';
import { AuthService } from '../../core/services/auth.service';
import { WatchlistService } from '../../core/services/watchlist.service';
import { Movie, Category, Pagination } from '../../core/models/movie.model';

@Component({
  selector: 'app-movie-list',
  template: `
    <div class="movies-container">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-content">
          <h1 class="hero-bigtitle">Discover Movies</h1>
          <p class="hero-subtitle">Find and explore your favorite movies</p>
        </div>
      </div>

      <!-- Filters Section -->
      <section class="filters-section">
        <div class="container">
          <div class="filters-card">
            <div class="row g-3">
              <div class="col-md-4">
                <div class="search-box">
                  <i class="material-icons">search</i>
                  <input type="text" 
                         placeholder="Search movies..."
                         [(ngModel)]="searchQuery" 
                         (keyup.enter)="onSearch()">
                </div>
              </div>
              <div class="col-md-3">
                <div class="select-box">
                  <i class="material-icons">category</i>
                  <select [(ngModel)]="selectedCategory" (change)="onCategoryChange()">
                    <option value="">All Categories</option>
                    <option *ngFor="let category of categories" [value]="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-md-3">
                <div class="select-box">
                  <i class="material-icons">sort</i>
                  <select [(ngModel)]="sortBy" (change)="onSortChange()">
                    <option value="RatingDesc">Rating: High to Low</option>
                    <option value="RatingAsc">Rating: Low to High</option>
                  </select>
                </div>
              </div>
              <div class="col-md-2" *ngIf="isAdmin()">
                <button class="action-btn add-btn" routerLink="/movies/add">
                  <i class="material-icons">add</i>
                  <span>Add Movie</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Movies Grid -->
      <section class="movies-section">
        <div class="container">
          <div class="row g-4">
            <div class="col-md-4" *ngFor="let movie of movies">
              <div class="movie-card" [class.admin]="isAdmin()">
                <div class="movie-poster">
                  <img [src]="movie.poster" [alt]="movie.title">
                  <div class="movie-rating">
                    <i class="material-icons">star</i>
                    <span>{{ movie.rating }}/10</span>
                  </div>
                  <div class="movie-actions-overlay">
                    <button *ngIf="authService.currentUser$ | async"
                            class="watchlist-btn"
                            [class.active]="watchlistStatus[movie.id]"
                            (click)="toggleWatchlist(movie.id)">
                      <i class="material-icons">{{ watchlistStatus[movie.id] ? 'favorite' : 'favorite_border' }}</i>
                    </button>
                  </div>
                </div>
                <div class="movie-info">
                  <h3 class="movie-title">{{ movie.title }}</h3>
                  <p class="movie-description">{{ movie.description | slice:0:100 }}...</p>
                  <div class="movie-actions">
                    <button *ngIf="!isAdmin()"
                            class="action-btn view-btn"
                            (click)="viewMovieDetails(movie)">
                      <i class="material-icons">visibility</i>
                      <span>View Details</span>
                    </button>
                    <div class="admin-actions" *ngIf="isAdmin()">
                      <button class="action-btn edit-btn" (click)="editMovie(movie)">
                        <i class="material-icons">edit</i>
                        <span>Edit Movie</span>
                      </button>
                      <button class="action-btn delete-btn" (click)="deleteMovie(movie)">
                        <i class="material-icons">delete</i>
                        <span>Delete Movie</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Pagination -->
      <section class="pagination-section">
        <div class="container">
          <nav *ngIf="pagination.totalCount > pagination.pageSize">
            <ul class="pagination">
              <li class="page-item" [class.disabled]="pagination.pageNumber === 1">
                <a class="page-link" (click)="onPageChange(pagination.pageNumber - 1)">
                  <i class="material-icons">chevron_left</i>
                </a>
              </li>
              <li class="page-item" *ngFor="let page of getPageNumbers()" [class.active]="page === pagination.pageNumber">
                <a class="page-link" (click)="onPageChange(page)">{{ page }}</a>
              </li>
              <li class="page-item" [class.disabled]="pagination.pageNumber === getTotalPages()">
                <a class="page-link" (click)="onPageChange(pagination.pageNumber + 1)">
                  <i class="material-icons">chevron_right</i>
                </a>
              </li>
            </ul>
          </nav>
          <div class="pagination-info">
            Page {{ pagination.pageNumber }} of {{ getTotalPages() }} ({{ pagination.totalCount }} total items)
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .movies-container {
      background: #141414;
      color: white;
      min-height: 100vh;
    }

    .hero-section {
      background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
                  url('/assets/images/hero-bg.jpg') center/cover;
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      margin-bottom: 4rem;
    }

    .hero-content {
      max-width: 800px;
      padding: 0 1rem;
    }

    .hero-title {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .hero-subtitle {
      font-size: 1.5rem;
      opacity: 0.9;
    }

    .filters-section {
      margin-bottom: 4rem;
    }

    .filters-card {
      background: #1a1a1a;
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    }


    .hero-bigtitle {
      font-size: 4rem;
      font-weight: 900;
      margin-bottom: 1.5rem;
      color: #edebeb;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      line-height: 1.1;
      letter-spacing: -0.5px;
    }

    
    .search-box, .select-box {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50px;
      padding: 0.5rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .search-box input, .select-box select {
      background: transparent;
      border: none;
      color: white;
      width: 100%;
      padding: 0.5rem;
    }

    .search-box input::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }

    .select-box select {
      cursor: pointer;
    }

    .select-box select option {
      background: #1a1a1a;
      color: white;
    }

    .movies-section {
      padding: 2rem 0;
    }

    .movie-card {
      background: #1a1a1a;
      border-radius: 10px;
      overflow: hidden;
      transition: transform 0.3s ease;
    }

    .movie-card:hover {
      transform: translateY(-5px);
    }

    .movie-poster {
      position: relative;
      overflow: hidden;
    }

    .movie-poster img {
      width: 100%;
      height: 400px;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .movie-card:hover .movie-poster img {
      transform: scale(1.05);
    }

    .movie-rating {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(0, 0, 0, 0.8);
      color: #ffd700;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .movie-info {
      padding: 1.5rem;
    }

    .movie-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: white;
    }

    .movie-description {
      color: #999;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }

    .pagination-section {
      padding: 2rem 0 4rem;
    }

    .pagination {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
    }

    .page-item {
      list-style: none;
    }

    .page-link {
      background: #1a1a1a;
      color: white;
      border: none;
      padding: 0.75rem 1rem;
      border-radius: 5px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s ease;
    }

    .page-link:hover {
      background: #242424;
    }

    .page-item.active .page-link {
      background: #e50914;
    }

    .page-item.disabled .page-link {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .pagination-info {
      text-align: center;
      color: #999;
      margin-top: 1rem;
      font-size: 0.9rem;
    }

    .movie-actions {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }

    .admin-actions {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }

    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.8rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 5px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      background-color: transparent;
      color: white;
    }

    .action-btn i {
      font-size: 1.2rem;
    }

    .view-btn {
      background-color: rgb(68, 79, 91);
      color: white;
    }

    .view-btn:hover {
      background-color: #2c3e50;
      border-color: #2c3e50;
    }

    /* New styles for non-admin view button */
    .movie-card:not(.admin) .view-btn {
      background: rgba(229, 9, 20, 0.1);
      color: #e50914;
      border: 2px solid #e50914;
      border-radius: 30px;
      font-weight: 600;
      padding: 1rem 2rem;
      transition: all 0.3s ease;
    }

    .movie-card:not(.admin) .view-btn:hover {
      background: #e50914;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(229, 9, 20, 0.4);
    }

    .movie-card:not(.admin) .view-btn i {
      font-size: 1.2rem;
    }

    .edit-btn {
      background-color:rgb(89, 172, 227);
      color: white;
    }

    .edit-btn:hover {
      background-color: #3498db;
      border-color: #3498db;
    }

    .delete-btn {
      background-color:rgb(197, 110, 100);
      color: white;
    }

    .delete-btn:hover {
      background-color: #e74c3c;
      border-color: #e74c3c;
    }

    .add-btn
    {
     background-color:rgb(67, 113, 81);
      border-color:rgb(67, 113, 81);
    }
    .add-btn:hover {
      background-color:green;
      border-color:green;
    }

    .action-btn:active {
      transform: scale(0.98);
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }

      .hero-subtitle {
        font-size: 1.25rem;
      }

      .filters-card {
        padding: 1rem;
      }

      .movie-poster img {
        height: 300px;
      }
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: #1a1a1a;
      padding: 2rem;
      border-radius: 15px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(229, 9, 20, 0.2);
    }

    .modal-title {
      color: #e50914;
      font-size: 1.5rem;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .modal-title::before {
      content: 'warning';
      font-family: 'Material Icons';
      font-size: 1.8rem;
    }

    .modal-message {
      color: #fff;
      margin-bottom: 0.5rem;
      font-size: 1.1rem;
    }

    .modal-warning {
      color: #e50914 !important;
      font-size: 0.9rem !important;
      margin-top: 1rem;
    }

    .modal-buttons {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      justify-content: flex-end;
    }

    .modal-button {
      padding: 0.8rem 1.5rem;
      border: none;
      border-radius: 5px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 100px;
    }

    .modal-button-cancel {
      background: #333;
      color: white;
    }

    .modal-button-cancel:hover {
      background: #444;
    }

    .modal-button-delete {
      background: #e50914;
      color: white;
    }

    .modal-button-delete:hover {
      background: #b82525;
    }

    .movie-actions-overlay {
      position: absolute;
      top: 1rem;
      left: 1rem;
      display: flex;
      gap: 0.5rem;
      z-index: 2;
    }

    .watchlist-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.8rem;
      padding: 1rem 2rem;
      background: rgba(229, 9, 20, 0.1);
      color: #e50914;
      border: 2px solid #e50914;
      border-radius: 30px;
      font-weight: 600;
      transition: all 0.3s ease;

      &:hover {
        background: #e50914;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(229, 9, 20, 0.4);
      }

      &.active {
        background: #e50914;
        color: white;
      }

      i {
        font-size: 1.2rem;
      }
    }
  `]
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  categories: Category[] = [];
  searchQuery = '';
  selectedCategory = '';
  sortBy = 'RatingDesc';
  pagination: Pagination<Movie> = {
    pageNumber: 1,
    pageSize: 6,
    totalCount: 0,
    data: []
  };
  watchlistStatus: { [key: number]: boolean } = {};

  constructor(
    private movieService: MovieService,
    private categoryService: CategoryService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private watchlistService: WatchlistService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    
    // Subscribe to query parameter changes
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = params['category'];
      } else {
        this.selectedCategory = '';
      }
      if (params['page']) {
        this.pagination.pageNumber = +params['page'];
      }
      if (params['sort']) {
        this.sortBy = params['sort'];
      }
      this.loadMovies();
    });
  }

  loadMovies(): void {
    this.movieService.getMovies(
      this.pagination.pageNumber,
      this.pagination.pageSize,
      this.searchQuery,
      this.selectedCategory ? parseInt(this.selectedCategory) : undefined,
      this.sortBy
    ).subscribe({
      next: (response: Pagination<Movie>) => {
        this.movies = response.data;
        this.pagination = {
          pageNumber: response.pageNumber,
          pageSize: response.pageSize,
          totalCount: response.totalCount,
          data: response.data
        };
        
        this.updateQueryParams();
        if (this.authService.currentUser$) {
          this.checkWatchlistStatus();
        }
      },
      error: (error: Error) => {
        console.error('Error loading movies:', error);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
      },
      error: (error: Error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  onSearch(): void {
    this.pagination.pageNumber = 1;
    this.loadMovies();
  }

  onCategoryChange(): void {
    console.log('Category changed to:', this.selectedCategory); // Debug log
    this.pagination.pageNumber = 1; // Reset to first page when category changes
    this.loadMovies(); // Load movies first
    this.updateQueryParams(); // Then update URL
  }

  onSortChange(): void {
    this.pagination.pageNumber = 1;
    this.loadMovies();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.pagination.pageNumber = page;
      this.loadMovies();
    }
  }

  private updateQueryParams(): void {
    const queryParams: any = {
      page: this.pagination.pageNumber,
      sort: this.sortBy
    };

    if (this.selectedCategory) {
      queryParams.category = this.selectedCategory;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      replaceUrl: true
    });
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const pages: number[] = [];
    const maxPages = 5;
    
    if (totalPages <= 0) return pages;

    let start = Math.max(1, this.pagination.pageNumber - Math.floor(maxPages / 2));
    let end = Math.min(totalPages, start + maxPages - 1);

    if (end - start + 1 < maxPages) {
      start = Math.max(1, end - maxPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  getTotalPages(): number {
    return Math.ceil(this.pagination.totalCount / this.pagination.pageSize);
  }

  viewMovieDetails(movie: Movie): void {
    this.router.navigate(['/movies', movie.id]);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  deleteMovie(movie: Movie): void {
    if (confirm(`Are you sure you want to delete "${movie.title}"?`)) {
      this.movieService.deleteMovie(movie.id).subscribe({
        next: (response: any) => {
          this.movies = this.movies.filter(m => m.id !== movie.id);
          this.pagination.totalCount--;
          if (this.movies.length === 0 && this.pagination.pageNumber > 1) {
            this.pagination.pageNumber--;
          }
          this.loadMovies();
        },
        error: (error: any) => {
          if (error.status === 200) {
            this.movies = this.movies.filter(m => m.id !== movie.id);
            this.pagination.totalCount--;
            if (this.movies.length === 0 && this.pagination.pageNumber > 1) {
              this.pagination.pageNumber--;
            }
            this.loadMovies();
          } else {
            alert('Error deleting movie. Please try again.');
          }
        }
      });
    }
  }

  editMovie(movie: Movie): void {
    this.router.navigate(['/movies/edit', movie.id]);
  }

  checkWatchlistStatus(): void {
    this.movies.forEach(movie => {
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
}