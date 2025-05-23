import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ReviewFormComponent } from './review-form/review-form.component';
import { ReviewListComponent } from './review-list/review-list.component';

@NgModule({
  declarations: [
    ReviewFormComponent,
    ReviewListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    ReviewFormComponent,
    ReviewListComponent
  ]
})
export class SharedModule { } 