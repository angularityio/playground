# README

REST API example used for the HttpClient Testing lesson.

Prerequisites: ruby and postgressapp installed

# Install Rails

```
$ rails new rails_rest --database=postgresql --api --skip-test
$ mv rails_rest 01_rails_rest
$ cd 01_rails_rest
$ Add `gem 'rspec-rails'` to the Gemfile   `:development, :test` group.
$ bundle install
$ rails generate rspec:install
```

# Generate base Rails app

$ rails generate scaffold Post title:string content:text

# Create and Populate the database

```
$ rake db:create
$ rake db:migrate
$ rails console
Post.create(title: 'Testing HttpClient', content: 'A long description...')
exit
```
# Start the server

```
$ rails s
```

Open http://localhost:3000/posts.json in a browser.
Returns

```json
[{
  "id": 1,
  "title": "Testing HttpClient",
  "content": "A long description...",
  "created_at": "2017-12-07T04:28:01.764Z",
  "updated_at": "2017-12-07T04:28:01.764Z"
}]
```

# See endpoints

```
$rake routes
```


```
Prefix Verb   URI Pattern          Controller#Action
 posts GET    /posts(.:format)     posts#index
       POST   /posts(.:format)     posts#create
  post GET    /posts/:id(.:format) posts#show
       PATCH  /posts/:id(.:format) posts#update
       PUT    /posts/:id(.:format) posts#update
       DELETE /posts/:id(.:format) posts#destroy
```

# Deploy to heroku

Prerequisites: heroku cli installed and logged in via `heroku login`.

https://devcenter.heroku.com/articles/creating-apps

```
$ heroku create rails-rest
Creating ⬢ rails-rest... done
https://rails-rest.herokuapp.com/ | https://git.heroku.com/rails-rest.git
```

Note instead of rails-rest use your own project name. Heroku will tell you if that name is already
taken.

Deploy to heroku. Note here we are pushing a subfolder from within a bigger repo. Traditionally
you don't need to remove the git info and can just do a `git push heroku master` to deploy to Heroku.

```
git init
git add .
git commit -m "deploy"
heroku git:remote -a rails-rest
git push heroku master --force
rm -fr .git
```

TODO: investigate using git subtree.

```
cd ../..
git subtree push --prefix 01_rails_rest heroku master
```

The first time you'll need to create the data migration on Heroku. The database is automatically crated for you.

```
$ heroku run rake db:migrate --app=rails-rest
```

Add data to the heroku database:

```
$ heroku run rails console --app=rails-rest
Post.create(title: 'Testing HttpClient', content: 'A long description...')
```

