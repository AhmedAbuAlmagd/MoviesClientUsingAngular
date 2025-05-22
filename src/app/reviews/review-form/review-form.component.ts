import { AddReviewDTO } from './../../models/review.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewService } from '../../../app/core/services/review.service';
import { Review } from '../../../app/models/review.model';

@Component({
  selector: 'app-review-form',
  template: `
    <div class="review-form">
      <h3 class="form-title">
        <i class="material-icons">rate_review</i>
        Write a Review
      </h3>
      <form [formGroup]="reviewForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="rating">
            <i class="material-icons">star</i>
            Rating
          </label>
          <div class="rating-input">
            <input type="number" 
                   id="rating" 
                   formControlName="rating" 
                   min="1" 
                   max="10"
                   class="form-control">
            <span class="rating-hint">/10</span>
          </div>
          <div class="error-message" *ngIf="reviewForm.get('rating')?.touched && reviewForm.get('rating')?.errors?.['required']">
            Rating is required
          </div>
          <div class="error-message" *ngIf="reviewForm.get('rating')?.touched && reviewForm.get('rating')?.errors?.['min'] || reviewForm.get('rating')?.errors?.['max']">
            Rating must be between 1 and 10
          </div>
        </div>

        <div class="form-group">
          <label for="comment">
            <i class="material-icons">comment</i>
            Your Review
          </label>
          <textarea id="comment" 
                    rows="4" 
                    formControlName="comment"
                    class="form-control"
                    placeholder="Share your thoughts about the movie..."></textarea>
          <div class="error-message" *ngIf="reviewForm.get('comment')?.touched && reviewForm.get('comment')?.errors?.['required']">
            Please write your review
          </div>
        </div>

        <button type="submit" 
                class="submit-button" 
                [disabled]="!reviewForm.valid">
          <i class="material-icons">{{isEditMode ? 'edit' : 'send'}}</i>
          {{isEditMode ? 'Update' : 'Submit'}} Review
        </button>
      </form>
    </div>
  `,
  styles: [`
    .review-form {
      background: rgba(26, 26, 26, 0.95);
      border-radius: 15px;
      padding: 2rem;
      border: 1px solid rgba(229, 9, 20, 0.1);
      backdrop-filter: blur(10px);
    }

    .form-title {
      display: flex;
      align-items: center;
      gap: 1rem;
      color: white;
      font-size: 1.8rem;
      font-weight: 600;
      margin-bottom: 2rem;
    }

    .form-title .material-icons {
      color: #e50914;
      font-size: 2.2rem;
    }

    .form-group {
      margin-bottom: 1.8rem;
    }

    .form-group label {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      color: #ccc;
      margin-bottom: 0.8rem;
      font-size: 1.3rem;
    }

    .form-group .material-icons {
      color: #e50914;
      font-size: 1.5rem;
    }

    .form-control {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: white;
      padding: 1rem 1.2rem;
      width: 100%;
      transition: all 0.3s ease;
      font-size: 1.2rem;
    }

    .form-control:focus {
      outline: none;
      border-color: #e50914;
      box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.2);
    }

    .form-control::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    .rating-input {
      position: relative;
      display: flex;
      align-items: center;
    }

    .rating-hint {
      position: absolute;
      right: 1.2rem;
      color: rgba(255, 255, 255, 0.5);
      font-size: 1.2rem;
    }

    .error-message {
      color: #ff4444;
      font-size: 1.1rem;
      margin-top: 0.8rem;
    }

    .submit-button {
      display: inline-flex;
      align-items: center;
      gap: 1rem;
      background: #e50914;
      color: white;
      border: none;
      padding: 1.2rem 2.5rem;
      border-radius: 25px;
      font-size: 1.3rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .submit-button:hover:not(:disabled) {
      background: #b82525;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(229, 9, 20, 0.4);
    }

    .submit-button:disabled {
      background: rgba(229, 9, 20, 0.5);
      cursor: not-allowed;
    }

    .submit-button .material-icons {
      font-size: 1.5rem;
    }

    @media (max-width: 768px) {
      .review-form {
        padding: 1.8rem;
      }

      .form-title {
        font-size: 1.6rem;
      }

      .form-title .material-icons {
        font-size: 2rem;
      }

      .form-group label {
        font-size: 1.2rem;
      }

      .form-control {
        font-size: 1.1rem;
      }

      .submit-button {
        font-size: 1.2rem;
        padding: 1rem 2rem;
      }
    }
  `]
})
export class ReviewFormComponent implements OnInit {
  @Input() movieId!: number;
  @Input() review?: Review;
  @Output() reviewAdded = new EventEmitter<void>();

  reviewForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService
  ) {
    this.reviewForm = this.fb.group({
      rating: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      comment: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.review) {
      this.isEditMode = true;
      this.reviewForm.patchValue({
        rating: this.review.rating,
        comment: this.review.comment
      });
    }
  }

  onSubmit(): void {
    if (this.reviewForm.valid) {
      const reviewValue = this.reviewForm.value;

      if (this.isEditMode && this.review) {
        this.reviewService.updateReview(this.review!.id!, {
          rating: reviewValue.rating,
          comment: reviewValue.comment
        }).subscribe(() => {
          this.reviewAdded.emit();
          this.reviewForm.reset();
        });
      } else {
        this.reviewService.createReview(this.movieId, {
          rating: reviewValue.rating,
          comment: reviewValue.comment
        }).subscribe(() => {
          this.reviewAdded.emit();
          this.reviewForm.reset();
        });
      }
    }
  }
}
