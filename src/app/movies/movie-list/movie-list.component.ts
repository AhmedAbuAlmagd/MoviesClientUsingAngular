import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../core/services/movie.service';
import { CategoryService } from '../../core/services/category.service';
import { AuthService } from '../../core/services/auth.service';
import { Movie } from '../../core/models/movie.model';
import { Category } from '../../core/models/movie.model';

interface Pagination<T> {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  data: T[];
}

@Component({
  selector: 'app-movie-list',
  template: `
    <div class="container mt-4">
      <div class="row mb-4">
        <div class="col-md-4">
          <input type="text" class="form-control" placeholder="Search movies..."
                 [(ngModel)]="searchQuery" (keyup.enter)="onSearch()">
        </div>
        <div class="col-md-3">
          <select class="form-select" [(ngModel)]="selectedCategory" (change)="onCategoryChange()">
            <option value="">All Categories</option>
            <option *ngFor="let category of categories" [value]="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <select class="form-select" [(ngModel)]="sortBy" (change)="onSortChange()">
            <option value="RatingDesc">Rating: High to Low</option>
            <option value="RatingAsc">Rating: Low to High</option>
          </select>
        </div>
        <div class="col-md-2" *ngIf="isAdmin()">
          <button class="btn btn-primary w-100" routerLink="/movies/add">Add Movie</button>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4 mb-4" *ngFor="let movie of movies">
          <div class="card h-100">
            <img [src]="movie.poster" class="card-img-top" [alt]="movie.title">
            <div class="card-body">
              <h5 class="card-title">{{ movie.title }}</h5>
              <p class="card-text">{{ movie.description | slice:0:100 }}...</p>
              <div class="d-flex justify-content-between align-items-center">
                <span class="badge bg-primary">{{ movie.rating }}/10</span>
                <a [routerLink]="['/movies', movie.id]" class="btn btn-outline-primary">View Details</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav *ngIf="pagination.totalCount > pagination.pageSize">
        <ul class="pagination justify-content-center">
          <li class="page-item" [class.disabled]="pagination.pageNumber === 1">
            <a class="page-link" (click)="onPageChange(pagination.pageNumber - 1)">Previous</a>
          </li>
          <li class="page-item" *ngFor="let page of getPageNumbers()" [class.active]="page === pagination.pageNumber">
            <a class="page-link" (click)="onPageChange(page)">{{ page }}</a>
          </li>
          <li class="page-item" [class.disabled]="pagination.pageNumber === getTotalPages()">
            <a class="page-link" (click)="onPageChange(pagination.pageNumber + 1)">Next</a>
          </li>
        </ul>
      </nav>
    </div>
  `,
  styles: [`
    .card-img-top {
      height: 300px;
      object-fit: cover;
    }
    .page-link {
      cursor: pointer;
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
    ).subscribe(
      (response: Pagination<Movie>) => {
        this.movies = response.data;
        this.pagination = response;
      },
      (error: Error) => {
        console.error('Error loading movies:', error);
      }
    );
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories;
      },
      (error: Error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  onSearch(): void {
    this.updateQueryParams();
  }

  onCategoryChange(): void {
    this.updateQueryParams();
  }

  onSortChange(): void {
    this.updateQueryParams();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.pagination.pageNumber = page;
      this.updateQueryParams();
    }
  }

  private updateQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.pagination.pageNumber,
        category: this.selectedCategory || null,
        search: this.searchQuery || null,
        sort: this.sortBy
      },
      queryParamsHandling: 'merge'
    });
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = 5;
    let start = Math.max(1, this.pagination.pageNumber - Math.floor(maxPages / 2));
    let end = Math.min(this.getTotalPages(), start + maxPages - 1);

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

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
} 