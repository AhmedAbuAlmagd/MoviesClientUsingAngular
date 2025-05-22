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
                  <span class="category-badge" *ngFor="let category of movie.categories">
                    {{category.name}}
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
    }

    .hero-section {
      background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
                  url('/assets/images/hero-bg.jpg') center/cover;
      padding: 4rem 0;
      margin-bottom: 2rem;
    }

    .hero-content {
      padding: 2rem 0;
    }

    .movie-poster {
      position: relative;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    }

    .movie-poster img {
      width: 100%;
      height: auto;
      transition: transform 0.3s ease;
    }

    .movie-poster:hover img {
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

    .movie-title {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: white;
    }

    .movie-release-date {
      color: #999;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .movie-categories {
      margin-bottom: 1.5rem;
    }

    .category-badge {
      background: #e50914;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      margin-right: 0.5rem;
      font-size: 0.9rem;
      display: inline-block;
    }

    .movie-description {
      color: #ccc;
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .movie-actions {
      margin-top: 2rem;
    }

    .movie-actions .btn {
      padding: 0.75rem 1.5rem;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }

    .section-header h2 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0;
      color: white;
    }

    .trailer-section {
      padding: 4rem 0;
      background: #1a1a1a;
    }

    .trailer-container {
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    }

    .reviews-section {
      padding: 4rem 0;
    }

    .review-form-container {
      background: #1a1a1a;
      padding: 2rem;
      border-radius: 10px;
    }

    @media (max-width: 768px) {
      .movie-title {
        font-size: 2rem;
      }

      .hero-section {
        padding: 2rem 0;
      }

      .movie-poster {
        margin-bottom: 2rem;
      }
    }
  `]
})
export class MovieDetailsComponent implements OnInit {
  movie?: Movie;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private reviewService: ReviewService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    console.log('Route params:', this.route.snapshot.params);
    console.log('Route paramMap:', this.route.snapshot.paramMap);
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Movie ID from route:', id);
    console.log('Movie ID type:', typeof id);
    if (id) {
      this.loadMovie(+id);
    } else {
      console.error('No movie ID found in route parameters');
    }
  }

  loadMovie(id: number): void {
    console.log('Loading movie with ID:', id);
    console.log('ID type:', typeof id);
    this.movieService.getMovie(id).subscribe(
      (movie: Movie) => {
        console.log('Movie loaded:', movie);
        this.movie = movie;
      },
      (error: Error) => {
        console.error('Error loading movie:', error);
      }
    );
  }

  loadReviews(): void {
    if (this.movie) {
      this.reviewService.getMovieReviews(this.movie.id).subscribe(
        (reviews: Review[]) => {
          // Reviews are handled by the ReviewListComponent
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
}
