import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../core/services/movie.service';
import { CategoryService } from '../../core/services/category.service';
import { AuthService } from '../../core/services/auth.service';
import { Movie, Category, Pagination } from '../../core/models/movie.model';

@Component({
  selector: 'app-movie-list',
  template: `
    <div class="container-fluid py-4">
      <!-- Filters Section -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-4">
                  <div class="input-group">
                    <span class="input-group-text bg-light">
                      <i class="material-icons">search</i>
                    </span>
                    <input type="text" class="form-control" placeholder="Search movies..."
                           [(ngModel)]="searchQuery" (keyup.enter)="onSearch()">
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="input-group">
                    <span class="input-group-text bg-light">
                      <i class="material-icons">category</i>
                    </span>
                    <select class="form-select" [(ngModel)]="selectedCategory" (change)="onCategoryChange()">
                      <option value="">All Categories</option>
                      <option *ngFor="let category of categories" [value]="category.id">
                        {{ category.name }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="input-group">
                    <span class="input-group-text bg-light">
                      <i class="material-icons">sort</i>
                    </span>
                    <select class="form-select" [(ngModel)]="sortBy" (change)="onSortChange()">
                      <option value="RatingDesc">Rating: High to Low</option>
                      <option value="RatingAsc">Rating: Low to High</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-2" *ngIf="isAdmin()">
                  <button class="btn btn-primary w-100 d-flex align-items-center justify-content-center" routerLink="/movies/add">
                    <i class="material-icons me-2">add</i>
                    Add Movie
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Movies Grid -->
      <div class="row g-4">
        <div class="col-md-4 col-lg-3" *ngFor="let movie of movies">
          <div class="card h-100 movie-card shadow-sm">
            <div class="position-relative">
              <img [src]="movie.poster" class="card-img-top" [alt]="movie.title">
              <div class="position-absolute top-0 end-0 m-2">
                <span class="badge bg-warning text-dark">
                  <i class="material-icons align-middle me-1">star</i>
                  {{ movie.rating }}/10
                </span>
              </div>
            </div>
            <div class="card-body">
              <h5 class="card-title text-truncate">{{ movie.title }}</h5>
              <p class="card-text text-muted">{{ movie.description | slice:0:100 }}...</p>
            </div>
            <div class="card-footer bg-transparent border-top-0">
              <button class="btn btn-outline-primary w-100" (click)="viewMovieDetails(movie)">
                <i class="material-icons align-middle me-1">visibility</i>
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="row mt-4">
        <div class="col-12">
          <nav *ngIf="pagination.totalCount > pagination.pageSize">
            <ul class="pagination justify-content-center">
              <li class="page-item" [class.disabled]="pagination.pageNumber === 1">
                <a class="page-link" (click)="onPageChange(pagination.pageNumber - 1)">
                  <i class="material-icons align-middle">chevron_left</i>
                </a>
              </li>
              <li class="page-item" *ngFor="let page of getPageNumbers()" [class.active]="page === pagination.pageNumber">
                <a class="page-link" (click)="onPageChange(page)">{{ page }}</a>
              </li>
              <li class="page-item" [class.disabled]="pagination.pageNumber === getTotalPages()">
                <a class="page-link" (click)="onPageChange(pagination.pageNumber + 1)">
                  <i class="material-icons align-middle">chevron_right</i>
                </a>
              </li>
            </ul>
          </nav>
          <!-- Debug Info -->
          <div class="text-center mt-2 text-muted small">
            Page {{ pagination.pageNumber }} of {{ getTotalPages() }} ({{ pagination.totalCount }} total items)
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .movie-card {
      transition: transform 0.2s ease-in-out;
    }
    
    .movie-card:hover {
      transform: translateY(-5px);
    }
    
    .card-img-top {
      height: 400px;
      object-fit: cover;
    }
    
    .page-link {
      cursor: pointer;
      padding: 0.5rem 1rem;
    }
    
    .input-group-text {
      border: none;
    }
    
    .form-control, .form-select {
      border: 1px solid #dee2e6;
    }
    
    .form-control:focus, .form-select:focus {
      box-shadow: none;
      border-color: #0d6efd;
    }
    
    .badge {
      font-size: 0.9rem;
      padding: 0.5rem 0.75rem;
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

  constructor(
    private movieService: MovieService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.route.queryParams.subscribe(params => {
      this.pagination.pageNumber = +params['page'] || 1;
      this.selectedCategory = params['category'] || '';
      this.searchQuery = params['search'] || '';
      this.sortBy = params['sort'] || 'RatingDesc';
      this.loadMovies();
    });
  }

  loadMovies(): void {
    this.movieService.getMovies(
      this.pagination.pageNumber,
      this.pagination.pageSize,
      this.searchQuery,
      +this.selectedCategory || undefined,
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
    this.updateQueryParams();
  }

  onCategoryChange(): void {
    this.pagination.pageNumber = 1;
    this.updateQueryParams();
  }

  onSortChange(): void {
    this.pagination.pageNumber = 1;
    this.updateQueryParams();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.pagination.pageNumber = page;
      this.updateQueryParams();
    }
  }

  private updateQueryParams(): void {
    const queryParams = {
      page: this.pagination.pageNumber,
      category: this.selectedCategory || null,
      search: this.searchQuery || null,
      sort: this.sortBy
    };
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const pages: number[] = [];
    const maxPages = 5;
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
}
