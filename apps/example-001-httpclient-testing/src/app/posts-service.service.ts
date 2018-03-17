import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PostsServiceService {
  constructor(private http: HttpClient) {}

  getAll(params?: any): Observable<any> {
    const options = params ? {params: params} : {};
    return this.http.get(`${environment.api}/posts`, options);
  }

  get(id): Observable<any>  {
    return this.http.get(`${environment.api}/posts/${id}.json`);
  }

  save(post): Observable<any> {
    if (post.id) {
      return this.update(post);
    } else {
      return this.create(post);
    }
  }

  create(post): Observable<any> {
    return this.http.post(`${environment.api}/posts`, post);
  }

  update(post): Observable<any> {
    return this.http.put(`${environment.api}/posts/${post.id}.json`, post);
  }

  delete(post): Observable<any> {
    return this.http.delete(`${environment.api}/posts/${post.id}.json`);
  }

}
