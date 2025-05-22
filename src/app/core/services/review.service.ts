import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  constructor(private http: HttpClient) { }

  getMovieReviews(movieId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${environment.apiUrl}/api/review/getall?movieId=${movieId}`);
  }

  createReview(movieId: number, review: { rating: number; comment: string }): Observable<Review> {
    return this.http.post<Review>(`${environment.apiUrl}/api/review/add`, { ...review, movieId });
  }

  updateReview(reviewId: number, review: { rating: number; comment: string }): Observable<Review> {
    return this.http.put<Review>(`${environment.apiUrl}/api/review/edit`, { ...review, id: reviewId });
  }

  deleteReview(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/review/delete?movieId=${reviewId}`);
  }
} 