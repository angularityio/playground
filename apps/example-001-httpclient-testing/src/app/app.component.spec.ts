import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';
import {
  MatInputModule,
  MatTableModule,
  MatFormFieldModule,
  MatSelectModule,
  MatToolbarModule,
  MatCardModule,
  MatButtonModule
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MomentModule } from 'angular2-moment';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PostsServiceService } from './posts-service.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [AppComponent],
        imports: [
          MatInputModule,
          MatTableModule,
          MatFormFieldModule,
          MatSelectModule,
          MatToolbarModule,
          MatCardModule,
          MatButtonModule,
          NoopAnimationsModule,
          MomentModule,
          ReactiveFormsModule,
          HttpClientTestingModule
        ],
        providers: [
          PostsServiceService
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
