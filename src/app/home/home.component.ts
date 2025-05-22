import { Component, OnInit } from '@angular/core';
import { MovieService } from '../core/services/movie.service';
import { CategoryService } from '../core/services/category.service';
import { Movie, Category, Pagination } from '../core/models/movie.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  template: `
    <!-- Hero Section -->
    <div class="container">
      <div class="hero-section">
        <div class="hero-content">
        <h1 class="hero-bigtitle" style="color:white;">Welcome to Movies App</h1>
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
          <div class="featured-grid">
            <div class="movie-card" *ngFor="let movie of featuredMovies">
              <div class="movie-poster">
                <img src="{{movie.poster}}" [alt]="movie.title">
                <div class="movie-rating" *ngIf="movie.rating > 0">
                  <i class="material-icons">star</i>
                  <span>{{ movie.rating }}/10</span>
                </div>
              </div>
              <div class="movie-content">
                <h3 class="movie-title">{{ movie.title }}</h3>
                <p class="movie-description">{{ movie.description | slice:0:100 }}...</p>
                <a [routerLink]="['/movies', movie.id]" class="btn-view-details ">View Details</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Categories Section -->
      <section class="categories-section">
        <div class="container">
          <div class="section-header">
            <h2>Browse by Category</h2>
          </div>
          <div class="categories-grid">
            <a *ngFor="let category of categories"
               [routerLink]="['/movies']"
               [queryParams]="{category: category.id}"
               class="category-card">
              <div class="category-content">
                <div class="category-icon">
                  <i class="material-icons">{{ getCategoryIcon(category.name) }}</i>
                </div>
                <h3>{{ category.name }}</h3>
                <div class="category-overlay">
                  <span class="explore-text">Explore</span>
                  <i class="material-icons">arrow_forward</i>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .hero-section {
      background: linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)),
                  url('/assets/images/hero-bg.jpg') center/cover;
      height: 600px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: white;
      margin-bottom: 4rem;
      position: relative;
      overflow: hidden;
    }

    .hero-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(to right, transparent, #e50914, transparent);
      box-shadow: 0 0 20px rgba(229, 9, 20, 0.5);
    }

    .hero-section::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 150px;
      background: linear-gradient(to top, #141414, transparent);
    }

    .hero-content {
      max-width: 800px;
      padding: 0 1rem;
      position: relative;
      z-index: 1;
    }

    .hero-title {
      font-size: 4rem;
      font-weight: 900;
      margin-bottom: 1.5rem;
      background: linear-gradient(to right, #fff, #e50914);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      line-height: 1.1;
      letter-spacing: -0.5px;
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

    .hero-subtitle {
      font-size: 1.8rem;
      margin-bottom: 2.5rem;
      opacity: 0.9;
      color: #ccc;
    }

    .hero-search {
      max-width: 600px;
      margin: 0 auto;
    }

    .hero-search .input-group {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50px;
      padding: 0.5rem;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .hero-search input {
      background: transparent;
      border: none;
      color: white;
      padding: 1rem 1.5rem;
      font-size: 1.1rem;
    }

    .hero-search input::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }

    .hero-search .btn {
      border-radius: 50px;
      padding: 1rem 2rem;
      background: #e50914;
      border: none;
      transition: all 0.3s ease;
    }

    .hero-search .btn:hover {
      background: #b82525;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(229, 9, 20, 0.4);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;
      position: relative;
    }

    .section-header h2 {
      font-size: 3rem;
      font-weight: 900;
      margin: 0;
      background: linear-gradient(to right, #fff, #e50914);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .view-all {
      color: #e50914;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.8rem;
      font-weight: 600;
      font-size: 1.1rem;
      transition: all 0.3s ease;
      padding: 0.8rem 1.5rem;
      border-radius: 30px;
      background: rgba(229, 9, 20, 0.1);
      border: 2px solid #e50914;
    }

    .view-all:hover {
      background: #e50914;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(229, 9, 20, 0.4);
    }

    .featured-section {
      background: #141414;
      padding: 6rem 0;
      margin: 4rem 0;
      position: relative;
    }

    .featured-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(to right, transparent, #e50914, transparent);
      box-shadow: 0 0 20px rgba(229, 9, 20, 0.3);
    }

    .featured-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2.5rem;
      padding: 0 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .movie-card {
      position: relative;
      background: rgba(26, 26, 26, 0.95);
      border-radius: 25px;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(229, 9, 20, 0.1);
      backdrop-filter: blur(10px);
    }

    .movie-card:hover {
      transform: translateY(-10px) scale(1.02);
      box-shadow: 0 20px 50px rgba(229, 9, 20, 0.2);
      border-color: rgba(229, 9, 20, 0.2);
    }

    .movie-poster {
      position: relative;
      overflow: hidden;
      aspect-ratio: 2/3;
      height: 400px;
    }

    .movie-poster img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .movie-card:hover .movie-poster img {
      transform: scale(1.1);
    }

    .movie-rating {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      background: rgba(0, 0, 0, 0.9);
      color: #ffd700;
      padding: 1rem 1.5rem;
      border-radius: 30px;
      display: flex;
      align-items: center;
      gap: 1rem;
      font-weight: 700;
      font-size: 1.3rem;
      backdrop-filter: blur(8px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 215, 0, 0.3);
    }

    .movie-rating .material-icons {
      font-size: 1.4rem;
      color: #ffd700;
    }

    .movie-content {
      padding: 2rem;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }

    .movie-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: white;
    }

    .movie-description {
      color: #ccc;
      margin-bottom: 1.5rem;
      line-height: 1.6;
      flex-grow: 1;
    }

    .btn-view-details {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.8rem;
      padding: 1rem 2rem;
      background: rgba(229, 9, 20, 0.1);
      color: #e50914;
      border: 2px solid #e50914;
      border-radius: 30px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .btn-view-details:hover {
      background: #e50914;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(229, 9, 20, 0.4);
    }

    .categories-section {
      padding: 6rem 0;
      background: #1a1a1a;
      position: relative;
    }

    .categories-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(to right, transparent, #e50914, transparent);
      box-shadow: 0 0 20px rgba(229, 9, 20, 0.3);
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      padding: 0 2rem;
    }

    .category-card {
      position: relative;
      background: rgba(26, 26, 26, 0.95);
      border-radius: 25px;
      overflow: hidden;
      text-decoration: none;
      color: white;
      transition: all 0.4s ease;
      border: 1px solid rgba(229, 9, 20, 0.1);
      backdrop-filter: blur(10px);
    }

    .category-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 50px rgba(229, 9, 20, 0.2);
      border-color: rgba(229, 9, 20, 0.2);
    }

    .category-content {
      padding: 2.5rem;
      text-align: center;
      position: relative;
      z-index: 1;
    }

    .category-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 1.5rem;
      background: rgba(229, 9, 20, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #e50914;
    }

    .category-icon .material-icons {
      font-size: 2.5rem;
      color: #e50914;
    }

    .category-card h3 {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .category-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1.5rem;
      background: linear-gradient(to top, rgba(229, 9, 20, 0.9), transparent);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.8rem;
      opacity: 0;
      transform: translateY(100%);
      transition: all 0.4s ease;
    }

    .category-card:hover .category-overlay {
      opacity: 1;
      transform: translateY(0);
    }

    .explore-text {
      font-weight: 600;
      font-size: 1.1rem;
    }

    @media (max-width: 768px) {
      .hero-section {
        height: 500px;
      }

      .hero-title {
        font-size: 2.8rem;
      }

      .hero-subtitle {
        font-size: 1.4rem;
      }

      .featured-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .section-header h2 {
        font-size: 2.2rem;
      }

      .categories-grid {
        grid-template-columns: 1fr;
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
