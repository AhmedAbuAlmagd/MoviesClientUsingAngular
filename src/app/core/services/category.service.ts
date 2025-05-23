import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/movie.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl}/api/categories/getall`);
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${environment.apiUrl}/api/categories/getById/${id}`);
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${environment.apiUrl}/api/categories/add`, category);
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${environment.apiUrl}/api/categories/edit`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/categories/delete/${id}`);
  }
} 