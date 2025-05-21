import { AddReviewDTO } from './../../models/review.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewService } from '../../../app/core/services/review.service';
import { Review } from '../../../app/models/review.model';

@Component({
  selector: 'app-review-form',
  template: `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Write a Review</h5>
        <form [formGroup]="reviewForm" (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label for="rating" class="form-label">Rating</label>
            <input type="number" class="form-control" id="rating" formControlName="rating" min="1" max="10">
            <div class="text-danger" *ngIf="reviewForm.get('rating')?.touched && reviewForm.get('rating')?.errors?.['required']">
              Rating is required
            </div>
            <div class="text-danger" *ngIf="reviewForm.get('rating')?.touched && reviewForm.get('rating')?.errors?.['min'] || reviewForm.get('rating')?.errors?.['max']">
              Rating must be between 1 and 10
            </div>
          </div>

          <div class="mb-3">
            <label for="comment" class="form-label">Comment</label>
            <textarea class="form-control" id="comment" rows="3" formControlName="comment"></textarea>
            <div class="text-danger" *ngIf="reviewForm.get('comment')?.touched && reviewForm.get('comment')?.errors?.['required']">
              Comment is required
            </div>
          </div>

          <button type="submit" class="btn btn-primary" [disabled]="!reviewForm.valid">
            {{isEditMode ? 'Update' : 'Submit'}} Review
          </button>
        </form>
      </div>
    </div>
  `
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
