import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoreModule } from './core/core.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MovieListComponent } from './movies/movie-list/movie-list.component';
import { MovieDetailsComponent } from './movies/movie-details/movie-details.component';
import { MovieFormComponent } from './movies/movie-form/movie-form.component';
import { ReviewListComponent } from './reviews/review-list/review-list.component';
import { ReviewFormComponent } from './reviews/review-form/review-form.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

import { MovieService } from './core/services/movie.service';
import { CategoryService } from './core/services/category.service';
import { ReviewService } from './core/services/review.service';
import { AuthService } from './core/services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MovieListComponent,
    MovieDetailsComponent,
    MovieFormComponent,
    ReviewListComponent,
    ReviewFormComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CoreModule,
    RouterModule.forRoot([
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'movies', component: MovieListComponent },
      { path: 'movies/favorites', component: MovieListComponent },
      { path: 'movies/:id', component: MovieDetailsComponent },
      { path: 'movies/add', component: MovieFormComponent },
      { path: 'movies/edit/:id', component: MovieFormComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'about-us', component: HomeComponent },
      { path: '**', redirectTo: '/home' }
    ])
  ],
  providers: [
    MovieService,
    CategoryService,
    ReviewService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
