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
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'currentUser';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.loadStoredUser();
    }
  }

  private loadStoredUser(): void {
    try {
      const user = localStorage.getItem(this.USER_KEY);
      const token = localStorage.getItem(this.TOKEN_KEY);
      if (user && token) {
        const parsedUser = JSON.parse(user);
        if (parsedUser) {
          this.currentUserSubject.next(parsedUser);
        }
      } else {
        this.clearStoredData();
      }
    } catch (error) {
      console.error('Error loading stored user data:', error);
      this.clearStoredData();
    }
  }

  private clearStoredData(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.currentUserSubject.next(null);
  }

  private storeAuthData(response: AuthResponse): void {
    if (this.isBrowser) {
      localStorage.setItem(this.TOKEN_KEY, response.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify({
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
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/api/auth/login`, request)
      .pipe(
        tap(response => this.storeAuthData(response)),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/api/auth/register`, request)
      .pipe(
        tap(response => this.storeAuthData(response)),
        catchError(error => {
          console.error('Registration error:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    this.clearStoredData();
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.roles?.includes('Admin') || false;
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(this.TOKEN_KEY) : null;
  }

  getUserId(): number | null {
    return this.currentUserSubject.value?.id || null;
  }
} 