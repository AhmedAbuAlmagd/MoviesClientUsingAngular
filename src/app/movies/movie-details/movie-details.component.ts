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
    <div class="container" *ngIf="movie">
      <div class="row">
        <div class="col-md-4">
          <img [src]="movie.poster" class="img-fluid rounded" [alt]="movie.title">
        </div>
        <div class="col-md-8">
          <h1>{{movie.title}}</h1>
          <p class="text-muted">Released: {{movie.releaseDate | date}}</p>
          <div class="mb-3">
            <span class="badge bg-primary me-2" *ngFor="let category of movie.categories">{{category.name}}</span>
          </div>
          <p>{{movie.description}}</p>
          <div class="mb-3">
            <strong>Rating:</strong> {{movie.rating}}/10
          </div>
          <div class="mb-3" *ngIf="movie.trailer">
            <h4>Trailer</h4>
            <video [src]="movie.trailer" controls class="w-100"></video>
          </div>
          <div class="mb-3" *ngIf="isAdmin()">
            <a [routerLink]="['/movies/edit', movie.id]" class="btn btn-primary me-2">Edit</a>
            <button class="btn btn-danger" (click)="deleteMovie()">Delete</button>
          </div>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-12">
          <h3>Reviews</h3>
          <div class="mb-4" *ngIf="isAuthenticated()">
                <app-review-form [movieId]="movie.id" (reviewAdded)="loadReviews()"></app-review-form>
           </div>
          <app-review-list [movieId]="movie.id"></app-review-list>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .badge {
      font-size: 0.9em;
      padding: 0.5em 1em;
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
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMovie(+id);
    }
  }

  loadMovie(id: number): void {
    this.movieService.getMovie(id).subscribe(
      (movie: Movie) => {
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
