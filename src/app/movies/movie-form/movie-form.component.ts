import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../../app/core/services/movie.service';
import { CategoryService } from '../../../app/core/services/category.service';
import { Movie, Category } from '../../../app/models/movie.model';

@Component({
  selector: 'app-movie-form',
  template: `
    <div class="container">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <h2>{{isEditMode ? 'Edit' : 'Add'}} Movie</h2>
          <form [formGroup]="movieForm" (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label for="title" class="form-label">Title</label>
              <input type="text" class="form-control" id="title" formControlName="title">
              <div class="text-danger" *ngIf="movieForm.get('title')?.touched && movieForm.get('title')?.errors?.['required']">
                Title is required
              </div>
            </div>

            <div class="mb-3">
              <label for="description" class="form-label">Description</label>
              <textarea class="form-control" id="description" rows="3" formControlName="description"></textarea>
            </div>

            <div class="mb-3">
              <label for="releaseDate" class="form-label">Release Date</label>
              <input type="date" class="form-control" id="releaseDate" formControlName="releaseDate">
            </div>

            <div class="mb-3">
              <label for="poster" class="form-label">Poster</label>
              <input type="file" class="form-control" id="poster" (change)="onPosterSelected($event)" accept="image/*">
              <div class="text-danger" *ngIf="!isEditMode && !poster">
                Poster is required
              </div>
            </div>

            <div class="mb-3">
              <label for="trailer" class="form-label">Trailer</label>
              <input type="file" class="form-control" id="trailer" (change)="onTrailerSelected($event)" accept="video/*">
            </div>

            <div class="mb-3">
              <label for="categories" class="form-label">Categories</label>
              <select multiple class="form-select" id="categories" formControlName="categoryIds">
                <option *ngFor="let category of categories" [value]="category.id">{{category.name}}</option>
              </select>
            </div>

            <div class="mb-3">
              <button type="submit" class="btn btn-primary" [disabled]="!movieForm.valid || (!isEditMode && !poster)">
                {{isEditMode ? 'Update' : 'Add'}} Movie
              </button>
              <a [routerLink]="['/movies']" class="btn btn-secondary ms-2">Cancel</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class MovieFormComponent implements OnInit {
  movieForm: FormGroup;
  categories: Category[] = [];
  isEditMode = false;
  poster?: File;
  trailer?: File;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private categoryService: CategoryService
  ) {
    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      releaseDate: [''],
      categoryIds: [[]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadMovie(+id);
    }
  }

  loadCategories(): void {
  this.categoryService.getCategories().subscribe((categories: Category[]) => {
    this.categories = categories;
  });
}

loadMovie(id: number): void {
  this.movieService.getMovie(id).subscribe((movie: Movie) => {
    this.movieForm.patchValue({
      title: movie.title,
      description: movie.description,
      releaseDate: movie.releaseDate,
      categoryIds: movie.categories?.map((c:Category) => c.id)
    });
  });
}


  onPosterSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.poster = file;
    }
  }

  onTrailerSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.trailer = file;
    }
  }

  onSubmit(): void {
    if (this.movieForm.valid) {
      const formData = new FormData();
      formData.append('title', this.movieForm.get('title')?.value);
      formData.append('description', this.movieForm.get('description')?.value || '');
      formData.append('releaseDate', this.movieForm.get('releaseDate')?.value || '');

      const categoryIds = this.movieForm.get('categoryIds')?.value;
      if (categoryIds) {
        categoryIds.forEach((id: number) => {
          formData.append('categoryIds', id.toString());
        });
      }

      if (this.poster) {
        formData.append('poster', this.poster);
      }

      if (this.trailer) {
        formData.append('trailer', this.trailer);
      }

      if (this.isEditMode) {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          formData.append('id', id);
          this.movieService.updateMovie(+id,formData).subscribe(() => {
            this.router.navigate(['/movies']);
          });
        }
      } else {
        this.movieService.createMovie(formData).subscribe(() => {
          this.router.navigate(['/movies']);
        });
      }
    }
  }
}
