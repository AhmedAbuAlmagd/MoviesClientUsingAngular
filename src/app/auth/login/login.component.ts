import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Welcome Back</h1>
          <p class="auth-subtitle">Sign in to continue to Movies App</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="email">
              <i class="material-icons">email</i>
              Email
            </label>
            <input 
              type="email" 
              id="email" 
              formControlName="email"
              [class.is-invalid]="loginForm.get('email')?.touched && loginForm.get('email')?.invalid"
              placeholder="Enter your email">
            <div class="error-message" *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.errors?.['required']">
              <i class="material-icons">error</i>
              Email is required
            </div>
            <div class="error-message" *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.errors?.['email']">
              <i class="material-icons">error</i>
              Please enter a valid email
            </div>
          </div>

          <div class="form-group">
            <label for="password">
              <i class="material-icons">lock</i>
              Password
            </label>
            <div class="password-input">
              <input 
                [type]="showPassword ? 'text' : 'password'" 
                id="password" 
                formControlName="password"
                [class.is-invalid]="loginForm.get('password')?.touched && loginForm.get('password')?.invalid"
                placeholder="Enter your password">
              <button 
                type="button" 
                class="toggle-password" 
                (click)="togglePassword()">
                <i class="material-icons">{{ showPassword ? 'visibility_off' : 'visibility' }}</i>
              </button>
            </div>
            <div class="error-message" *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.errors?.['required']">
              <i class="material-icons">error</i>
              Password is required
            </div>
          </div>

          <div class="error-message" *ngIf="loginError">
            <i class="material-icons">error</i>
            {{ loginError }}
          </div>

          <button 
            type="submit" 
            class="btn btn-danger w-100" 
            [disabled]="!loginForm.valid || isLoading">
            <i class="material-icons" *ngIf="!isLoading">login</i>
            <i class="material-icons rotating" *ngIf="isLoading">refresh</i>
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>

          <div class="auth-footer">
            <p>Don't have an account? <a [routerLink]="['/register']">Create one</a></p>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
                  url('/assets/images/hero-bg.jpg') center/cover;
    }

    .auth-card {
      background: rgba(26, 26, 26, 0.95);
      border-radius: 15px;
      padding: 2.5rem;
      width: 100%;
      max-width: 550px;
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .auth-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: white;
    }

    .auth-subtitle {
      color: #999;
      font-size: 1.1rem;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #ccc;
      font-size: 0.95rem;
    }

    .form-group label i {
      font-size: 1.2rem;
      color: #e50914;
    }

    .form-group input {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      padding: 0.75rem 1rem;
      color: white;
      font-size: 1rem;
      transition: all 0.3s ease;
      width: 100%;
      box-sizing: border-box;
    }

    .form-group input:focus {
      background: rgba(255, 255, 255, 0.15);
      border-color: #e50914;
      box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.25);
    }

    .form-group input::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    .form-group input.is-invalid {
      border-color: #e50914;
    }

    .password-input {
      position: relative;
      width: 100%;
    }

    .password-input input {
      padding-right: 3rem;
    }

    .toggle-password {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #999;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .toggle-password:hover {
      color: white;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #e50914;
      font-size: 0.9rem;
      margin-top: 0.25rem;
    }

    .error-message i {
      font-size: 1.1rem;
    }

    .btn {
      padding: 0.75rem;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .rotating {
      animation: rotate 1s linear infinite;
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      color: #999;
    }

    .auth-footer a {
      color: #e50914;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .auth-footer a:hover {
      color: #b82525;
    }

    @media (max-width: 576px) {
      .auth-card {
        padding: 1.5rem;
      }

      .auth-header h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  loginError = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginError = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          if (response.isAuthenticated) {
            this.router.navigate(['/']);
          } else {
            this.isLoading = false;
            this.loginError = response.message || 'Invalid email or password';
          }
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.isLoading = false;
          if (error.status === 400) {
            this.loginError = error.error?.message || 'Invalid email or password';
          } else if (error.status === 0) {
            this.loginError = 'Unable to connect to the server. Please try again later.';
          } else {
            this.loginError = 'An error occurred. Please try again.';
          }
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
} 