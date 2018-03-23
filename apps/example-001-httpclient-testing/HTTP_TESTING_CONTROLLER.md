# Http Testing in depth

The new `HttpTestingController` that comes with the `@angular/common/http/testing` package is small and mighty, simple and powerfull.  It provides only the following 4 methods but they can used to test a large variety of scenarios.

* expectOne
* expectNone
* match
* verify

I this article we will explore it quite in depth.

You can find all the examples on [Github](https://github.com/angularityio/playground/blob/master/apps/example-001-httpclient-testing/src/app/posts-service.service.spec.ts#L32).


## What are we testing.

Wether you use a service from a component or you are building out your remote service layer you basically want to make sure of two things. First that the right requests are issues, secondly that you service or component behaves correctly based on a variety of responses. With the `HttpTestingController` is quite easy...let's check it out.

So in this example we are testing the `PostsServiceService` class which is a simple RESTful client
allowing to list, create, update and delete blog posts. So basically issuing the following requests:

```
  Prefix Verb   URI Pattern              Controller#Action
  posts GET    /posts(.:format)          posts#index
        POST   /posts(.:format)          posts#create
  post  GET    /posts/:id(.:format)      posts#show
        PUT    /posts/:id(.:format)      posts#update
        DELETE /posts/:id(.:format)      posts#destroy
```

You can check this service here: https://github.com/angularityio/playground/blob/master/apps/example-001-httpclient-testing/src/app/posts-service.service.ts#L22

It basically uses Angular's new `common/http/HttpClient`. Let's look at one of the methods, the other
follow a similar pattern.

```TypeScript
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PostsServiceService {
  private getRequestSubject: Subject<String> = new Subject<String>();

  constructor(private http: HttpClient) { }

  get(id): Observable<any>  {
    return this.http.get(`${environment.api}/posts/${id}.json`)
      .map((post) => this.convertDates(post) );
  }

}
```

To retrieve a specific blog post we issue a `get` request map the response to convert some dates but
we don't call `subscribe` so the class that uses the `PostsServiceService` can control when the call
is actually trigger and further more can chain other `RxJS` operators as needed.

So let's check how we can test this service.

## Let's go - The simplest case

In it's simplest form you want to make sure that a call with a given url is issued.

```TypeScript
    service.getAll().subscribe();
    backend.expectOne(`https://rails-rest.herokuapp.com/posts`);
    backend.verify();
```

Note in this case it has to match exaclty the URL and the URL should not have any query parameters.
Also be sure to `subscribe` is needed or nothing fires. Perfect it works.

## Expect one request

If you want to have a bit more control over what type of requests you expect you can pass a function instead of
a string to the `requestOne` as follows:

```TypeScript
      service.getAll().subscribe();
      backend.expectOne((request) => {
        return request.url.match(/posts/) &&
              request.method === 'GET';
      });
      backend.verify();
```

Note here we match the url string, so this gives you a bit more flexibility on what to match.

If you just want to check an expected url and method you can also use the following form:

```TypeScript
      service.getAll().subscribe();
      backend.expectOne({url: `https://rails-rest.herokuapp.com/posts`, method: 'GET'});
      backend.verify();
```

But wait, there is way more, how to match url parameters, ensure the proper body is passed onto the request,
and how course return a variety response.


## Configuration

Let's step back just a bit and see what happens behind the scene. The services does call `http.get`
but does no remote call is made. Angular provides a mocking service that enables us to inspect the requests and
control the response that are returned from each of the calls.

So let's see how we setup our test harness. First import the `HttpClientTestingModule` and `HttpTestingController`.

```
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
```

You basically just need to import the `HttpClientTestingModule` and provide `HttpTestingController`.
When importing the testing module it imports for you the normal `HttpClientModule` which enables
the HttpClient you use in your service, but it also provides `HttpBackend` as an instance of `HttpClientTestingBackend`
which is the mock backend. Wow, that was a mouth full, so basically do the following:


```TypeScript
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

}
```

And now `backend` is the mock we use in all our examples. This works across all classes, components,
service, wether your own or third party ones... as long they use the new `@angular/common/http/HttpClient`.


# expectOne returns a TestRequest

```TypeScript
      service.getAll().subscribe();
      const call: TestRequest = backend.expectOne(`https://rails-rest.herokuapp.com/posts`);
      expect(call.request.method).toEqual('GET');
      backend.verify();
```

# match instead of expectOne

```TypeScript
      service.getAll().subscribe();
      backend.match((request) => {
        return request.url.match(/posts/) &&
               request.method === 'GET';
      });
      backend.verify();
```

# match more than one

```TypeScript
      service.getAll().subscribe();
      service.get(1).subscribe();
      backend.match((request) => {
        return request.url.match(/posts/) &&
              request.method === 'GET';
      });
      backend.verify();
```

TODO: merge these two examples

```TypeScript
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
```

# match different requests

```TypeScript
```

# What about url with params?

Glad you asked

```TypeScript
      service.getAll({page: 1}).subscribe();
      const calls = backend.match((request) => {
        return request.url == `https://rails-rest.herokuapp.com/posts` &&
               request.urlWithParams == `https://rails-rest.herokuapp.com/posts?page=1` &&
               request.method === 'GET';
      });
      backend.expectNone(`https://rails-rest.herokuapp.com/posts`); // If url with params, use `.match`
      backend.verify();
```

# And a few more useful attributes

```TypeScript
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
```
# Requests and responses

Onto returning responses.
TODO: explain the following
        // The benefits here are not to test the data you entered but really to test
        // that your service or component handle specific response appropriately.


# Flushing a response

```TypeScript
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
        expect(result[0].created_at).toEqual(new Date('2017-12-07T04:39:49.447Z'));
      });
      backend.expectOne(`https://rails-rest.herokuapp.com/posts`).flush(response);
      backend.verify();
```

# Flushing differently

```TypeScript
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
```

# Creating a post

speak about data conversion and jasmine.objectContaining

```TypeScript
      service.save({
        title: 'Creating a post',
        content: 'Another long description...'
      }).subscribe((response) => {
        expect(response).toEqual(jasmine.objectContaining({
          id: 2,
          title: 'Creating a post',
          content: jasmine.any(String),
          created_at: new Date('2017-12-07T04:39:49.447Z'),
          updated_at: jasmine.any(Date)
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
```

# When thing go wrong - responding to server errors

```TypeScript
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
```

# And network errors

```TypeScript
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
```

# Update example

see if it adds anyting compare to create...ditto for delete

```TypeScript
```

# Did you know... HttpClient Observable cleanup after themself

```TypeScript
      service.get(1).subscribe((response) => {
        expect(response.id).toEqual(1);
      });
      service.get(2).subscribe((response) => {
        expect(response.id).toEqual(2);
      });
      const call1 = backend.expectOne(`https://rails-rest.herokuapp.com/posts/1.json`);
      const call2 = backend.expectOne(`https://rails-rest.herokuapp.com/posts/2.json`);
      call2.flush({id: 2});
      expect(call2.cancelled).toBeTruthy(); // http.get close after firing.
      call1.flush({id: 1});
      backend.verify();
```

# Reactive Style `switchMap` example

explain about data synchronization issues due to non-cancelled calls
and how to use `switchMap` to avoid this.

```TypeScript
      service.setupGetRequestSubject().subscribe((response) => {
        expect(response.id).toEqual(2);
      });
      service.getViaSubject(1);
      service.getViaSubject(2);
      const call1 = backend.expectOne(`https://rails-rest.herokuapp.com/posts/1.json`);
      const call2 = backend.expectOne(`https://rails-rest.herokuapp.com/posts/2.json`);
      expect(call1.cancelled).toBeTruthy();
      call2.flush({id: 2});
      backend.verify();
```





# verify?

By now you guessed it... we use `backend.verify()` to make sure they are no calls we missed.

TODO: finish writing article...them make it way smaller.

```TypeScript
```




**ARTICLE UNDER CONSTRUCTION :-)** Will explain in details the following examples: [https://github.com/angularityio/playground/blob/master/apps/example-001-httpclient-testing/src/app/posts-service.service.spec.ts](https://github.com/angularityio/playground/blob/master/apps/example-001-httpclient-testing/src/app/posts-service.service.spec.ts#L32)