# README

REST API example used for the HttpClient Testing lesson.

Prerequisites: ruby installed

# Install Rails

$ rails new rails_rest --database=sqlite3 --api --skip-test
$ mv rails_rest 01_rails_rest
$ cd 01_rails_rest
$ Add `gem 'rspec’` to the Gemfile   `:development, :test` group.
$ bundle install
$ rails generate rspec:install

# Generate base Rails app

$ rails generate scaffold Post name:string title:string content:text

# See endpoints

$rake routes

# Deploy to heroku

Prerequisites: heroku cli installed.

https://devcenter.heroku.com/articles/creating-apps

```
$ heroku create rails-rest
Creating ⬢ rails-rest... done
https://rails-rest.herokuapp.com/ | https://git.heroku.com/rails-rest.git
```