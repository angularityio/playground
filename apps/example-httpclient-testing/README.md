# create project

Create app

```
$ ng g app example-httpclient-testing --style=scss
```

Create library for app. Note prefixing with `app` to identify app specific libs.

```
$ ng g lib example-httpclient-testing  --ngModule --directory=app
```

Adding main component to app library

```
ng g component main --project app-example-httpclient-testing
```

Adding service

```
ng g service blog-posts --project app-example-httpclient-testing
```

Serve the app

```
$ ng serve example-httpclient-testing
```

Run all the tests

```
$ ng test example-httpclient-testing
$ ng test app-example-httpclient-testing
```
