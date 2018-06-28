import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AppExampleHttpclientTestingModule } from '@playground/app/example-httpclient-testing';
import { EnvironmentService } from '@playground/services';
import { environment } from '../environments/environment';
describe('AppComponent', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [AppComponent],
        imports: [AppExampleHttpclientTestingModule],
        providers: [
          {
            provide: EnvironmentService,
            useValue: new EnvironmentService(environment)
          }
        ]
      }).compileComponents();
    })
  );
  it(
    'should create the app',
    async(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;
      expect(app).toBeTruthy();
    })
  );
});
