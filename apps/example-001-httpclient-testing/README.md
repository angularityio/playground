# create project

$ npm start --app=example-001-httpclient-testing
$ yarn add @angular/material @angular/cdk
$ yarn add @angular/animations
$ npm start --app=example-001-httpclient-testing

# TODO

[x] implement CRUD service against
    https://rails-rest.herokuapp.com/posts/1.json
[ ] create app with list and details, New and Save button.
    clear button?
        [ ] create list component
        [ ] create record component
[ ] write CRUD spec
[ ] 100% test coverage
    [ ] setup wallaby
        see https://github.com/wallabyjs/public/issues/1347 for making it work with Nx.
[ ] Find CI server and add build badge to README.
[ ] Make first video walking through tests
    * Fixture (list, update, create, delete)
    * HttpClientTestModule <- all the magic
    * Simple index, create, update, delete.
    * Update method (PUT)
    * Component test - doesn't need to retest, assume data is there.
[ ] Use default theme or https://www.materialpalette.com/ ?
[ ] Video 2 show how to test headers and interceptors?
    * Headers
    * Interceptor (Auth?)



