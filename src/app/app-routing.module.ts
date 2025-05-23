import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MovieListComponent } from './movies/movie-list/movie-list.component';
import { MovieDetailsComponent } from './movies/movie-details/movie-details.component';
import { MovieFormComponent } from './movies/movie-form/movie-form.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AboutComponent } from './about/about.component';
import { MovieFavoritesComponent } from './movies/movie-favorites/movie-favorites.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'movies', component: MovieListComponent },
  { path: 'movies/favorites', component: MovieFavoritesComponent, canActivate: [AuthGuard] },
  { path: 'movies/:id', component: MovieDetailsComponent },
  { path: 'movies/edit/:id', component: MovieFormComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'movies/add', component: MovieFormComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
