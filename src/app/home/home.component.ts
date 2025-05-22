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
          <div class="featured-grid">
            <div class="movie-card" *ngFor="let movie of featuredMovies">
              <div class="movie-poster">
                <img src="{{movie.poster}}" [alt]="movie.title">
                <div class="movie-rating">
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

    .featured-section {
      background: #141414;
      padding: 4rem 0;
      margin: 4rem 0;
      position: relative;
    }

    .featured-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(to right, transparent, #e50914, transparent);
    }

    .featured-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      padding: 0 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .movie-card {
      position: relative;
      background: linear-gradient(145deg, #1a1a1a, #242424);
      border-radius: 20px;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
    }

    .movie-card:hover {
      transform: translateY(-10px) scale(1.02);
      box-shadow: 0 20px 40px rgba(229, 9, 20, 0.2);
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
      top: 1rem;
      right: 1rem;
      background: rgba(0, 0, 0, 0.8);
      color: #ffd700;
      padding: 0.8rem 1.2rem;
      border-radius: 25px;
      display: flex;
      align-items: center;
      gap: 0.8rem;
      font-weight: 700;
      font-size: 1.2rem;
      backdrop-filter: blur(4px);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }

    .movie-rating .material-icons {
      font-size: 1.4rem;
      color: #ffd700;
    }

    .movie-rating span {
      font-size: 1.2rem;
    }

    .movie-content {
      padding: 1.5rem;
      background: black;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .movie-title {
      font-size: 1.4rem;
      font-weight: 700;
      margin-bottom: 0.8rem;
      color: white;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    }

    .movie-description {
      color: #999;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      line-height: 1.5;
      flex: 1;
    }

    .btn-view-details {
      margin-top: auto;
      display: inline-block;
      padding: 0.8rem 1.5rem;
      color: #e50914;
      text-decoration: none;
      border-radius: 25px;
      font-weight: 600;
      transition: all 0.3s ease;
      border: 2px solid #e50914;
      cursor: pointer;
      text-align: center;
      width: 100%;
      background: transparent;
    }

    .btn-view-details:hover {
      background: #e50914;
      color: white;
      transform: translateY(-2px);
    }

    .categories-section {
      background: #141414;
      padding: 4rem 0;
      margin: 4rem 0;
      position: relative;
    }

    .categories-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(to right, transparent, #e50914, transparent);
    }

    .section-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .section-header h2 {
      font-size: 2.8rem;
      font-weight: 800;
      margin-bottom: 1rem;
      color: white;
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .section-subtitle {
      color: #999;
      font-size: 1.1rem;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      padding: 0 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .category-card {
      position: relative;
      background: linear-gradient(145deg, #1a1a1a, #242424);
      border-radius: 20px;
      overflow: hidden;
      text-decoration: none;
      color: white;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      aspect-ratio: 16/9;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }

    .category-card:hover {
      transform: translateY(-10px) scale(1.02);
      box-shadow: 0 20px 40px rgba(229, 9, 20, 0.2);
    }

    .category-content {
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2.5rem;
      background: linear-gradient(45deg, rgba(229, 9, 20, 0.15), rgba(229, 9, 20, 0.05));
      z-index: 1;
    }

    .category-icon {
      font-size: 4.5rem;
      color: #e50914;
      margin-bottom: 1.5rem;
      transition: all 0.4s ease;
      filter: drop-shadow(0 2px 4px rgba(229, 9, 20, 0.3));
      background: rgba(229, 9, 20, 0.1);
      width: 100px;
      height: 100px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .category-card:hover .category-icon {
      transform: scale(1.2) rotate(5deg);
      background: rgba(229, 9, 20, 0.2);
    }

    .category-card h3 {
      font-size: 1.8rem;
      font-weight: 700;
      margin: 0;
      text-align: center;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
      letter-spacing: 0.5px;
    }

    .category-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, rgba(229, 9, 20, 0.95), rgba(229, 9, 20, 0.85));
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.8rem;
      opacity: 0;
      transition: all 0.4s ease;
      backdrop-filter: blur(4px);
    }

    .category-card:hover .category-overlay {
      opacity: 1;
    }

    .explore-text {
      font-size: 1.4rem;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .category-overlay .material-icons {
      font-size: 1.8rem;
      transition: transform 0.3s ease;
    }

    .category-card:hover .category-overlay .material-icons {
      transform: translateX(5px);
    }

    @media (max-width: 1200px) {
      .featured-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .movie-poster {
        height: 350px;
      }
    }

    @media (max-width: 768px) {
      .section-header h2 {
        font-size: 2.2rem;
      }

      .categories-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        padding: 0 1rem;
      }

      .category-card h3 {
        font-size: 1.5rem;
      }

      .category-icon {
        font-size: 3.5rem;
        width: 85px;
        height: 85px;
      }

      .featured-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
        padding: 0 1rem;
      }

      .movie-title {
        font-size: 1.5rem;
      }

      .movie-content {
        padding: 1.5rem;
      }

      .movie-poster {
        height: 300px;
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
