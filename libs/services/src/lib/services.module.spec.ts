import { async, TestBed } from '@angular/core/testing';
import { ServicesModule } from './services.module';

describe('ServicesModule', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [ServicesModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(ServicesModule).toBeDefined();
  });
});
