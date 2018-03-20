# Http Testing in depth

The new `HttpTestingController` that comes with the `@angular/common/http/testing` package is small and mighty, simple and powerfull at the stage time. It provides the following 4 methods

* expectOne
* expectNone
* match
* verify

Note these method are quite flex and allow a variety of usages we will explore below and which you want to make sure to know.

## What are we testing.

Wether you use a service from a component or you are building out you remote service layer you basically want to make sure 1) the right call is made 2) you serive or component has the correct behavior based on a variety of responses, mostly success and failures. With the `HttpTestingController` is quite easy...let's check it out.

## The simplest case



## Let's go - Configuration



```
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
```