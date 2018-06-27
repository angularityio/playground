import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NxModule } from '@nrwl/nx';
import { SvgComponent } from './svg/svg.component';
import { SvgElementComponent } from './svg-element/svg-element.component';

@NgModule({
  imports: [BrowserModule, NxModule.forRoot()],
  declarations: [AppComponent, SvgComponent, SvgElementComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
