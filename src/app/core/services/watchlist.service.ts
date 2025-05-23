import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private apiUrl = `${environment.apiUrl}/api/Watchlist`;

  constructor(private http: HttpClient) { }

  getUserWatchlist(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addToWatchlist(movieId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${movieId}`, {});
  }

  removeFromWatchlist(movieId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${movieId}`);
  }

  isInWatchlist(movieId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/Check/${movieId}`);
  }
} 