import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../../app/core/services/movie.service';
import { CategoryService } from '../../../app/core/services/category.service';
import { Movie, Category } from '../../../app/models/movie.model';

@Component({
  selector: 'app-movie-form',
  template: `
    <div class="movie-form-container">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8">
            <div class="form-card">
              <h2 class="form-title">
                <i class="material-icons">{{isEditMode ? 'edit' : 'add'}}</i>
                {{isEditMode ? 'Edit' : 'Add'}} Movie
              </h2>

              <form [formGroup]="movieForm" (ngSubmit)="onSubmit()">
                <!-- Title -->
                <div class="form-group">
                  <label for="title">
                    <i class="material-icons">title</i>
                    Title
                  </label>
                  <input type="text" 
                         class="form-control" 
                         id="title" 
                         formControlName="title"
                         placeholder="Enter movie title">
                  <div class="error-message" *ngIf="movieForm.get('title')?.touched && movieForm.get('title')?.errors?.['required']">
                    Title is required
                  </div>
                  <div class="error-message" *ngIf="movieForm.get('title')?.touched && movieForm.get('title')?.errors?.['minlength']">
                    Title must be at least 3 characters long
                  </div>
                </div>

                <!-- Description -->
                <div class="form-group">
                  <label for="description">
                    <i class="material-icons">description</i>
                    Description
                  </label>
                  <textarea class="form-control" 
                            id="description" 
                            rows="4" 
                            formControlName="description"
                            placeholder="Enter movie description"></textarea>
                  <div class="error-message" *ngIf="movieForm.get('description')?.touched && movieForm.get('description')?.errors?.['minlength']">
                    Description must be at least 10 characters long
                  </div>
                </div>

                <!-- Release Date -->
                <div class="form-group">
                  <label for="releaseDate">
                    <i class="material-icons">calendar_today</i>
                    Release Date
                  </label>
                  <input type="date" 
                         class="form-control" 
                         id="releaseDate" 
                         formControlName="releaseDate"
                         [max]="maxDate">
                  <div class="error-message" *ngIf="movieForm.get('releaseDate')?.touched && movieForm.get('releaseDate')?.errors?.['required']">
                    Release date is required
                  </div>
                </div>

                <!-- Rating -->
                <div class="form-group">
                  <label for="rating">
                    <i class="material-icons">star</i>
                    Rating
                  </label>
                  <input type="number" 
                         class="form-control" 
                         id="rating" 
                         formControlName="rating"
                         min="0"
                         max="10"
                         step="0.1"
                         placeholder="Enter movie rating (0-10)">
                  <div class="error-message" *ngIf="movieForm.get('rating')?.touched && movieForm.get('rating')?.errors?.['required']">
                    Rating is required
                  </div>
                  <div class="error-message" *ngIf="movieForm.get('rating')?.touched && movieForm.get('rating')?.errors?.['min']">
                    Rating must be at least 0
                  </div>
                  <div class="error-message" *ngIf="movieForm.get('rating')?.touched && movieForm.get('rating')?.errors?.['max']">
                    Rating cannot exceed 10
                  </div>
                </div>

                <!-- Poster -->
                <div class="form-group">
                  <label for="poster">
                    <i class="material-icons">image</i>
                    Poster
                  </label>
                  <div class="file-upload-container">
                    <div class="file-upload-box" 
                         [class.has-file]="poster || currentPosterUrl"
                         (click)="posterInput.click()">
                      <ng-container *ngIf="poster || currentPosterUrl; else noPoster">
                        <img *ngIf="currentPosterUrl" [src]="currentPosterUrl" class="preview-image" alt="Poster preview">
                        <span *ngIf="poster">{{poster.name}}</span>
                      </ng-container>
                      <ng-template #noPoster>
                        <i class="material-icons">add_photo_alternate</i>
                        <span>Click to upload poster</span>
                      </ng-template>
                    </div>
                    <input #posterInput
                           type="file" 
                           class="d-none" 
                           id="poster" 
                           (change)="onPosterSelected($event)" 
                           accept="image/*">
                    <div class="error-message" *ngIf="!isEditMode && !poster && !currentPosterUrl && movieForm.get('poster')?.touched">
                      Poster is required
                    </div>
                    <div class="file-info" *ngIf="poster">
                      <span>Size: {{(poster.size / 1024 / 1024).toFixed(2)}} MB</span>
                      <button type="button" class="remove-file" (click)="removePoster()">
                        <i class="material-icons">close</i>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Trailer -->
                <div class="form-group">
                  <label for="trailer">
                    <i class="material-icons">movie</i>
                    Trailer
                  </label>
                  <div class="file-upload-container">
                    <div class="file-upload-box" 
                         [class.has-file]="trailer || currentTrailerUrl"
                         (click)="trailerInput.click()">
                      <ng-container *ngIf="trailer || currentTrailerUrl; else noTrailer">
                        <i class="material-icons">movie</i>
                        <span>{{trailer ? trailer.name : 'Current trailer'}}</span>
                      </ng-container>
                      <ng-template #noTrailer>
                        <i class="material-icons">add_video</i>
                        <span>Click to upload trailer</span>
                      </ng-template>
                    </div>
                    <input #trailerInput
                           type="file" 
                           class="d-none" 
                           id="trailer" 
                           (change)="onTrailerSelected($event)" 
                           accept="video/*">
                    <div class="file-info" *ngIf="trailer">
                      <span>Size: {{(trailer.size / 1024 / 1024).toFixed(2)}} MB</span>
                      <button type="button" class="remove-file" (click)="removeTrailer()">
                        <i class="material-icons">close</i>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Categories -->
                <div class="form-group">
                  <label for="categories">
                    <i class="material-icons">category</i>
                    Categories
                  </label>
                  <div class="categories-container">
                    <div class="category-list">
                      <div *ngFor="let category of categories" class="category-item">
                        <label class="category-checkbox">
                          <input type="checkbox"
                                 [value]="category.id"
                                 (change)="onCategoryChange($event, category.id || 0)"
                                 [checked]="movieForm.get('categoryIds')?.value?.includes(category.id)">
                          <span class="category-name">{{category.name}}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="error-message" *ngIf="movieForm.get('categoryIds')?.touched && movieForm.get('categoryIds')?.errors?.['required']">
                    At least one category is required
                  </div>
                  <div class="error-message" *ngIf="movieForm.get('categoryIds')?.touched && movieForm.get('categoryIds')?.errors?.['minLength']">
                    Please select at least one category
                  </div>
                </div>

                <!-- Form Actions -->
                <div class="form-actions">
                  <button type="submit" 
                          class="submit-button" 
                          [disabled]="!movieForm.valid || (!isEditMode && !poster && !currentPosterUrl) || isSubmitting">
                    <i class="material-icons">{{isEditMode ? 'edit' : 'add'}}</i>
                    <span>{{isSubmitting ? 'Saving...' : (isEditMode ? 'Update' : 'Add')}} Movie</span>
                  </button>
                  <button type="button" 
                          class="cancel-button" 
                          [routerLink]="['/movies']">
                    <i class="material-icons">close</i>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .movie-form-container {
      background: #141414;
      color: white;
      min-height: 100vh;
      padding: 4rem 0;
    }

    .form-card {
      background: rgba(26, 26, 26, 0.95);
      border-radius: 20px;
      padding: 3rem;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(229, 9, 20, 0.1);
      backdrop-filter: blur(10px);
    }

    .form-title {
      display: flex;
      align-items: center;
      gap: 1rem;
      color: white;
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 3rem;
      background: linear-gradient(to right, #fff, #e50914);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .form-title .material-icons {
      font-size: 2.8rem;
      color: #e50914;
    }

    .form-group {
      margin-bottom: 2rem;
    }

    .form-group label {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      color: #ccc;
      margin-bottom: 1rem;
      font-size: 1.2rem;
    }

    .form-group .material-icons {
      color: #e50914;
      font-size: 1.4rem;
    }

    .form-control {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      color: white;
      padding: 1rem 1.2rem;
      width: 100%;
      transition: all 0.3s ease;
      font-size: 1.1rem;
    }

    .form-control:focus {
      outline: none;
      border-color: #e50914;
      box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.2);
    }

    .form-control::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    .file-upload-container {
      margin-top: 0.5rem;
    }

    .file-upload-box {
      background: rgba(255, 255, 255, 0.1);
      border: 2px dashed rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .file-upload-box:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: #e50914;
    }

    .file-upload-box.has-file {
      border-style: solid;
      border-color: #e50914;
      background: rgba(229, 9, 20, 0.1);
    }

    .file-upload-box i {
      font-size: 2.5rem;
      color: #e50914;
      margin-bottom: 1rem;
    }

    .file-upload-box span {
      color: #ccc;
      font-size: 1.1rem;
    }

    .error-message {
      color: #ff4444;
      font-size: 1rem;
      margin-top: 0.8rem;
    }

    .select-hint {
      color: #999;
      font-size: 0.9rem;
      margin-top: 0.5rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 3rem;
    }

    .submit-button,
    .cancel-button {
      display: inline-flex;
      align-items: center;
      gap: 0.8rem;
      padding: 1rem 2rem;
      border-radius: 25px;
      font-size: 1.2rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .submit-button {
      background: #e50914;
      color: white;
      border: none;
    }

    .submit-button:hover:not(:disabled) {
      background: #b82525;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(229, 9, 20, 0.4);
    }

    .submit-button:disabled {
      background: rgba(229, 9, 20, 0.5);
      cursor: not-allowed;
    }

    .cancel-button {
      background: transparent;
      color: #ccc;
      border: 2px solid #ccc;
    }

    .cancel-button:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border-color: white;
      transform: translateY(-2px);
    }

    .submit-button .material-icons,
    .cancel-button .material-icons {
      font-size: 1.4rem;
    }

    @media (max-width: 768px) {
      .movie-form-container {
        padding: 2rem 0;
      }

      .form-card {
        padding: 2rem;
      }

      .form-title {
        font-size: 2rem;
      }

      .form-title .material-icons {
        font-size: 2.2rem;
      }

      .form-actions {
        flex-direction: column;
      }

      .submit-button,
      .cancel-button {
        width: 100%;
        justify-content: center;
      }
    }

    .preview-image {
      max-width: 100%;
      max-height: 200px;
      object-fit: contain;
      margin-bottom: 1rem;
      border-radius: 8px;
    }

    .file-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0.5rem;
      padding: 0.5rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      font-size: 0.9rem;
      color: #ccc;
    }

    .remove-file {
      background: none;
      border: none;
      color: #ff4444;
      cursor: pointer;
      padding: 0.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .remove-file:hover {
      color: #ff0000;
      transform: scale(1.1);
    }

    .remove-file .material-icons {
      font-size: 1.2rem;
    }

    .categories-container {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 1rem;
      margin-top: 0.5rem;
    }

    .category-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }

    .category-item {
      display: flex;
      align-items: center;
    }

    .category-checkbox {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 5px;
      transition: all 0.3s ease;
    }

    .category-checkbox:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .category-checkbox input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .category-name {
      color: #ccc;
      font-size: 1rem;
    }

    .category-checkbox input[type="checkbox"]:checked + .category-name {
      color: #e50914;
    }

    @media (max-width: 768px) {
      .category-list {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MovieFormComponent implements OnInit {
  movieForm: FormGroup;
  categories: Category[] = [];
  isEditMode = false;
  poster?: File;
  trailer?: File;
  isSubmitting = false;
  currentPosterUrl?: string;
  currentTrailerUrl?: string;
  maxDate: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private categoryService: CategoryService
  ) {
    // Set max date to today
    this.maxDate = new Date().toISOString().split('T')[0];
    
    this.movieForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      releaseDate: ['', [Validators.required]],
      categoryIds: [[], [Validators.required, Validators.minLength(1)]],
      rating: [0, [Validators.required, Validators.min(0), Validators.max(10)]]
    });
  }

  ngOnInit(): void {
    // Load categories first
    this.loadCategories();
    
    // Check if we're in edit mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'add') {
      this.isEditMode = true;
      this.loadMovie(+id);
    }
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
        
        // If we're in edit mode, reload the movie to set categories
        const id = this.route.snapshot.paramMap.get('id');
        if (id && this.isEditMode) {
          this.loadMovie(+id);
        }
      },
      error: (error: Error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadMovie(id: number): void {
    if (isNaN(id)) {
      console.error('Invalid movie ID');
      return;
    }

    this.movieService.getMovie(id).subscribe({
      next: (movie: Movie) => {
        // First set the basic form values
        this.movieForm.patchValue({
          title: movie.title,
          description: movie.description,
          releaseDate: movie.releaseDate ? new Date(movie.releaseDate).toISOString().split('T')[0] : '',
          rating: movie.rating || 0
        });

        // Handle categories by matching names with our local categories
        if (movie.categories && movie.categories.length > 0) {
          const categoryIds = movie.categories
            .map(movieCategory => {
              const localCategory = this.categories.find(c => c.name === movieCategory.name);
              return localCategory?.id;
            })
            .filter(id => id !== undefined) as number[];
          
          this.movieForm.get('categoryIds')?.setValue(categoryIds);
        }
        
        // Set current poster and trailer URLs if they exist
        if (movie.poster) {
          this.currentPosterUrl = movie.poster;
        }
        if (movie.trailer) {
          this.currentTrailerUrl = movie.trailer;
        }
      },
      error: (error: Error) => {
        console.error('Error loading movie:', error);
      }
    });
  }

  onPosterSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should not exceed 5MB');
        return;
      }
      this.poster = file;
      this.currentPosterUrl = URL.createObjectURL(file);
    }
  }

  onTrailerSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        alert('Please select a video file');
        return;
      }
      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        alert('File size should not exceed 100MB');
        return;
      }
      this.trailer = file;
    }
  }

  removePoster(): void {
    this.poster = undefined;
    this.currentPosterUrl = undefined;
    (document.getElementById('poster') as HTMLInputElement).value = '';
  }

  removeTrailer(): void {
    this.trailer = undefined;
    this.currentTrailerUrl = undefined;
    (document.getElementById('trailer') as HTMLInputElement).value = '';
  }

  onCategoryChange(event: Event, categoryId: number): void {
    if (!categoryId) return;
    
    const checkbox = event.target as HTMLInputElement;
    const currentCategories = this.movieForm.get('categoryIds')?.value || [];
    
    if (checkbox.checked) {
      if (!currentCategories.includes(categoryId)) {
        const newCategories = [...currentCategories, categoryId];
        this.movieForm.patchValue({
          categoryIds: newCategories
        });
      }
    } else {
      const newCategories = currentCategories.filter((id: number) => id !== categoryId);
      this.movieForm.patchValue({
        categoryIds: newCategories
      });
    }
  }

  isCategorySelected(categoryId: number): boolean {
    if (!categoryId) return false;
    const selectedCategories = this.movieForm.get('categoryIds')?.value || [];
    return selectedCategories.includes(categoryId);
  }

  onSubmit(): void {
    if (this.movieForm.valid) {
      this.isSubmitting = true;
      const formData = new FormData();
      
      // Add basic movie information
      formData.append('title', this.movieForm.get('title')?.value.trim());
      formData.append('description', this.movieForm.get('description')?.value.trim() || '');
      formData.append('releaseDate', this.movieForm.get('releaseDate')?.value || '');
      formData.append('rating', this.movieForm.get('rating')?.value || '0');

      // Add category IDs
      const categoryIds = this.movieForm.get('categoryIds')?.value;
      if (categoryIds && categoryIds.length > 0) {
        categoryIds.forEach((id: number) => {
          formData.append('categoryIds', id.toString());
        });
      }

      // Handle poster
      if (this.poster) {
        formData.append('poster', this.poster);
      }

      // Handle trailer
      if (this.trailer) {
        formData.append('trailer', this.trailer);
      }

      if (this.isEditMode) {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          formData.append('id', id);
          this.movieService.updateMovie(+id, formData).subscribe({
            next: () => {
              this.router.navigate(['/movies']);
            },
            error: (error: any) => {
              console.error('Error updating movie:', error);
              this.isSubmitting = false;
              alert(`Error updating movie: ${error.error?.message || error.message || 'Please try again.'}`);
            }
          });
        }
      } else {
        // Create new movie
        this.movieService.createMovie(formData).subscribe({
          next: () => {
            this.router.navigate(['/movies']);
          },
          error: (error: any) => {
            console.error('Error creating movie:', error);
            this.isSubmitting = false;
            alert(`Error creating movie: ${error.error?.message || error.message || 'Please try again.'}`);
          }
        });
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.movieForm.controls).forEach(key => {
        const control = this.movieForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
