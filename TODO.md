TODO

See https://trello.com/c/GYWNdeaL/1-httpclient-testing

[ ] HttpClient testing
  [x] implement CRUD service against
      https://rails-rest.herokuapp.com/posts/1.json
  [x] write CRUD spec
  [x] create app with list and details, New and Save button.
      clear button?
          [x] create list component
          [x] create record component
  [ ] Server add comments (/posts/1/comments)
    [ ] Nested resource
    [ ] Create Gist to show how to create the server
    [ ] Explain about CORS
  [ ] Show examples of mergeMap (get post/1 and post/1/comments)
  [ ] Other examples.  [ ] 100% test coverage
      [x] setup wallaby
          see https://github.com/wallabyjs/public/issues/1347 for making it work with Nx.
      [ ] wallaby more dynamic (did hard code project in wallabyjs)
      [ ] test runner styling https://www.npmjs.com/package/karma-htmlfile-reporter
  [ ] Find CI server and add build badge to README.
      [ ] buddy.works
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
  [ ] Make a shareable header for all examples




[ ] Flesh out various section
  * Basic - forms, binding, life cycle, HttpClient, Interceptors. Typescript, Immutable, RxJs
  * Advanced - Dynamic components, factories.
  * API - GraphQL, Rest, JsonAPI.
  * Server Less - AWS App Sync, Scaphold.io, ..
  * Blog - Related to specific blog entries.
  * Apps - Tiny useful apps that can be deployed standalone too.
  * Third Party - Demos third party components and libraries.
  * Angularity Components - Dynamic Forms, Pivot Component.
  * Examples - Various demos that didn't got promoted to a published blog.

[ ] Visual
  [ ] Identify theme for the apps
  [ ] Material / bootstrap or other?
  [ ] Build home page / navigation menu shared component
  [ ] Check commercial themes? i.e. https://themeforest.net/item/fury-angular-2-material-design-admin-template/19325966
  https://themeforest.net/item/material-design-angular-2-admin-web-app-with-bootstrap-4/19421267
  https://themeforest.net/item/atomic-angular-4-material-design-admin-framework/20833566?s_rank=1
  or https://themeforest.net/search/material%20design?utf8=%E2%9C%93
  [ ] For angularity's home page? http://preview.themeforest.net/item/zephyr-material-design-theme/full_screen_preview/9865647?_ga=2.212912852.1103909378.1512176701-539230990.1512176701

[ ] Add first section.
  [started] HttpClient testing
  [ ] High level form components. Check if I can start with pn-forms
  [ ] Dynamic table / record generation
  [ ] Decide on component prefix (ay?, just a, a-forms, ay-forms??)
  [ ] Form demo (field tracker?)
  [ ] ngrx test? Haven't used ngrx yet, so maybe a first look.


[ ] Define build/ci/cd pipeline
  [x] Aerobatic. Seems to work well.
  [ ] buddy.works
    [x] fix karma issue
    [ ] setup test pipeline with auto deploy via aerobatic.
    [ ] consider deploying via docker.

[ ] Artifacts for each project
  [ ] a running app (deployed via areobatic via appkey or use netlify)
  [ ] the specs output
  [ ] the test coverage output
  [ ] the static source code (it's public on github)
  [ ] running/editable code? stackblitz, codepen, jsfiddle, jsbin, plunkr

[ ] Blog
  [ ] embed video
  [ ] embed src code
  [ ] medium?
  [ ] markdown...README of each subproject could be the content.

[ ] Components
  [ ] Pivot component (ay-pivot)
  [ ] ay-forms

[ ] Server less
  [ ] Checkout AWS App Sync
  [ ] https://docs.microsoft.com/en-us/azure/cosmos-db/introduction