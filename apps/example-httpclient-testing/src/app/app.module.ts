import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NxModule } from '@nrwl/nx';
import { EnvironmentService } from 'libs/services/src/lib/environment.service';
import { environment } from '../environments/environment';
import { AppExampleHttpclientTestingModule } from '@playground/app/example-httpclient-testing';

export function environmentServiceFactory(
  environment: any
): EnvironmentService {
  return new EnvironmentService(environment);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NxModule.forRoot(),
    AppExampleHttpclientTestingModule
  ],
  providers: [
    {
      provide: EnvironmentService,
      useValue: new EnvironmentService(environment)
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
