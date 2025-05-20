import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="container">
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <div class="card mt-5">
            <div class="card-body">
              <h2 class="card-title text-center mb-4">Login</h2>
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" class="form-control" id="email" formControlName="email">
                  <div class="text-danger" *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.errors?.['required']">
                    Email is required
                  </div>
                  <div class="text-danger" *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.errors?.['email']">
                    Please enter a valid email
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input type="password" class="form-control" id="password" formControlName="password">
                  <div class="text-danger" *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.errors?.['required']">
                    Password is required
                  </div>
                </div>

                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-primary" [disabled]="!loginForm.valid">Login</button>
                </div>

                <div class="text-center mt-3">
                  <p>Don't have an account? <a [routerLink]="['/register']">Register here</a></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;

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

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          // Handle login error (show error message to user)
        }
      });
    }
  }
} 