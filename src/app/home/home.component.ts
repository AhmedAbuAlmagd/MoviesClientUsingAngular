import { Component, OnInit } from '@angular/core';
import { MovieService } from '../core/services/movie.service';
import { CategoryService } from '../core/services/category.service';
import { Movie } from '../core/models/movie.model';
import { Category } from '../core/models/movie.model';

@Component({
  selector: 'app-home',
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-8">
          <h2>Featured Movies</h2>
          <div class="row">
            <div class="col-md-4 mb-4" *ngFor="let movie of featuredMovies">
              <div class="card h-100">
                <img [src]="movie.poster" class="card-img-top" [alt]="movie.title">
                <div class="card-body">
                  <h5 class="card-title">{{ movie.title }}</h5>
                  <p class="card-text">{{ movie.description | slice:0:100 }}...</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="badge bg-primary">{{ movie.rating }}/10</span>
                    <a [routerLink]="['/movies', movie.id]" class="btn btn-outline-primary">View Details</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <h2>Categories</h2>
          <div class="list-group">
            <a *ngFor="let category of categories"
               [routerLink]="['/movies']"
               [queryParams]="{category: category.id}"
               class="list-group-item list-group-item-action">
              {{ category.name }}
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card-img-top {
      height: 300px;
      object-fit: cover;
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredMovies: Movie[] = [];
  categories: Category[] = [];

  constructor(
    private movieService: MovieService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadFeaturedMovies();
    this.loadCategories();
  }

  private loadFeaturedMovies(): void {
    this.movieService.getMovies().subscribe(
      (movies: Movie[]) => {
        this.featuredMovies = movies.slice(0, 6);
      },
      (error: Error) => {
        console.error('Error loading featured movies:', error);
      }
    );
  }

  private loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories;
      },
      (error: Error) => {
        console.error('Error loading categories:', error);
      }
    );
  }
} 