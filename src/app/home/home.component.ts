import { Component, OnInit } from '@angular/core';
import { MovieService } from '../core/services/movie.service';
import { CategoryService } from '../core/services/category.service';
import { Movie, Category, Pagination } from '../core/models/movie.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  template: `
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Welcome to Movies App</h1>
        <p class="hero-subtitle">Discover, Rate, and Review Your Favorite Movies</p>
        <div class="hero-search">
          <div class="input-group">
            <input type="text" 
                   class="form-control" 
                   placeholder="Search for movies..." 
                   [(ngModel)]="searchQuery"
                   (keyup.enter)="onSearch()">
            <button class="btn btn-danger" (click)="onSearch()">
              <i class="material-icons">search</i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Featured Movies Section -->
    <section class="featured-section">
      <div class="container">
        <div class="section-header">
          <h2>Featured Movies</h2>
          <a [routerLink]="['/movies']" class="view-all">View All <i class="material-icons">arrow_forward</i></a>
        </div>
        <div class="featured-slider">
          <div class="row g-4">
            <div class="col-md-4" *ngFor="let movie of featuredMovies">
              <div class="movie-card featured">
                <div class="movie-poster">
                  <img src="assets/IbrahimAlabyad.jpg" [alt]="movie.title">
                  <div class="movie-rating">
                    <i class="material-icons">star</i>
                    <span>{{ movie.rating }}/10</span>
                  </div>
                </div>
                <div class="movie-info">
                  <h3 class="movie-title">{{ movie.title }}</h3>
                  <p class="movie-description">{{ movie.description | slice:0:100 }}...</p>
                  <a [routerLink]="['/movies', movie.id]" class="btn btn-outline-danger">View Details</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories-section">
      <div class="container">
        <div class="section-header" style="color: white;">
          <h2>Browse by Category</h2>
        </div>
        <div class="categories-grid">
          <a *ngFor="let category of categories"
             [routerLink]="['/movies']"
             [queryParams]="{category: category.id}"
             class="category-card">
            <div class="category-icon">
              <i class="material-icons">movie</i>
            </div>
            <h3>{{ category.name }}</h3>
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
                  url('/assets/images/hero-bg.jpg') center/cover;
      height: 500px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: white;
      margin-bottom: 4rem;
    }

    .hero-content {
      max-width: 800px;
      padding: 0 1rem;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .hero-subtitle {
      font-size: 1.5rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .hero-search {
      max-width: 600px;
      margin: 0 auto;
    }

    .hero-search .input-group {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50px;
      padding: 0.5rem;
    }

    .hero-search input {
      background: transparent;
      border: none;
      color: white;
      padding: 0.75rem 1.5rem;
    }

    .hero-search input::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }

    .hero-search .btn {
      border-radius: 50px;
      padding: 0.75rem 1.5rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .section-header h2 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0;
    }

    .view-all {
      color: #e50914;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .view-all:hover {
      color: #b82525;
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

    .categories-section {
      background: #141414;
      padding: 4rem 0;
      margin: 4rem 0;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .category-card {
      background: #1a1a1a;
      border-radius: 10px;
      padding: 2rem;
      text-align: center;
      color: white;
      text-decoration: none;
      transition: transform 0.3s ease, background-color 0.3s ease;
    }

    .category-card:hover {
      transform: translateY(-5px);
      background: #242424;
    }

    .category-icon {
      font-size: 2.5rem;
      color: #e50914;
      margin-bottom: 1rem;
    }

    .category-card h3 {
      font-size: 1.25rem;
      font-weight: 500;
      margin: 0;
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2.5rem;
      }

      .hero-subtitle {
        font-size: 1.25rem;
      }

      .section-header h2 {
        font-size: 1.75rem;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredMovies: Movie[] = [];
  categories: Category[] = [];
  searchQuery: string = '';

  constructor(
    private movieService: MovieService,
    private categoryService: CategoryService,
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
      },
      error: (error: Error) => {
        console.error('Error loading featured movies:', error);
      }
    });
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
}
