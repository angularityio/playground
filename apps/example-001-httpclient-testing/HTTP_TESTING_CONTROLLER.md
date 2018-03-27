# Angular's HttpClient Testing in depth

v0.11

The new `HttpTestingController` that comes with the `@angular/common/http/testing` package is small and mighty, simple and powerful.  It provides only the following 4 methods but they can used to test a large variety of scenarios.

* expectOne
* expectNone
* match
* verify

I this article we will explore the usage of these methods in depth showing you how you can easily test your services and components with great flexibility.

You can find all the examples on [Github](https://github.com/angularityio/playground/blob/master/apps/example-001-httpclient-testing/src/app/posts-service.service.spec.ts#L32).


## What are we testing?

Wether you use a service from a component or you are building out your remote service layer you basically want to make sure of two things. First that the right requests are issues, secondly that you service or component behaves correctly based on a variety of responses. With the `HttpTestingController` is quite easy...let's check it out.

So in this example we are testing the `PostsServiceService` class which is a simple RESTful client allowing to list, create, update and delete blog posts. So basically issuing the following requests:

```
  Prefix Verb   URI Pattern              Controller#Action
  posts GET    /posts(.:format)          posts#index
        POST   /posts(.:format)          posts#create
  post  GET    /posts/:id(.:format)      posts#show
        PUT    /posts/:id(.:format)      posts#update
        DELETE /posts/:id(.:format)      posts#destroy
```

You can check this service [here](https://github.com/angularityio/playground/blob/master/apps/example-001-httpclient-testing/src/app/posts-service.service.ts#L22)

It basically uses Angular's new `common/http/HttpClient`. Let's look at one of the methods, the other follow a similar pattern.

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

To retrieve a specific blog post we issue a `get` request map the response to convert some dates but we don't call `subscribe` so the class that uses the `PostsServiceService` can control when the call is actually triggered and further more can chain other `RxJS` operators as needed.

So let's check how we can test this service.

## Let's go - The simplest case

In it's simplest form you want to make sure that a call with a given url is issued.

```TypeScript
    service.getAll().subscribe();
    backend.expectOne(`https://rails-rest.herokuapp.com/posts`);
    backend.verify();
```

In this case it has to match exactly the URL and the URL should not have any query parameters. Also be sure to call `subscribe` on the service otherwise nothing fires. Perfect it works. The `verify` method is there to ensure that no unexpected calls have been issued by the service.


## Expect one request

If you want to have a bit more control over what type of requests you expect you can pass a function instead of a string to the `requestOne` as follows:

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

But wait, there is way more, how to match url parameters, ensure the proper body is passed onto the request, and how course return we'll explore how to return variety of responses.


## Configuration

Let's step back just a bit and see what happens behind the scene.
When your service is used by your application running in the browser, not in test mode, when the service calls `http.get` an actual call to a server is issued, and a response come back a little bit later, asynchronously.  As we write unit tests we don't want to use a real server, we want to use a mock server and be able to return a variety of responses, to ensure your application behaves correctly in all circumstances. To this end Angular provides a mocking service that enables us to inspect the requests and control the response that are returned from each of the calls.

So let's see how we setup our test harness and mock server. First import the `HttpClientTestingModule` and `HttpTestingController`.

```
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
```

You basically just need to import the `HttpClientTestingModule` and provide `HttpTestingController`. When importing the testing module it imports for you the normal `HttpClientModule` which enables the HttpClient you use in your service, but it also provides `HttpBackend` as an instance of `HttpClientTestingBackend` which is the mock backend. Wow, that was a mouth full, so basically do the following:


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

Now when running your test whenever the service calls `http.get` your have access to all the requests and you can provide individual responses to these requests.

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

If you want to test a series of requests you can use `match` instead of `expectOne`. This can be the case of a complex service method that chains multiples calls.

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

You'll pass a matcher function to the `match` method and `match` will collect all matching requests. If you just return `true` you will get all the issued requests so far. Note that `match` doesn't fail the spec if there is not matches, it's just used to collect a call, you can write your expectations once you grabbed it.

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

Making sure your application issues the proper requests is important, but mostly your unit tests will make sure you app knows how to deal with actual server responses. When unit testing you are testing the various layers of your application, and the goal here is not to test the server, we reserve that for integration testing. The goal is to exhaustively test that your component can deal with a representative list of scenarios, for example with an empty response, with one record, with many records, a server or network error. Not only is writing unit tests faster than in browser debugging with the "save, reload browser, click here and their" cycle, especially if you use tools like wallaby.js or do focused testing (by using `fit` or `fdescribe` instead of `it` and `describe`).

 An easy way to get the JSON for a server responses is to use Postman, Curl, or the Chrome console to just copy the JSON a specific server request returns, then use that response in your test. For smaller payload it's also easy to just create the JSON inline in your test.  You can easily turn JSON saved from a real call into a Typescript file, or use the JSON directly in your spec if the payload is not too large. You can also use a fixture loader to use JSON into your specs but I haven't tried a fixture load out in an Angular 2+ project yet and I wrote some rather large test suites. I mostly have a fixture folder with many file like `get_policy.json.ts` that declares a constant with the payload. You may also want to have integration tests that tests parts of your application against a real server, but this is outside the scope of this article.

 One aspect to consider when writing test is to test actual code and not just the framework. For example in a service spec if you return a response to an `http.get` call that does not transform the response in any way, then you really didn't test anything else than the response your provided, which would be pointless. If on the other hand your service does additional transformation, then you test has value and allows you to ensure that your code works properly. For component testing that use services I see many developers mock the service call, however this can be tricky and requires to know how the service is implemented, I find it as efficient to simply `flush` the expected response using our mock backend (`HttpTestingController`) and ensure that the component behaves as expected.

 Now lets look at a few examples.



# Flushing a response

So when calling `expectOne` or `match` our mock backend returns an instance of `TestRequest` that has the following methods

* flush
* error
* event

These method allow to emulate a variety of results. In the example below we return an array of blog posts to the `getAll()` method and ensure that the expected length was returned but most importantly that our date transformation code works.

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
      backend.expectOne(`https://rails-rest.herokuapp.com/posts`).flush(response);   // <- Engage...sending response
      backend.verify();
```

# Creating a post

Similar than the previous scenario, after calling `backend.expectOne` we have an instance of the `TestRequest` and we ensure that the call request method is a `POST` before sending the response back to the service. Inside the subscribe block of the service call we use the `jasmine.objectContaining` utility that allows to check partial objects which is interesting when you receive a large payloads.

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
      const call: TestRequest = backend.expectOne(`https://rails-rest.herokuapp.com/posts`);
      expect(call.request.method).toEqual('POST');
      call.flush(response);
      backend.verify();
```

# When thing go wrong - responding to server errors

When flushing you can also add a specific status, for example a  Ruby on Rails server often return 422 when there is a validation error letting us know that the user provided some invalid data.

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

In addition to passing a status to the `flush` method you can also simply call the `error method`


```TypeScript
      backend.expectOne(`https://rails-rest.herokuapp.com/posts`).error(
        new ErrorEvent(''), {
        status: 422,
        statusText: 'Some server error'
      });
      backend.verify();
```


# Did you know... HttpClient Observable cleanup after themselves

The `HttpClient` completes it's observable once the full body has been returned or when an error occurs. So basically one request get's only one response. You subscription is dead afterwards, so not a very reactive approach, but then again this work pretty well and you can still wrap and chain your remote calls as we'll explore in the next section.  I assume this approach decided by the team to have a more familiar approach for developers coming from a world full of promises.

TODO:   Add link/reference to Promise

The following example shows that a request is cancelled after it is fired.

```TypeScript
      service.get(1).subscribe((response) => {
        expect(response.id).toEqual(1);
      });
      service.get(2).subscribe((response) => {
        expect(response.id).toEqual(2);
      });
      const call1: TestRequest = backend.expectOne(`https://rails-rest.herokuapp.com/posts/1.json`);
      const call2: TestRequest = backend.expectOne(`https://rails-rest.herokuapp.com/posts/2.json`);
      call2.flush({id: 2});
      expect(call2.cancelled).toBeTruthy(); // http.get close after firing.
      call1.flush({id: 1});
      backend.verify();
```

When you look at the actual implementation of `HttpXhrBackend` you'll see that the code effectively completes the observable up receiving a successful response:
https://github.com/angular/angular/blob/master/packages/common/http/src/xhr.ts#L218

Now the testing framework emulates this behavior, check out `TestRequest`:

https://github.com/angular/angular/blob/master/packages/common/http/testing/src/request.ts#L66


# Reactive Style `switchMap` example

One coding practice I see in many projects, often spearheaded by NgRx, is to wrap your call by your of chain of Observables. One advantage is for example when using the `switchMap` operation is to be able to cancel requests that haven't returned yet which you would like to ignore. This can be the case when having multiple calls (i.e., master details) where when you select a master some details information is retrieve remotely, the user select a new master record before the details calls are complete. Basically this occurs on slow networks or with hyper caffeinated users and could lead to information that is out of sync being displayed on the screen.

TODO: add link to NgRx.

This is the last example, so please bear with me. This time the service uses an `rxjs/Subject` to which a component can subscribe. This subscription doesn't close, the component should unsubscribe in it's ngDestroy method.

For this demo the service declares the following `setupGetRequestSubject`. I agree naming could be better.

```TypeScript
  setupGetRequestSubject(): Observable<any> {
    return this.getRequestSubject.switchMap(id => this.get(id)).share();
  }
```
So we have one active observable that is triggered every time the `getViaSubject` method is invoked.

```TypeScript
  getViaSubject(id):void  {
    this.getRequestSubject.next(id);
  }
```

That Subject is long lived and triggers itself the `http.get` calls which are short lived. The advantage is now we can wrap the call with `switchMap` and ensuring that if we have multiple calls in sequence only the last one actually is taken into account.

In the test below we show that two calls can be issued before a response comes back, and the second call one cancels the first one. Although the call is cancelled our subscription is still alive and we can issue further calls.

```TypeScript
      let counter = 2;
      service.setupGetRequestSubject().subscribe((response) => {
        expect(response.id).toEqual(counter++);
        expect(response.id).toBeGreaterThan(1);
        expect(response.id).toBeLessThan(4);
      });
      service.getViaSubject(1);
      service.getViaSubject(2);
      const call1 = backend.expectOne(`https://rails-rest.herokuapp.com/posts/1.json`);
      const call2 = backend.expectOne(`https://rails-rest.herokuapp.com/posts/2.json`);
      expect(call1.cancelled).toBeTruthy(); // second call cancelled first one
      call2.flush({id: 2});
      expect(call2.cancelled).toBeTruthy();
      service.getViaSubject(3);
      const call3 = backend.expectOne(`https://rails-rest.herokuapp.com/posts/3.json`);
      expect(call3.cancelled).toBeFalsy();
      call3.flush({id: 3});
      expect(call3.cancelled).toBeTruthy();
      backend.verify();
```

I feel this example was a bit convoluted, but hopefully it shows how you can use Angular's awesome testing framework to explore how your application issues requests and uses Observables. This can be tricky to get right sometimes and the `@angular/common/http/testing` library is your indispensable friend in this scenario.

TODO: indispensable <- check english equivalent

# verify?

By now you guessed it... we use `backend.verify()` to make sure they are no calls we missed.

# Further reading:

* The Angular spec describing the `HttpClient` behavior is a good read for understanding all the aspects of the HttpClient class. Might be good material for an article?  https://github.com/angular/angular/blob/master/packages/common/http/test/client_spec.ts#L19


* This code can be found on Github
 [https://github.com/angularityio/playground/blob/master/apps/example-001-httpclient-testing/src/app/posts-service.service.spec.ts](https://github.com/angularityio/playground/blob/master/apps/example-001-httpclient-testing/src/app/posts-service.service.spec.ts#L32)



Enjoy!

Daniel


PS:

* Please reach out on twitter @danielwanja or by email daniel@angularity.io
* I'm sure I missed something obvious in this article, so please let me know so I can improve it.
