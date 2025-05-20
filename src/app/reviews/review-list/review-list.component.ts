import { Component, Input, OnInit } from '@angular/core';
import { ReviewService } from '../../core/services/review.service';
import { Review } from '../../core/models/review.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-review-list',
  template: `
    <div class="reviews">
      <div class="review" *ngFor="let review of reviews">
        <div class="card mb-3">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h5 class="card-title mb-0">{{review.userName}}</h5>
              <span class="badge bg-primary">{{review.rating}}/10</span>
            </div>
            <p class="card-text">{{review.comment}}</p>
            <div class="text-end" *ngIf="canEditReview(review)">
              <button class="btn btn-sm btn-primary me-2" (click)="editReview(review)">Edit</button>
              <button class="btn btn-sm btn-danger" (click)="deleteReview(review)">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .review {
      margin-bottom: 1rem;
    }
    .badge {
      font-size: 0.9em;
      padding: 0.5em 1em;
    }
  `]
})
export class ReviewListComponent implements OnInit {
  @Input() movieId!: number;
  reviews: Review[] = [];

  constructor(
    private reviewService: ReviewService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.reviewService.getMovieReviews(this.movieId).subscribe(
      (reviews: Review[]) => {
        this.reviews = reviews;
      },
      (error: Error) => {
        console.error('Error loading reviews:', error);
      }
    );
  }

  canEditReview(review: Review): boolean {
    const currentUserId = this.authService.getUserId();
    return this.authService.isAuthenticated() && currentUserId !== null && review.userId === currentUserId;
  }

  editReview(review: Review): void {
    // Implement edit functionality
  }

  deleteReview(review: Review): void {
    if (confirm('Are you sure you want to delete this review?')) {
      this.reviewService.deleteReview(review.id).subscribe(
        () => {
          this.loadReviews();
        },
        (error: Error) => {
          console.error('Error deleting review:', error);
        }
      );
    }
  }
} 