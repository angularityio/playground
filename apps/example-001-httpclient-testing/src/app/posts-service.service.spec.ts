import { TestBed, inject } from '@angular/core/testing';

import { PostsServiceService } from './posts-service.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../environments/environment';

describe('PostsServiceService', () => {
  let service: PostsServiceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PostsServiceService],
      imports: [
        HttpClientTestingModule
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(PostsServiceService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should getPosts', () => {
    const response = [{
      'id': 1,
      'title': 'Testing HttpClient',
      'content': 'A long description...',
      'created_at': '2017-12-07T04:39:49.447Z',
      'updated_at': '2017-12-07T04:39:49.447Z'
    }];
    service.getAll().subscribe((result) => {
      expect(result.length).toEqual(1);
    });
    httpMock.expectOne(`https://rails-rest.herokuapp.com/posts`).flush(response);
    httpMock.verify();
  });

  it('should getPost', () => {
    const response = {
      'id': 1,
      'title': 'Testing HttpClient',
      'content': 'A long description...',
      'created_at': '2017-12-07T04:39:49.447Z',
      'updated_at': '2017-12-07T04:39:49.447Z'
    };
    service.get(1).subscribe((result) => {
      expect(result.title).toEqual('Testing HttpClient');
    });
    const call = httpMock.expectOne(`https://rails-rest.herokuapp.com/posts/1.json`);
    expect(call.request.method).toEqual('GET');
    call.flush(response);
    httpMock.verify();
  });

  it('should create post', () => {
    service.save({
      title: 'Creating a post',
      content: 'Another long description...'
    }).subscribe((result) => {
      expect(result.id).toEqual(2);
    });
    const response = {
      'id': 2,
      'title': 'Creating a post',
      'content': 'Another long description...',
      'created_at': '2017-12-07T04:39:49.447Z',
      'updated_at': '2017-12-07T04:39:49.447Z'
    };
    const calls = httpMock.match( (request) => {
      return request.url === `https://rails-rest.herokuapp.com/posts` &&
             request.method === 'POST';
    });
    expect(calls.length).toEqual(1);
    calls[0].flush(response);
    httpMock.verify();
  });

  it('should update post', () => {
    service.save({
      id: 2,
      title: 'Updating a post'
    }).subscribe((result) => {
      expect(result.id).toEqual(2);
    });
    const response = {
      'id': 2,
      'title': 'Updating a post',
      'content': 'Another long description...',
      'created_at': '2017-12-07T04:39:49.447Z',
      'updated_at': '2017-12-07T04:39:49.447Z'
    };
    const call = httpMock.expectOne(`https://rails-rest.herokuapp.com/posts/2.json`);
    expect(call.request.method).toEqual('PUT');
    call.flush(response);
    httpMock.verify();
  });

  it('should delete post', () => {
    service.delete({
      id: 2,
    }).subscribe();
    const call = httpMock.expectOne(`https://rails-rest.herokuapp.com/posts/2.json`);
    expect(call.request.method).toEqual('DELETE');
    call.flush({});
    httpMock.verify();
  });

  // TODO
  // 1) flush with status i.e. 422
  // 2) Error handling i.e. network error
  //    call.error(
  //      new ErrorEvent(''), {
  //      status: 422,
  //      statusText: 'Some server error'
  //    });
  // 3) Interceptor?
});
