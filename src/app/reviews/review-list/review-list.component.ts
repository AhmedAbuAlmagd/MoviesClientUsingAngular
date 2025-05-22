import { Component, Input, OnInit } from '@angular/core';
import { ReviewService } from '../../core/services/review.service';
import { Review } from '../../core/models/review.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-review-list',
  template: `
    <div class="reviews-container">
      <div class="review-card" *ngFor="let review of reviews">
        <div class="review-header">
          <div class="reviewer-info">
            <i class="material-icons">account_circle</i>
            <span class="reviewer-name">{{review.userName}}</span>
          </div>
          <div class="review-rating">
            <i class="material-icons">star</i>
            <span>{{review.rating}}/10</span>
          </div>
        </div>
        <div class="review-content">
          <p class="review-text">{{review.comment}}</p>
        </div>
        <div class="review-actions" *ngIf="canEditReview(review)">
          <button class="btn-edit" (click)="editReview(review)">
            <i class="material-icons">edit</i>
            Edit
          </button>
          <button class="btn-delete" (click)="deleteReview(review)">
            <i class="material-icons">delete</i>
            Delete
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reviews-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .review-card {
      background: rgba(26, 26, 26, 0.95);
      border-radius: 15px;
      padding: 1.5rem;
      border: 1px solid rgba(229, 9, 20, 0.1);
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .review-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(229, 9, 20, 0.1);
      border-color: rgba(229, 9, 20, 0.2);
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .reviewer-info {
      display: flex;
      align-items: center;
      gap: 0.8rem;
    }

    .reviewer-info .material-icons {
      color: #e50914;
      font-size: 1.8rem;
    }

    .reviewer-name {
      font-size: 1.4rem;
      font-weight: 600;
      color: white;
    }

    .review-rating {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      background: rgba(229, 9, 20, 0.1);
      padding: 0.8rem 1.5rem;
      border-radius: 25px;
      border: 1px solid rgba(229, 9, 20, 0.2);
    }

    .review-rating .material-icons {
      color: #ffd700;
      font-size: 1.8rem;
    }

    .review-rating span {
      color: #ffd700;
      font-weight: 600;
      font-size: 1.4rem;
    }

    .review-content {
      margin-bottom: 1.5rem;
    }

    .review-text {
      color: #ccc;
      line-height: 1.8;
      font-size: 1.2rem;
    }

    .review-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    .btn-edit, .btn-delete {
      display: inline-flex;
      align-items: center;
      gap: 0.8rem;
      padding: 0.8rem 1.5rem;
      border-radius: 25px;
      font-size: 1.1rem;
      font-weight: 500;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
    }

    .btn-edit {
      background: rgba(229, 9, 20, 0.1);
      color: #e50914;
      border: 1px solid rgba(229, 9, 20, 0.2);
    }

    .btn-delete {
      background: rgba(255, 0, 0, 0.1);
      color: #ff4444;
      border: 1px solid rgba(255, 0, 0, 0.2);
    }

    .btn-edit:hover {
      background: #e50914;
      color: white;
      transform: translateY(-2px);
    }

    .btn-delete:hover {
      background: #ff4444;
      color: white;
      transform: translateY(-2px);
    }

    .btn-edit .material-icons, .btn-delete .material-icons {
      font-size: 1.4rem;
    }

    @media (max-width: 768px) {
      .review-card {
        padding: 1.2rem;
      }

      .reviewer-name {
        font-size: 1.2rem;
      }

      .review-rating {
        padding: 0.6rem 1.2rem;
      }

      .review-rating .material-icons {
        font-size: 1.5rem;
      }

      .review-rating span {
        font-size: 1.2rem;
      }

      .review-text {
        font-size: 1.1rem;
      }
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