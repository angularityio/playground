import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { SvgComponent } from './svg/svg.component';
import { SvgElementComponent } from './svg-element/svg-element.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [AppComponent, SvgComponent, SvgElementComponent]
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
