import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../app/core/services/auth.service';

@Component({
  selector: 'app-register',
  template: `
    <div class="container">
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <div class="card mt-5">
            <div class="card-body">
              <h2 class="card-title text-center mb-4">Register</h2>
              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="userName" class="form-label">Username</label>
                  <input type="text" class="form-control" id="userName" formControlName="userName">
                  <div class="text-danger" *ngIf="registerForm.get('userName')?.touched && registerForm.get('userName')?.errors?.['required']">
                    Username is required
                  </div>
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" class="form-control" id="email" formControlName="email">
                  <div class="text-danger" *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.errors?.['required']">
                    Email is required
                  </div>
                  <div class="text-danger" *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.errors?.['email']">
                    Please enter a valid email
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input type="password" class="form-control" id="password" formControlName="password">
                  <div class="text-danger" *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.errors?.['required']">
                    Password is required
                  </div>
                  <div class="text-danger" *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.errors?.['minlength']">
                    Password must be at least 6 characters
                  </div>
                </div>

                <div class="mb-3">
                  <label for="confirmPassword" class="form-label">Confirm Password</label>
                  <input type="password" class="form-control" id="confirmPassword" formControlName="confirmPassword">
                  <div class="text-danger" *ngIf="registerForm.get('confirmPassword')?.touched && registerForm.get('confirmPassword')?.errors?.['required']">
                    Please confirm your password
                  </div>
                  <div class="text-danger" *ngIf="registerForm.get('confirmPassword')?.touched && registerForm.get('confirmPassword')?.errors?.['passwordMismatch']">
                    Passwords do not match
                  </div>
                </div>

                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-primary" [disabled]="!registerForm.valid">Register</button>
                </div>

                <div class="text-center mt-3">
                  <p>Already have an account? <a [routerLink]="['/login']">Login here</a></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Registration failed:', error);
        }
      });
    }
  }
}
