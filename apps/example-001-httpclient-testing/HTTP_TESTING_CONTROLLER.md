# Angular's HttpClient Testing in depth

The new `HttpTestingController` class that comes with the `@angular/common/http/testing` package is small and mighty, simple and powerful.  It provides only the following four methods that can be used to test a large variety of scenarios.

* expectOne
* expectNone
* match
* verify

I this article we will explore the usage of these methods showing you how you can test your services and components with great flexibility.

You can find all the examples on [Github](https://github.com/angularityio/playground/blob/master/apps/example-001-httpclient-testing/src/app/blog-posts.service.spec.ts#L32).


## What are we testing?

Whether you use a service from a component or you are building out your remote service layer you want to make sure of two things. First that the correct requests are issues, secondly that you service or component behaves correctly based on a variety of responses. With the `HttpTestingController` it is quite easy... let's check it out.

So in this example, we are testing the `BlogPostsService` class which is a simple RESTful client allowing to list, create, update and delete blog posts. So basically issuing the following requests:

```
  Prefix Verb   URI Pattern              Controller#Action
  posts GET    /posts(.:format)          posts#index
        POST   /posts(.:format)          posts#create
  post  GET    /posts/:id(.:format)      posts#show
        PUT    /posts/:id(.:format)      posts#update
        DELETE /posts/:id(.:format)      posts#destroy
```

You can view the code of the PostService class  [here](https://github.com/angularityio/playground/blob/master/apps/example-001-httpclient-testing/src/app/blog-posts.service.ts#L22)

It uses Angular's new `common/http/HttpClient`. Let's look at one of the methods the service implements; the others follow a similar pattern.

```TypeScript
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BlogPostsService {
  private getRequestSubject: Subject<String> = new Subject<String>();

  constructor(private http: HttpClient) { }

  get(id): Observable<any>  {
    return this.http.get(`${environment.api}/posts/${id}.json`)
      .map((post) => this.convertDates(post) );
  }

}
```

To retrieve a specific blog post, we issue a `get` request then map the response to convert some dates. Notice we don't call `subscribe` here so the class that uses the `BlogPostsService` can control when the call is triggered, and furthermore can chain other `RxJS` operators as needed.

So let's check how we can test this service.

## Let's go - The simplest case

In it's simplest form you want to make sure that the service issues a call for a given URL:

```TypeScript
    service.getAll().subscribe();
    backend.expectOne(`https://rails-rest.herokuapp.com/posts`);
    backend.verify();
```

In this case, it has to match the URL, and the URL should not have any query parameters. Also be sure to call `subscribe` on the service otherwise no requests fires. Perfect it works. The `verify` method is there to ensure that the service issues no unexpected calls.


## Expect one request

If you want to have a bit more control over what type of requests you expect you can pass a function instead of a string to the `requestOne` method as follows:

```TypeScript
      service.getAll().subscribe();
      backend.expectOne((request) => {
        return request.url.match(/posts/) &&
              request.method === 'GET';
      });
      backend.verify();
```

Here we use the JavaScript string matching function to check any requests that have the word "posts" in its URL and use a 'GET' method. The request is an instance of `HttpRequest` and we will explore this class more in-depth in a little bit.

If you only want to check an expected URL and method you can use the following form:

```TypeScript
      service.getAll().subscribe();
      backend.expectOne({url: `https://rails-rest.herokuapp.com/posts`, method: 'GET'});
      backend.verify();
```

But wait, there is way more, you can match URL parameters, and ensure that the proper content is passed onto the request, and of course, we'll explore how to return a variety of responses.


## Configuration

Let's step back just a bit and see what happens behind the scenes.
When your application is running in the browser, not in test mode, and the service invokes `http.get` then an actual call to a server is issued, and a little bit later a response comes back asynchronously.  However, when we write unit tests we don't want to use a real server, we want to use a mock server and be able to return a variety of responses to ensure your application behaves correctly in all circumstances. To this end, Angular provides a mocking service that enables us to inspect the requests and allows your to specify the response returned for each of the calls.

So let's see how we setup our test harness and mock server. First import the `HttpClientTestingModule` and `HttpTestingController`.

```
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
```

Now you need to import the `HttpClientTestingModule` module. When you import the testing module, it imports for you the normal `HttpClientModule` which enables the HttpClient you use in your service, and it also provides `HttpBackend` as an instance of `HttpClientTestingBackend`, which is the mock backend you want. Wow, that was a mouth full! So mainly do the following:


```TypeScript
describe('BlogPostsService', () => {
  let service: BlogPostsService;
  let backend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BlogPostsService],
      imports: [
        HttpClientTestingModule
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(BlogPostsService);
    backend = TestBed.get(HttpTestingController);
  });

}
```

By importing the `HttpClientTestingModule`, your `backend` is now the mock we use in all our examples. This configuration injects the proper mock backend into all classes, components, service, whether your own or third-party ones as long they use the new `@angular/common/http/HttpClient`.

Now when running your test whenever the service calls `http.get`, you have access to all the requests and you can provide individual responses to these requests.

Let's get back to testing some more.

# expectOne returns a TestRequest

The call to `expectOne` returns an instance of `TestRequest` allowing you,  as we'll show in a bit,  to emulate responses from the server. You can additionally check if the service canceled the request.

In the following example, you can see that we can access the request method to ensure that it is the correct one.

```TypeScript
      service.getAll().subscribe();
      const call: TestRequest = backend.expectOne(`https://rails-rest.herokuapp.com/posts`);
      expect(call.request.method).toEqual('GET');
      backend.verify();
```

# match instead of expectOne

If you want to test a series of requests you can use `match` instead of `expectOne`. This approach can be the case of a complex service method that chains multiples call.

In the example below, we issue two calls directly in the test, but you can use this approach to test service methods that would issue multiple call, like for example using `forkJoin`.

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

You'll pass a matcher function to the `match` method, and `match` will collect all matching requests. If you return `true`, you will get all the issued requests so far. Note that `match` doesn't fail the spec if there are no matches, it's just used to collect a call, you can write your expectations once you grabbed it.

# match different requests

If for some reasons you wanted to segregate different calls you can even have multiple matches as shown below.

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

We now have two lists of calls. This example demonstrates that you have lots of flexibility using the `match` method.

# What about URLs with params?

Glad you asked. `expectOne` expects an exact URL that doesn't contain URL parameters. If you expect `/posts` it would not match `/posts?page=1`. If you need that level of granularity, for example, you want to ensure you pagination logic issues the right parameters, then you can use `match` in conjunction with `request.params` or `request.urlWithParams`. Et voilà!

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

The `HttpRequest` class has more useful parameters you can use when you write your tests. Here is a more extensive use

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

Making sure your application issues the proper requests is important, but mostly your unit tests will make sure your app knows how to deal with actual server responses. When unit testing you are testing the various layers of your application, and the goal here is not to "test" the server, we reserve that for integration testing. The goal is to exhaustively test that your component can deal with a representative list of scenarios, for example, a spec that returns an empty response, a response with one record, another with many records, a server or network error. Not only is writing unit tests is faster than in-browser debugging with the usual "save, reload the browser, click here and there" cycle, particularly if you use tools like wallaby.js or do focused testing (by using `fit` or `fdescribe` instead of `it` and `describe`).

An easy way to get the JSON for a server response is to use Postman, Curl, or the Chrome console to copy the real JSON returned by a specific request. Then you can use that JSON as the response content from your test. You can turn JSON into a Typescript file, or use the JSON directly in your spec if the payload is not too large. I mostly have a fixture folder with many files named something like `get_policy.json.ts` that declare a constant that is the payload. You may also want to have integration tests that verify parts of your application against a real server, but this is outside the scope of this article.

One aspect to consider when writing test is to test actual code and not just the framework. For example, in a service spec, if you return a response to an `http.get` request that does not transform the response in any way, then you didn't test anything other than the response you provided in the first place, which would be pointless. If on the other hand, your service does data transformation, then your test has value and allows to ensure that your code works properly. For component testing that involve services, I see many developers mock the service calls.  I find it as efficient to simply `flush` the expected response using our mock backend (`HttpTestingController`) and ensure that the component behaves as expected.

 Now let's look at a few examples.

# Flushing a response

So when calling `expectOne` or `match`, our mock backend returns an instance of `TestRequest` that has the following methods

* flush
* error
* event

These methods allow emulating a variety of results. In the example below,  the call to `getAll()` returns an array of blog posts and we ensure that the expected length was returned and most importantly that our date transformation code works.

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

Similar than the previous scenario, the call to `backend.expectOne` returns an instance of  `TestRequest`  which we use to ensure that the request method is a `POST` then we flush the response back to the service. Inside the subscribe block of the service call we use the `jasmine.objectContaining` utility method that allows checking partial objects, which is interesting when you receive a large payload.

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

When flushing you can also add a specific status, for example, a  Ruby on Rails server often return 422 when there is a validation error letting us know that the user provided some invalid data.

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

In addition to passing a status to the `flush` method, you can also simply call the `error` method.


```TypeScript
      backend.expectOne(`https://rails-rest.herokuapp.com/posts`).error(
        new ErrorEvent(''), {
        status: 422,
        statusText: 'Some server error'
      });
      backend.verify();
```


# Did you know... HttpClient Observable clean up after themselves

The HttpClient completes it's observable once the full body of the request has been returned or when an error occurs. So basically one request get's only one response, and after this, your subscription is dead. This is different than a "reactive approach" where the subscription would stay open. I assume closing the request is more familiar for developers coming from a world full of (promises)[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise]. Then again, closing the observable works pretty well, and you can still wrap and chain your remote calls as we'll explore in the next section.

The following example shows that a request is canceled after you flush its response.

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

When you look at the actual implementation of `HttpXhrBackend` you'll see that the code effectively completes the observable upon receiving a successful response:
https://github.com/angular/angular/blob/master/packages/common/http/src/xhr.ts#L217

The testing framework emulates this behavior, check out the `TestRequest` source code:
https://github.com/angular/angular/blob/master/packages/common/http/testing/src/request.ts#L66


# Reactive Style `switchMap` example

One coding practice I see in many projects, often spearheaded by (NgRx)[https://ngrx.github.io/], is to wrap your call with a chain of Observables. One advantage is, for example,  using the `switchMap` operator which allows you to cancel requests that haven't returned yet. A good example where this is useful is a case when having multiple calls where, when you select a master record some details information is retrieved remotely. Due to the asynchronous nature of the calls, there is no guarantee that the calls return in the same order you service issues them.  If you don't cancel the detail calls in that scenario and a  hyper-caffeinated user selects many master records before even the first details information returns your data will most likely be out of sync and show the wrong detail information. Canceling previous detail calls when new a new master call is issued ensures that the master and detail information stays in sync.

In this last example, the service uses a `rxjs/Subject` to which a component can subscribe. This subscription stays open until you unsubscribe from it, and you can use this subscription to trigger multiple requests. Each request will close, but not this subscription.

To allow canceling previous requests, we define the `setupGetRequestSubject` method that returns a Subject with the switchMap operator applied. As the documentation of `switchMap` mentions,  this operator can cancel in-flight network requests! Think of it as "switching to a new observable.".  Exactly what you want.


```TypeScript
  private getRequestSubject: Subject<String> = new Subject<String>();

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

That Subject is long-lived and triggers itself the `http.get` calls which are short-lived. The advantage is now we can wrap the HTTP calls with `switchMap` and ensuring that if we have multiple calls in sequence, only the last one is taken into account.

In the test below you can confirm that this works. Two calls are issued before a response comes back, and the second call cancels the first one. Check, that worked. Although the call is canceled our subscription is still alive, and we can issue further calls.

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

I agree this example was a bit contrived, but hopefully, it shows how you can use Angular's excellent testing framework to explore how your application issues requests and uses Observables. The `@angular/common/http/testing` library is your indispensable friend in this scenario.

# Further reading:

* The Angular spec describing the `HttpClient` behavior is a good read for understanding all the aspects of the HttpClient class. Might be good material for an article. https://github.com/angular/angular/blob/master/packages/common/http/test/client_spec.ts#L19

* This code shown in this article can be found on Github
 [https://github.com/angularityio/playground/blob/master/apps/example-001-httpclient-testing/src/app/blog-posts.service.spec.ts](https://github.com/angularityio/playground/blob/master/apps/example-001-httpclient-testing/src/app/blog-posts.service.spec.ts#L32)

I hope you enjoyed this article. See you at ng-conf!

Daniel Wanja
President and Coder at Angularity.io


PS:

* Please reach out on twitter @danielwanja or by email daniel@angularity.io
* I'm sure I missed something obvious in this article, so please let me know how I can improve it.
* Last but not least, thanks to [Brian](https://twitter.com/slewfoot303) for review this article.

v0.12
