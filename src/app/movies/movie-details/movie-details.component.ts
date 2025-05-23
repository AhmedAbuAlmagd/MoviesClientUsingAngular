import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../core/services/movie.service';
import { ReviewService } from '../../core/services/review.service';
import { Movie } from '../../core/models/movie.model';
import { Review } from '../../core/models/review.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-movie-details',
  template: `
    <div class="movie-details-container" *ngIf="movie">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-content">
          <div class="container">
            <div class="row align-items-center">
              <div class="col-md-4">
                <div class="movie-poster">
                  <img [src]="movie.poster" class="img-fluid rounded" [alt]="movie.title">
                  <div class="movie-rating">
                    <i class="material-icons">star</i>
                    <span>{{movie.rating}}/10</span>
                  </div>
                </div>
              </div>
              <div class="col-md-8">
                <h1 class="movie-title">{{movie.title}}</h1>
                <p class="movie-release-date">
                  <i class="material-icons">calendar_today</i>
                  Released: {{movie.releaseDate | date}}
                </p>
                <div class="movie-categories">
                  <span *ngFor="let category of movie.categories"
                        class="category-badge">
                    <i class="material-icons">{{ getCategoryIcon(category.name) }}</i>
                    <span>{{category.name}}</span>
                  </span>
                </div>
                <p class="movie-description">{{movie.description}}</p>
                <div class="movie-actions" *ngIf="isAdmin()">
                  <a [routerLink]="['/movies/edit', movie.id]" class="btn btn-outline-light me-2">
                    <i class="material-icons">edit</i> Edit
                  </a>
                  <button class="btn btn-danger" (click)="deleteMovie()">
                    <i class="material-icons">delete</i> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Trailer Section -->
      <section class="trailer-section" *ngIf="movie.trailer">
        <div class="container">
          <div class="section-header">
            <h2><i class="material-icons">movie</i> Trailer</h2>
          </div>
          <div class="trailer-container">
            <video [src]="movie.trailer" controls class="w-100 rounded"></video>
          </div>
        </div>
      </section>

      <!-- Reviews Section -->
      <section class="reviews-section">
        <div class="container">
          <div class="section-header">
            <h2><i class="material-icons">rate_review</i> Reviews</h2>
          </div>
          <div class="review-form-container mb-4" *ngIf="isAuthenticated()">
            <app-review-form [movieId]="movie.id" (reviewAdded)="loadReviews()"></app-review-form>
          </div>
          <app-review-list [movieId]="movie.id"></app-review-list>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .movie-details-container {
      background: #141414;
      color: white;
      min-height: 100vh;
    }

    .hero-section {
      background: linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)),
                  url('/assets/images/hero-bg.jpg') center/cover;
      padding: 8rem 0;
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
      padding: 2rem 0;
      position: relative;
      z-index: 1;
    }

    .movie-poster {
      position: relative;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
      transition: all 0.4s ease;
      transform: perspective(1000px) rotateY(-5deg);
    }

    .movie-poster:hover {
      transform: perspective(1000px) rotateY(0deg) scale(1.02);
      box-shadow: 0 20px 50px rgba(229, 9, 20, 0.3);
    }

    .movie-poster img {
      width: 100%;
      height: auto;
      display: block;
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

    .movie-title {
      font-size: 4rem;
      font-weight: 900;
      margin-bottom: 1.5rem;
      color: white;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      line-height: 1.1;
      letter-spacing: -0.5px;
      background: linear-gradient(to right, #fff, #e50914);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .movie-release-date {
      color: #999;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.8rem;
      font-size: 1.1rem;
    }

    .movie-release-date .material-icons {
      color: #e50914;
    }

    .movie-categories {
      margin-bottom: 2.5rem;
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .category-badge {
      background: rgba(229, 9, 20, 0.15);
      color: #e50914;
      padding: 0.8rem 1.5rem;
      border-radius: 30px;
      font-size: 1.1rem;
      font-weight: 600;
      border: 2px solid #e50914;
      transition: all 0.4s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.8rem;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .category-badge::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #e50914;
      transform: translateX(-100%);
      transition: transform 0.4s ease;
      z-index: 0;
    }

    .category-badge:hover {
      color: white;
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(229, 9, 20, 0.4);
    }

    .category-badge:hover::before {
      transform: translateX(0);
    }

    .category-badge i,
    .category-badge span {
      position: relative;
      z-index: 1;
    }

    .category-badge i {
      font-size: 1.2rem;
    }

    .movie-description {
      color: #ccc;
      font-size: 1.2rem;
      line-height: 1.8;
      margin-bottom: 2.5rem;
      max-width: 800px;
    }

    .movie-actions {
      margin-top: 2.5rem;
      display: flex;
      gap: 1rem;
    }

    .movie-actions .btn {
      padding: 0.8rem 1.5rem;
      display: inline-flex;
      align-items: center;
      gap: 0.8rem;
      font-weight: 600;
      border-radius: 25px;
      transition: all 0.3s ease;
    }

    .movie-actions .btn-outline-light {
      border: 2px solid white;
    }

    .movie-actions .btn-outline-light:hover {
      background: white;
      color: #141414;
      transform: translateY(-2px);
    }

    .movie-actions .btn-danger {
      background: #e50914;
      border: 2px solid #e50914;
    }

    .movie-actions .btn-danger:hover {
      background: #b82525;
      border-color: #b82525;
      transform: translateY(-2px);
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 3.5rem;
      position: relative;
    }

    .section-header h2 {
      font-size: 3rem;
      font-weight: 900;
      margin: 0;
      color: white;
      text-transform: uppercase;
      letter-spacing: 2px;
      background: linear-gradient(to right, #fff, #e50914);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .section-header .material-icons {
      font-size: 3rem;
      color: #e50914;
      filter: drop-shadow(0 0 10px rgba(229, 9, 20, 0.5));
    }

    .trailer-section {
      padding: 6rem 0;
      background: #1a1a1a;
      position: relative;
    }

    .trailer-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(to right, transparent, #e50914, transparent);
    }

    .trailer-container {
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      aspect-ratio: 16/9;
    }

    .trailer-container video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .reviews-section {
      padding: 8rem 0;
      background: #141414;
      position: relative;
    }

    .reviews-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(to right, transparent, #e50914, transparent);
      box-shadow: 0 0 20px rgba(229, 9, 20, 0.3);
    }

    .review-form-container {
      background: rgba(26, 26, 26, 0.95);
      padding: 3rem;
      border-radius: 25px;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
      margin-bottom: 4rem;
      border: 1px solid rgba(229, 9, 20, 0.1);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }

    .review-form-container:hover {
      box-shadow: 0 20px 50px rgba(229, 9, 20, 0.2);
      border-color: rgba(229, 9, 20, 0.2);
    }

    @media (max-width: 768px) {
      .hero-section {
        padding: 6rem 0;
      }

      .movie-title {
        font-size: 2.8rem;
      }

      .movie-poster {
        margin-bottom: 2.5rem;
        transform: none;
      }

      .movie-poster:hover {
        transform: scale(1.02);
      }

      .section-header h2 {
        font-size: 2.2rem;
      }

      .review-form-container {
        padding: 2rem;
      }
    }
  `]
})
export class MovieDetailsComponent implements OnInit {
  movie?: Movie;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private reviewService: ReviewService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && id !== 'add') {
        this.loadMovie(+id);
      } else {
        // If we're in add mode, redirect to the form
        this.router.navigate(['/movies/form/add']);
      }
    });
  }

  loadMovie(id: number): void {
    if (isNaN(id)) {
      console.error('Invalid movie ID');
      return;
    }

    this.movieService.getMovie(id).subscribe({
      next: (movie: Movie) => {
        this.movie = movie;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading movie:', error);
        this.loading = false;
        // Handle error appropriately
      }
    });
  }

  loadReviews(): void {
    if (this.movie) {
      this.reviewService.getMovieReviews(this.movie.id).subscribe(
        (reviews: Review[]) => {
        },
        (error: Error) => {
          console.error('Error loading reviews:', error);
        }
      );
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
