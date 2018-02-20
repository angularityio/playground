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

# Generate base Rails app (Post with Comments)

$ rails generate scaffold Post title:string content:text
$ rails generate scaffold comment content:text post:belongs_to

# Make comments a nested resource
In post.rb add the comments `has_many` association as follows

```
class Post < ApplicationRecord
  has_many: :comments
end
```


In routes.rb add the :comments resource as follows

```
  resources :posts do
    resources :comments, only: [:index, :create]
  end
```

In comments_controller.rb remove the `before_action` at the top of the file:

```
  before_action :set_comment, only: [:show, :update, :destroy]
```

And delete the `set_comment` method.

Then add the `set_post` before action:

```
before_action :set_post, only: [:index, :create]
```

And in the private section of the comments controller add the `set_post` method

```
    def set_post
      @post = Post.find(params[:post_id])
    end
```

Finally change the 'index' method from

```
  def index
    @comments = Comment.all
    render json: @comments
  end
```

to

```
  def index
    @comments = @post.comments.all
    render json: @comments
  end
```

And in the `create` method change

```
@comment = Comment.new(comment_params)
```

to

```
@comment = @post.comments.new(comment_params)
```

For the comment controller we just want to have the public `index` and `create`
method to allow listing the comments and creating new ones. You can now remove
the `show`, `update` and `destroy` methods.


Et voila, wow you comments are nested under a post and your routes are the following.

Well, the comments controller spec also needed a few updates, check it out.

`$ rake routes`

```
       Prefix Verb   URI Pattern                        Controller#Action
post_comments GET    /posts/:post_id/comments(.:format) comments#index
              POST   /posts/:post_id/comments(.:format) comments#create
        posts GET    /posts(.:format)                   posts#index
              POST   /posts(.:format)                   posts#create
         post GET    /posts/:id(.:format)               posts#show
              PATCH  /posts/:id(.:format)               posts#update
              PUT    /posts/:id(.:format)               posts#update
              DELETE /posts/:id(.:format)               posts#destroy
```

# Create and Populate the database

```
$ rake db:create
$ rake db:migrate
$ rails console
Post.create(title: 'Testing HttpClient', content: 'A long description...')
Post.find(1).comments.create(content: 'A insightful comment...')
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

And `http://localhost:3000/posts/1/comments.json` returns the comments

```json
[{
  "id": 1,
  "content": "A insightful comment...",
  "post_id": 1,
  "created_at": "2018-02-20T03:16:00.142Z",
  "updated_at": "2018-02-20T03:16:00.142Z"
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

