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
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BlogPostsService } from './blog-posts.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let backend: HttpTestingController;

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
        providers: [BlogPostsService]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    backend = TestBed.get(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    backend.verify;
    expect(component).toBeTruthy();
  });

  it('should load list and select first component', () => {
    backend.expectOne(`https://rails-rest.herokuapp.com/posts`).flush([
      {
        id: 1,
        title: 'Testing HttpClient',
        content: 'A long description...',
        created_at: '2017-12-07T04:39:49.447Z',
        updated_at: '2017-12-07T04:39:49.447Z'
      },
      {
        id: 2,
        title: 'Testing Components',
        content: 'Another long description...',
        created_at: '2017-12-07T04:39:49.447Z',
        updated_at: '2017-12-07T04:39:49.447Z'
      }
    ]);
    expect(component.dataSource.data.length).toEqual(2);
    expect(component.dataSource.data[1].id).toEqual(2);
    expect(component.selectedRecord.id).toEqual(2);
    backend.verify();
  });

  it('should select empty record when list is empty', () => {
    backend.expectOne(`https://rails-rest.herokuapp.com/posts`).flush([]);
    expect(component.dataSource.data.length).toEqual(0);
    expect(component.selectedRecord.id).toBeNull();
    backend.verify();
  });

  it('should delete post', () => {
    backend.expectOne(`https://rails-rest.herokuapp.com/posts`).flush([
      {
        id: 1,
        title: 'Testing HttpClient',
        content: 'A long description...',
        created_at: '2017-12-07T04:39:49.447Z',
        updated_at: '2017-12-07T04:39:49.447Z'
      },
      {
        id: 2,
        title: 'Testing Components',
        content: 'Another long description...',
        created_at: '2017-12-07T04:39:49.447Z',
        updated_at: '2017-12-07T04:39:49.447Z'
      }
    ]);

    component.deleteRecord();
    const call = backend.expectOne(`https://rails-rest.herokuapp.com/posts/2.json`);
    expect(call.request.method).toEqual('DELETE');
    call.flush({});
    backend.expectOne(`https://rails-rest.herokuapp.com/posts`).flush([]);
    backend.verify();
  });
});
