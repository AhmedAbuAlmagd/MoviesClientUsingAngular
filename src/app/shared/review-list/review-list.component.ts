import { Component, Input, OnInit } from '@angular/core';
import { ReviewService } from '../../core/services/review.service';
import { Review } from '../../core/models/review.model';

@Component({
  selector: 'app-review-list',
  template: `
    <div class="reviews-list">
      <div *ngIf="reviews.length === 0" class="no-reviews">
        <i class="material-icons">rate_review</i>
        <p>No reviews yet. Be the first to review this movie!</p>
      </div>
      <div *ngFor="let review of reviews" class="review-card">
        <div class="review-header">
          <div class="reviewer-info">
            <i class="material-icons">account_circle</i>
            <span class="reviewer-name">{{ review.userName }}</span>
          </div>
          <div class="review-rating">
            <i class="material-icons">star</i>
            <span>{{ review.rating }}/10</span>
          </div>
        </div>
        <p class="review-comment">{{ review.comment }}</p>
        <div class="review-date">
          <i class="material-icons">schedule</i>
          <span>{{ review.createdAt | date:'medium' }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .no-reviews {
      text-align: center;
      padding: 3rem;
      background: rgba(26, 26, 26, 0.95);
      border-radius: 15px;
      color: rgba(255, 255, 255, 0.7);

      i {
        font-size: 3rem;
        color: #e50914;
        margin-bottom: 1rem;
      }

      p {
        font-size: 1.2rem;
        margin: 0;
      }
    }

    .review-card {
      background: rgba(26, 26, 26, 0.95);
      border-radius: 15px;
      padding: 2rem;
      border: 1px solid rgba(229, 9, 20, 0.1);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        border-color: rgba(229, 9, 20, 0.2);
      }
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .reviewer-info {
      display: flex;
      align-items: center;
      gap: 0.8rem;

      i {
        font-size: 2rem;
        color: #e50914;
      }

      .reviewer-name {
        font-size: 1.2rem;
        font-weight: 600;
        color: white;
      }
    }

    .review-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(229, 9, 20, 0.1);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      color: #ffd700;

      i {
        font-size: 1.2rem;
      }

      span {
        font-weight: 600;
      }
    }

    .review-comment {
      color: #ccc;
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .review-date {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.9rem;

      i {
        font-size: 1.1rem;
      }
    }
  `]
})
export class ReviewListComponent implements OnInit {
  @Input() movieId!: number;
  reviews: Review[] = [];

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.reviewService.getMovieReviews(this.movieId).subscribe({
      next: (reviews: Review[]) => {
        this.reviews = reviews;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
      }
    });
  }
} 