import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie.model';
import { environment } from '../../../environments/environment';

export interface Pagination<T> {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  data: T[];
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  constructor(private http: HttpClient) { }

  getMovies(
    pageNumber: number = 1,
    pageSize: number = 6,
    searchTerm?: string,
    categoryId?: number,
    sortBy: string = 'RatingDesc'
  ): Observable<Pagination<Movie>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (sortBy) {
      params = params.set('sort', sortBy);
    }

    if (categoryId) {
      params = params.set('catId', categoryId.toString());
    }

    if (searchTerm) {
      params = params.set('searchWord', searchTerm);
    }

    return this.http.get<Pagination<Movie>>(`${environment.apiUrl}/api/movie/getall`, { params });
  }

  getMovie(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${environment.apiUrl}/api/movie/getById/${id}`);
  }

  createMovie(movie: FormData): Observable<Movie> {
    return this.http.post<Movie>(`${environment.apiUrl}/api/movie/add`, movie);
  }

  updateMovie(id: number, movie: FormData): Observable<Movie> {
    return this.http.put<Movie>(`${environment.apiUrl}/api/movie/edit`, movie);
  }

  deleteMovie(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/movie/delete/${id}`);
  }
} 