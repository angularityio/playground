import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PostsServiceService {
  constructor(private http: HttpClient) {}

  getPosts(): Observable<any> {
    console.log(`******${environment.api}/posts`)
    return this.http.get(`${environment.api}/posts`);
  }

  getPost(id) {
    this.http.get(`${environment.api}/posts/${id}.json`);
  }

  savePost(post) {

  }

  createPost(post) {

  }

  updatePost(post) {

  }

  deletePost(post) {

  }

}
