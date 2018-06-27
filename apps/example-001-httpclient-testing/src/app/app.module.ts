import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NxModule } from '@nrwl/nx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { BlogPostsService } from './blog-posts.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'angular2-moment';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    MatInputModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    MomentModule,
    NxModule.forRoot()
  ],
  declarations: [AppComponent],
  providers: [BlogPostsService],
  bootstrap: [AppComponent]
})
export class AppModule {}
