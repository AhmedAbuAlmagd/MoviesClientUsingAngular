import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewService } from '../../core/services/review.service';

@Component({
  selector: 'app-review-form',
  template: `
    <form [formGroup]="reviewForm" (ngSubmit)="onSubmit()" class="review-form">
      <div class="form-group mb-4">
        <label class="form-label">Rating (1-10)</label>
        <div class="rating-input">
          <input type="number" 
                 formControlName="rating" 
                 class="form-control" 
                 min="1" 
                 max="10" 
                 placeholder="Enter rating (1-10)">
        </div>
        <div *ngIf="reviewForm.get('rating')?.touched && reviewForm.get('rating')?.errors?.['required']" 
             class="error-message">
          Please enter a rating
        </div>
        <div *ngIf="reviewForm.get('rating')?.touched && reviewForm.get('rating')?.errors?.['min']" 
             class="error-message">
          Rating must be at least 1
        </div>
        <div *ngIf="reviewForm.get('rating')?.touched && reviewForm.get('rating')?.errors?.['max']" 
             class="error-message">
          Rating cannot exceed 10
        </div>
      </div>
      <div class="form-group mb-4">
        <label class="form-label">Your Review</label>
        <textarea formControlName="comment" 
                  class="form-control" 
                  rows="4" 
                  placeholder="Write your review here..."></textarea>
        <div *ngIf="reviewForm.get('comment')?.touched && reviewForm.get('comment')?.errors?.['required']" 
             class="error-message">
          Please write a review
        </div>
        <div *ngIf="reviewForm.get('comment')?.touched && reviewForm.get('comment')?.errors?.['minlength']" 
             class="error-message">
          Review must be at least 10 characters long
        </div>
      </div>
      <div class="form-actions">
        <button type="submit" 
                class="submit-btn" 
                [disabled]="!reviewForm.valid || isSubmitting">
          <i class="material-icons">send</i>
          {{ isSubmitting ? 'Submitting...' : 'Submit Review' }}
        </button>
      </div>
      <div *ngIf="errorMessage" class="error-message mt-3">
        {{ errorMessage }}
      </div>
    </form>
  `,
  styles: [`
    .review-form {
      color: white;
    }

    .form-label {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: #e50914;
    }

    .rating-input {
      margin-bottom: 1rem;
    }

    .form-control {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      color: white;
      padding: 1rem;
      font-size: 1.1rem;
      transition: all 0.3s ease;

      &:focus {
        background: rgba(255, 255, 255, 0.15);
        border-color: #e50914;
        box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.2);
      }

      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }

      &[type="number"] {
        -moz-appearance: textfield;
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      }
    }

    .submit-btn {
      background: #e50914;
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 30px;
      font-size: 1.1rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.8rem;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover:not(:disabled) {
        background: #b82525;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(229, 9, 20, 0.4);
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      i {
        font-size: 1.4rem;
      }
    }

    .error-message {
      color: #e50914;
      font-size: 0.9rem;
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      i {
        font-size: 1.2rem;
      }
    }
  `]
})
export class ReviewFormComponent {
  @Input() movieId!: number;
  @Output() reviewAdded = new EventEmitter<void>();

  reviewForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService
  ) {
    this.reviewForm = this.fb.group({
      rating: [null, [Validators.required, Validators.min(1), Validators.max(10)]],
      comment: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.reviewForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = null;
      const review = this.reviewForm.value;

      this.reviewService.createReview(this.movieId, review).subscribe({
        next: () => {
          this.reviewForm.reset();
          this.reviewForm.patchValue({ rating: null });
          this.reviewAdded.emit();
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error submitting review:', error);
          this.errorMessage = error.error?.message || 'Failed to submit review. Please try again.';
          this.isSubmitting = false;
        }
      });
    } else {
      this.reviewForm.markAllAsTouched();
    }
  }
} 