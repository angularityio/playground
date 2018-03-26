# Http Testing in depth

The new `HttpTestingController` that comes with the `@angular/common/http/testing` package is small and mighty, simple and powerfull.  It provides only the following 4 methods but they can used to test a large variety of scenarios.

* expectOne
* expectNone
* match
* verify

I this article we will explore these in depth showing you how can easily test a your services and components with great flexibility.

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
is actually triggered and further more can chain other `RxJS` operators as needed.

So let's check how we can test this service.

## Let's go - The simplest case

In it's simplest form you want to make sure that a call with a given url is issued.

```TypeScript
    service.getAll().subscribe();
    backend.expectOne(`https://rails-rest.herokuapp.com/posts`);
    backend.verify();
```

In this case it has to match exaclty the URL and the URL should not have any query parameters. Also be sure to call `subscribe` on the service otherwise nothing fires. Perfect it works. The `verify` method is there to ensure that no unexpected calls have been issued by the service.


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

Note here we match the URL string, so this gives you a bit more flexibility on what to match. The request is an instance of `HttpRequest` and will explore this class more in depth in a little bit.

If you just want to check an expected url and method you can also use the following form:

```TypeScript
      service.getAll().subscribe();
      backend.expectOne({url: `https://rails-rest.herokuapp.com/posts`, method: 'GET'});
      backend.verify();
```

But wait, there is way more, how to match url parameters, ensure the proper body is passed onto the request,
and how course return we'll explore how to return variety of responses.


## Configuration

Let's step back just a bit and see what happens behind the scene.
When your service is used by your application running in the browser, not in test mode, when the service calls `http.get` an actuall call to a server is issued, and a response come back a little bit latter, asynchronously.  As we write unit tests we don't want to use a real server, we want to use a mock server and be able to return a variety of responses, to ensure your application behaves corretly in all circumstances. To this end Angular provides a mocking service that enables us to inspect the requests and control the response that are returned from each of the calls.

So let's see how we setup our test harness and mock server. First import the `HttpClientTestingModule` and `HttpTestingController`.

```
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
```

You basically just need to import the `HttpClientTestingModule` and provide `HttpTestingController`. When importing the testing module it imports for you the normal `HttpClientModule` which enables
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

And now `backend` is the mock we use in all our examples. This works across all classes, components, service, wether your own or third party ones... as long they use the new `@angular/common/http/HttpClient`.

Now when running your test whenever the service calls `http.get`
your have access to all the requests and you can provide individual responses to these requests.

Let's get back to testing some more.

# expectOne returns a TestRequest

The call to `expectOne` return an instance of `TestRequest` that you can use to access the request, wether the request has been cancelled and more importantly, as we'll show in a bit, can be used to emulate responses from the server.

Here you can see that we can access the method and ensure that it uses the proper method.

```TypeScript
      service.getAll().subscribe();
      const call: TestRequest = backend.expectOne(`https://rails-rest.herokuapp.com/posts`);
      expect(call.request.method).toEqual('GET');
      backend.verify();
```

# match instead of expectOne

If you want to test a serie of requests you can use `match` instead of `expectOne`. This can be the case of a complex service method that chains mulltiples calls.

In the example below we simply issue two calls directly in the test, but you can use this approach to test more complex service methods.

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

You'll pass a matcher function to the `match` method and `match` will collect all matching requests. If you just return `true` you will get all the issued requests so far. Note that `match` doesn't fail the spec is there is not matches, it's just used to collect a call, you can write your expectations once you grabbed it.

# match different requests

If for some reasons you wanted to segregate different calls you can even have multiple matches as shown bellow.

```TypeScript
      service.getAll().subscribe();
      service.get(1).subscribe();
      const otherCalls = backend.match((request) => {
        return request.url == `https://rails-rest.herokuapp.com/posts/1.json` &&
               request.method === 'GET';
      });
      const calls = backend.match((request) => {
        return request.url == `https://rails-rest.herokuapp.com/posts` &&
               request.method === 'GET';
      });
      expect(calls.length).toEqual(1);
      expect(otherCalls.length).toEqual(1);
      expect(calls[0].request.url).toEqual(`https://rails-rest.herokuapp.com/posts`);
      expect(otherCalls[0].request.url).toEqual(`https://rails-rest.herokuapp.com/posts/1.json`);
      backend.verify();
```

We now have two lists of calls. This just demonstrates that you have lots of flexibility `match`.

# What about url with params?

Glad you asked. `expectOne` expects an exact url without url parameters. If you expect `/posts` it wouldn't match `/posts?page=1`. If you need that level of granularity, for example you want to ensure you pagination logic issues the right parameters, the you can use `match` in conjunction with `request.params` or `request.urlWithParams`. Et voilà!

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

The expect match function signature is the following:

`((req: HttpRequest<any>) => boolean)`

The `HttpRequest` class has more useful parameters you will certainly use when you write your tests. Here is a more extensive use

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

Making sure you app issues the proper requests is important, but mostly all your tests will make sure you app knows how to deal with actual server responses. As we are doing unit test we are testing the various layers of your application, but we are not testing your server. An easy way to get server responses is to use Postman, Curl, or the Chrome console to just copy the JSON a specific server request returns, then use that response in your test.

You can easily turn JSON into a Typescript file, or use the JSON directly in your spec if the payload is not too large. You can also use a fixture loader to use JSON into your specs but I haven't tried that out in an Angular 2+ project yet. You may have integration tests to test that your application works against a real server, but this is outside the scope of this artical.

[CONTINUE HERE]
* When providing a response you want to make sure you are actually testing relevant code of your service or component.
* For example a service call that doesn't transform your response in any way
* One aspect to think about is what are you testing. You want to make sure that you test

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