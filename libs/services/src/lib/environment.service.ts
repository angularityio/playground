import { Injectable } from '@angular/core';

/**
 * Allows application to control the environment and library to use it.
 */
@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  constructor(public environment: any) {}
}
