import { TestBed, inject } from '@angular/core/testing';

import { PostsServiceService } from './posts-service.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../environments/environment';
import { HttpHeaders } from '@angular/common/http';

/**
 * This test suite show several aspects of using the HttpTestingController I will
 * write about in a blog post.
 */
describe('PostsServiceService', () => {
  let service: PostsServiceService;
  let backend: HttpTestingController;

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
    backend = TestBed.get(HttpTestingController);
  });

  describe('requests', () => {

    it('should expectOne', () => {
      service.getAll().subscribe();
      backend.expectOne(`https://rails-rest.herokuapp.com/posts`);
      backend.verify();
    });

    it('should not expect one when not subscribed', () => {
      service.getAll()// .subscribe();
      backend.expectNone(`https://rails-rest.herokuapp.com/posts`);
      backend.verify();
    });

    it('should not expect two', () => {
      service.getAll().subscribe();
      backend.expectOne(`https://rails-rest.herokuapp.com/posts`);
      backend.expectNone(`https://rails-rest.herokuapp.com/posts`);
      backend.verify();
    });

    it('should expectOne request', () => {
      service.getAll().subscribe();
      backend.expectOne((request) => {
        return request.url.match(/posts/) &&
              request.method === 'GET';
      });
      backend.verify();
    });

    it('should expectOne request different style (using TestRequest)', () => {
      service.getAll().subscribe();
      const call = backend.expectOne(`https://rails-rest.herokuapp.com/posts`);
      expect(call.request.method).toEqual('GET');
      backend.verify();
    });

    it('should match', () => {
      service.getAll().subscribe();
      backend.match((request) => {
        return request.url.match(/posts/) &&
               request.method === 'GET';
      });
      backend.verify();
    });

    it('should match two requests', () => {
      service.getAll().subscribe();
      service.get(1).subscribe();
      backend.match((request) => {
        return request.url.match(/posts/) &&
              request.method === 'GET';
      });
      backend.verify();
    });

    it('should match two requests', () => {
      service.getAll().subscribe();
      service.get(1).subscribe();
      const calls = backend.match((request) => {
        return request.url.match(/posts/) &&
               request.method === 'GET';
      });
      expect(calls.length).toEqual(2);
      expect(calls[0].request.url).toEqual(`https://rails-rest.herokuapp.com/posts`);
      expect(calls[1].request.url).toEqual(`https://rails-rest.herokuapp.com/posts/1.json`);
      backend.verify();
    });

    it('should match different requests', () => {
      service.getAll().subscribe();
      service.get(1).subscribe();
      const calls = backend.match((request) => {
        return request.url == `https://rails-rest.herokuapp.com/posts` &&
               request.method === 'GET';
      });
      const otherCalls = backend.match((request) => {
        return request.url == `https://rails-rest.herokuapp.com/posts/1.json` &&
               request.method === 'GET';
      });
      expect(calls.length).toEqual(1);
      expect(otherCalls.length).toEqual(1);
      expect(calls[0].request.url).toEqual(`https://rails-rest.herokuapp.com/posts`);
      expect(otherCalls[0].request.url).toEqual(`https://rails-rest.herokuapp.com/posts/1.json`);
      backend.verify();
    });

    it('should have url and urlWithParams', () => {
      service.getAll({page: 1}).subscribe();
      const calls = backend.match((request) => {
        return request.url == `https://rails-rest.herokuapp.com/posts` &&
               request.urlWithParams == `https://rails-rest.herokuapp.com/posts?page=1` &&
               request.method === 'GET';
      });
      backend.expectNone(`https://rails-rest.herokuapp.com/posts`); // If url with params, use `.match`
      backend.verify();
    });

    it('should a few more attributes on request that are useful', () => {
      service.getAll({page: 1}).subscribe();
      const calls = backend.match((request) => {
        return request.url == `https://rails-rest.herokuapp.com/posts` &&
               request.urlWithParams == `https://rails-rest.herokuapp.com/posts?page=1` &&
               request.method === 'GET' &&
               request.params.get('page') == '1' &&
               request.body == null &&
               request.headers instanceof HttpHeaders &&
               request.responseType == 'json' &&
               request.withCredentials == false;
      });
      backend.expectNone(`https://rails-rest.herokuapp.com/posts`); // If url with params, use `.match`
      backend.verify();
    });


  });

  describe('requests', () => {

    it('should getPosts', () => {
      const response = [{
        'id': 1,
        'title': 'Testing HttpClient',
        'content': 'A long description...',
        'created_at': '2017-12-07T04:39:49.447Z',
        'updated_at': '2017-12-07T04:39:49.447Z'
      }];
      service.getAll().subscribe((result) => {
        // The benefits here are not to test the data you entered but really to test
        // that your service or component handle specific response appropriately.
        expect(result.length).toEqual(1);
        expect(result[0].title).toEqual('Testing HttpClient');
      });
      backend.expectOne(`https://rails-rest.herokuapp.com/posts`).flush(response);
      backend.verify();
    });

    it('should getPost different style', () => {
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
      const call = backend.expectOne(`https://rails-rest.herokuapp.com/posts/1.json`);
      expect(call.request.method).toEqual('GET');
      call.flush(response);
      backend.verify();
    });

    it('should create post', () => {
      service.save({
        title: 'Creating a post',
        content: 'Another long description...'
      }).subscribe((response) => {
        expect(response).toEqual(jasmine.objectContaining({
          id: 2,
          title: 'Creating a post',
          content: jasmine.any(String)
        }));
      });
      const response = {
        'id': 2,
        'title': 'Creating a post',
        'content': 'Another long description...',
        'created_at': '2017-12-07T04:39:49.447Z',
        'updated_at': '2017-12-07T04:39:49.447Z'
      };
      const call = backend.expectOne(`https://rails-rest.herokuapp.com/posts`);
      expect(call.request.method).toEqual('POST');
      call.flush(response);
      backend.verify();
    });

    it('should handle server error', () => {
      service.save({
        title: 'Trying something dangerous'
      }).subscribe((response) => {
        throw('Should not land here');
      }, (error) => {
        expect(error.status).toEqual(422);
        expect(error.statusText).toEqual('Boom');
      });

      backend.expectOne(`https://rails-rest.herokuapp.com/posts`).flush({}, {status: 422, statusText: 'Boom'});
      backend.verify();
    });

    it('should handle network error', () => {
      service.save({
        title: 'Trying something dangerous'
      }).subscribe((response) => {
        throw('Should not land here');
      }, (error) => {
        expect(error.status).toEqual(422);
        expect(error.statusText).toEqual('Some server error');
      });

      backend.expectOne(`https://rails-rest.herokuapp.com/posts`).error(
        new ErrorEvent(''), {
        status: 422,
        statusText: 'Some server error'
      });
      backend.verify();
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
      const call = backend.expectOne(`https://rails-rest.herokuapp.com/posts/2.json`);
      expect(call.request.method).toEqual('PUT');
      call.flush(response);
      backend.verify();
    });

    it('should delete post', () => {
      service.delete({
        id: 2,
      }).subscribe();
      const call = backend.expectOne(`https://rails-rest.herokuapp.com/posts/2.json`);
      expect(call.request.method).toEqual('DELETE');
      call.flush({});
      backend.verify();
    });

  });

});
