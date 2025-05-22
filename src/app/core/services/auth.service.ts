import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../models/auth.model';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      try {
        const user = localStorage.getItem('currentUser');
        if (user) {
          const parsedUser = JSON.parse(user);
          if (parsedUser) {
            this.currentUserSubject.next(parsedUser);
          }
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
      }
    }
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/api/auth/login`, request)
      .pipe(
        tap(response => {
          if (this.isBrowser) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify({
              username: response.userName,
              email: response.email,
              roles: response.roles
            }));
          }
          this.currentUserSubject.next({
            username: response.userName,
            email: response.email,
            roles: response.roles
          });
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/api/auth/register`, request)
      .pipe(
        tap(response => {
          if (this.isBrowser) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify({
              username: response.userName,
              email: response.email,
              roles: response.roles
            }));
          }
          this.currentUserSubject.next({
            username: response.userName,
            email: response.email,
            roles: response.roles
          });
        }),
        catchError(error => {
          console.error('Registration error:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.roles?.includes('Admin') || false;
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem('token') : null;
  }

  getUserId(): number | null {
    return this.currentUserSubject.value?.id || null;
  }
} 