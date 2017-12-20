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
          NoopAnimationsModule
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
