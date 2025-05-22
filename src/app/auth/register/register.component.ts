import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../app/core/services/auth.service';

@Component({
  selector: 'app-register',
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Create Account</h1>
          <p class="auth-subtitle">Join Movies App to start your journey</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="userName">
              <i class="material-icons">person</i>
              Username
            </label>
            <input 
              type="text" 
              id="userName" 
              formControlName="userName"
              [class.is-invalid]="registerForm.get('userName')?.touched && registerForm.get('userName')?.invalid"
              placeholder="Choose a username">
            <div class="error-message" *ngIf="registerForm.get('userName')?.touched && registerForm.get('userName')?.errors?.['required']">
              <i class="material-icons">error</i>
              Username is required
            </div>
          </div>

          <div class="form-group">
            <label for="email">
              <i class="material-icons">email</i>
              Email
            </label>
            <input 
              type="email" 
              id="email" 
              formControlName="email"
              [class.is-invalid]="registerForm.get('email')?.touched && registerForm.get('email')?.invalid"
              placeholder="Enter your email">
            <div class="error-message" *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.errors?.['required']">
              <i class="material-icons">error</i>
              Email is required
            </div>
            <div class="error-message" *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.errors?.['email']">
              <i class="material-icons">error</i>
              Please enter a valid email
            </div>
            <div class="error-message" *ngIf="registerForm.get('email')?.errors?.['emailExists']">
              <i class="material-icons">error</i>
              This email is already registered
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
                [class.is-invalid]="registerForm.get('password')?.touched && registerForm.get('password')?.invalid"
                placeholder="Create a password">
              <button 
                type="button" 
                class="toggle-password" 
                (click)="togglePassword()">
                <i class="material-icons">{{ showPassword ? 'visibility_off' : 'visibility' }}</i>
              </button>
            </div>
            <div class="error-message" *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.errors?.['required']">
              <i class="material-icons">error</i>
              Password is required
            </div>
            <div class="error-message" *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.errors?.['minlength']">
              <i class="material-icons">error</i>
              Password must be at least 6 characters
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">
              <i class="material-icons">lock_outline</i>
              Confirm Password
            </label>
            <div class="password-input">
              <input 
                [type]="showConfirmPassword ? 'text' : 'password'" 
                id="confirmPassword" 
                formControlName="confirmPassword"
                [class.is-invalid]="registerForm.get('confirmPassword')?.touched && registerForm.get('confirmPassword')?.invalid"
                placeholder="Confirm your password">
              <button 
                type="button" 
                class="toggle-password" 
                (click)="toggleConfirmPassword()">
                <i class="material-icons">{{ showConfirmPassword ? 'visibility_off' : 'visibility' }}</i>
              </button>
            </div>
            <div class="error-message" *ngIf="registerForm.get('confirmPassword')?.touched && registerForm.get('confirmPassword')?.errors?.['required']">
              <i class="material-icons">error</i>
              Please confirm your password
            </div>
            <div class="error-message" *ngIf="registerForm.get('confirmPassword')?.touched && registerForm.get('confirmPassword')?.errors?.['passwordMismatch']">
              <i class="material-icons">error</i>
              Passwords do not match
            </div>
          </div>

          <div class="error-message" *ngIf="registerError">
            <i class="material-icons">error</i>
            {{ registerError }}
          </div>

          <button 
            type="submit" 
            class="btn btn-danger w-100" 
            [disabled]="!registerForm.valid || isLoading">
            <i class="material-icons" *ngIf="!isLoading">person_add</i>
            <i class="material-icons rotating" *ngIf="isLoading">refresh</i>
            {{ isLoading ? 'Creating Account...' : 'Create Account' }}
          </button>

          <div class="auth-footer">
            <p>Already have an account? <a [routerLink]="['/login']">Sign in</a></p>
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
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  registerError = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });

    // Subscribe to password changes to validate password match
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.validatePasswordMatch();
    });

    this.registerForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.validatePasswordMatch();
    });
  }

  validatePasswordMatch(): void {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      this.registerForm.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      this.registerForm.get('confirmPassword')?.setErrors(null);
    }
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.registerError = '';

      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Registration failed:', error);
          this.isLoading = false;
          if (error.status === 400) {
            if (error.error?.message?.toLowerCase().includes('email')) {
              this.registerError = 'This email is already registered';
              this.registerForm.get('email')?.setErrors({ emailExists: true });
            } else if (error.error?.message?.toLowerCase().includes('username')) {
              this.registerError = 'This username is already taken';
              this.registerForm.get('userName')?.setErrors({ usernameExists: true });
            } else {
              this.registerError = 'Email or username is already taken';
            }
          } else if (error.status === 0) {
            this.registerError = 'Unable to connect to the server. Please try again later.';
          } else {
            this.registerError = 'An error occurred. Please try again.';
          }
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
