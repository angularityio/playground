import { async, TestBed } from '@angular/core/testing';
import { AppExampleHttpclientTestingModule } from './app-example-httpclient-testing.module';

describe('AppExampleHttpclientTestingModule', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [AppExampleHttpclientTestingModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(AppExampleHttpclientTestingModule).toBeDefined();
  });
});
