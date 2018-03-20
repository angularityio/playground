# Http Testing in depth

The new `HttpTestingController` that comes with the `@angular/common/http/testing` package is small and mighty, simple and powerfull at the stage time. It provides the following 4 methods

* expectOne
* expectNone
* match
* verify

Note these method are quite flexible and allow a variety of usages we will explore below and which you want to make sure to know.

You can find all the examples on [Github](https://github.com/angularityio/playground/blob/master/apps/example-001-httpclient-testing/src/app/posts-service.service.spec.ts#L32).


## What are we testing.

Wether you use a service from a component or you are building out you remote service layer you basically want to make sure 1) the right call is made 2) you service or component behaves correctly based on a variety of responses, mostly success and failures. With the `HttpTestingController` is quite easy...let's check it out.


## Let's go - The simplest case

```TypeScript
    service.getAll().subscribe();
    backend.expectOne(`https://rails-rest.herokuapp.com/posts`);
    backend.verify();
```
- Match url
`subscribe` is needed or nothing fires.

## Expect one request

```TypeScript
      service.getAll().subscribe();
      backend.expectOne((request) => {
        return request.url.match(/posts/) &&
              request.method === 'GET';
      });
      backend.verify();
```

## Configuration



```
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
```