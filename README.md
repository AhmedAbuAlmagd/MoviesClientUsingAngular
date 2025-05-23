# MoviesClient

A modern Angular frontend application for the Movie Application, featuring a beautiful UI and comprehensive movie management system.

## 🛠️ Technology Stack

- Angular 16+
- TypeScript
- SCSS
- Material Icons
- Bootstrap 5
- RxJS
- Angular Material

## 📁 Project Structure

```
MoviesClient/
├── src/
│   ├── app/
│   │   ├── core/              # Core module
│   │   │   ├── services/      # Core services
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── movie.service.ts
│   │   │   │   ├── review.service.ts
│   │   │   │   └── watchlist.service.ts
│   │   │   ├── models/        # Core models
│   │   │   └── interceptors/  # HTTP interceptors
│   │   │
│   │   ├── shared/           # Shared module
│   │   │   ├── review-form/
│   │   │   └── review-list/
│   │   │
│   │   ├── movies/           # Movies module
│   │   │   ├── movie-list/
│   │   │   ├── movie-details/
│   │   │   └── movie-form/
│   │   │
│   │   ├── auth/            # Authentication module
│   │   │   ├── login/
│   │   │   └── register/
│   │   │
│   │   └── home/            # Home module
│   │
│   ├── assets/             # Static assets
│   └── environments/       # Environment configurations
│
├── angular.json           # Angular configuration
├── package.json          # Project dependencies
└── tsconfig.json         # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Angular CLI (v19 or higher)

### Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Start Development Server**
```bash
ng serve
```

The application will be available at `http://localhost:4200`

## ✨ Features

### User Features
- **Movie Discovery**
  - Browse movies with modern UI
  - Search and filter movies
  - View movie details
  - Watch movie trailers
  - View movie categories

- **Personal Features**
  - Create and manage watchlist
  - Rate movies (1-10 scale)
  - Write and manage reviews
  - User authentication
  - Responsive design

### Admin Features
- **Movie Management**
  - Add new movies
  - Edit existing movies
  - Delete movies
  - Manage movie categories

## 🎨 UI Components

### Core Components
- Navigation bar
- Movie cards
- Review forms
- Rating system
- Watchlist management

### Pages
- Home page
- Movie details
- Movie list
- Login/Register
- Admin dashboard

## 🔒 Authentication

- JWT-based authentication
- Role-based access control
- Protected routes
- Auth guards
- Token management

## 📱 Responsive Design

- Mobile-first approach
- Bootstrap grid system
- Responsive images
- Adaptive layouts
- Touch-friendly interfaces



## 📚 Dependencies

- @angular/core
- @angular/material
- @angular/forms
- @angular/router
- bootstrap
- rxjs
- material-icons

## 🔧 Development

### Code Style
- Follow Angular style guide
- Use TypeScript strict mode
- Implement lazy loading
- Follow component best practices

### Best Practices
- Use services for data management
- Implement proper error handling
- Use TypeScript interfaces
- Follow Angular architecture patterns
