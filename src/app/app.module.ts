import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoreModule } from './core/core.module';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MovieListComponent } from './movies/movie-list/movie-list.component';
import { MovieDetailsComponent } from './movies/movie-details/movie-details.component';
import { MovieFormComponent } from './movies/movie-form/movie-form.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { MovieFavoritesComponent } from './movies/movie-favorites/movie-favorites.component';
import { AboutComponent } from './about/about.component';

import { MovieService } from './core/services/movie.service';
import { CategoryService } from './core/services/category.service';
import { ReviewService } from './core/services/review.service';
import { AuthService } from './core/services/auth.service';
import { WatchlistService } from './core/services/watchlist.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MovieListComponent,
    MovieDetailsComponent,
    MovieFormComponent,
    LoginComponent,
    RegisterComponent,
    MovieFavoritesComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    CoreModule,
    RouterModule.forRoot([
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'movies', component: MovieListComponent },
      { path: 'movies/favorites', component: MovieFavoritesComponent },
      { path: 'movies/add', component: MovieFormComponent },
      { path: 'movies/edit/:id', component: MovieFormComponent },
      { path: 'movies/:id', component: MovieDetailsComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'about', component: AboutComponent },
      { path: '**', redirectTo: '/home' }
    ]),
    SharedModule
  ],
  providers: [
    MovieService,
    CategoryService,
    ReviewService,
    AuthService,
    WatchlistService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
