import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainComponent } from './main.component';
import { AppExampleHttpclientTestingModule } from '../app-example-httpclient-testing.module';
import { BlogPostsService } from '../blog-posts.service';
import { EnvironmentService } from '@playground/services';
import { environment } from '../../environments/environment.test';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [AppExampleHttpclientTestingModule],
        providers: [
          BlogPostsService,
          {
            provide: EnvironmentService,
            useValue: new EnvironmentService(environment)
          }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
