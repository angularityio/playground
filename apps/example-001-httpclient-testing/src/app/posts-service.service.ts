import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
// import { switchMap, map } from 'rxjs/operators';

@Injectable()
export class PostsServiceService {
  private getRequestSubject: Subject<String> = new Subject<String>();

  constructor(private http: HttpClient) {
  }

  getAll(params?: any): Observable<any> {
    const options = params ? {params: params} : {};
    return this.http.get(`${environment.api}/posts`, options)
      .map((posts: any[]) => {
        posts.map(post => this.convertDates(post));
        return posts;
      });
  }

  get(id): Observable<any>  {
    return this.http.get(`${environment.api}/posts/${id}.json`)
      .map((post) => this.convertDates(post) );
  }

  save(post): Observable<any> {
    if (post.id) {
      return this.update(post);
    } else {
      return this.create(post);
    }
  }

  create(post): Observable<any> {
    return this.http.post(`${environment.api}/posts`, post)
            .map((createdPost) => this.convertDates(createdPost) );
  }

  update(post): Observable<any> {
    return this.http.put(`${environment.api}/posts/${post.id}.json`, post);
  }

  delete(post): Observable<any> {
    return this.http.delete(`${environment.api}/posts/${post.id}.json`);
  }

  /**
   * A reactive style service layer with switchMap example:
   */
  setupGetRequestSubject(): Observable<any> {
    return this.getRequestSubject.switchMap(id => this.get(id)).share();
  }

  getViaSubject(id):void  {
    this.getRequestSubject.next(id);
  }

  protected convertDates(post): any {
    if (post) {
      ['created_at', 'updated_at'].forEach((dateField) => {
        if (moment(post[dateField]).isValid()) {
          post[dateField] = moment(post[dateField]).toDate();
        }
      })
    }
    return post;
  }

}
