# Welcome to Angularity.io's Playground.

This repo contains various Angular demos and examples showcased on Angularity.io's blog.

I'm also taking the opportunity to learn more about using a mono repo to host all this various code. One benefit will be to keep all these examples up to date with latest version of Angular. I'm using Nwrl Nx to manage the mono repo.

Nwrl/Nx

## Created the workspace

```
$ create-nx-workspace playground --yarn

```

## Create shared services

```
ng g lib services --ngModule
```

Note here we just declare services without having a module at this stage.

Create EnvironmentService to allow apps to define environment and libs to use them.

```
ng g service Environment --project services
```

## Created first app

```
ng g app hello-world
```

EnvironmentService

## Deploy using aerobatic

Created the areobatic project

```
aero create --name deploy
```

Deployed the project:

```
ng build  --base-href . --app hello-world
ng build  --base-href . --app hello-world2
cp index.html dist
aero deploy --directory dist
```

The same can also be achieve as follows:

```
npm run build:ci
npm run deploy
```

To test all projects

```
npm run test:all
```

## And now deploying  with Docker

First build it

```
npm run build:ci
```

See the Docfile to see how the image is build

Docfile
```
FROM nginx:stable-alpine
COPY dist /usr/share/nginx/html
```

Build the Docker image

```
docker build --rm -f Dockerfile -t playground:latest .
```

Run the image locally

```
docker run -it --name onerous_exchange -p 3000:80 playground:latest
```

Deploy on Heroku

see https://devcenter.heroku.com/articles/container-registry-and-runtime

```
heroku create angularityio
```

Push

```
heroku container:push web
```

Note the push refers to a repository. The output is

=== Pushing web (/Users/wanjad/GitProjects/mystuff/playground/Dockerfile)
The push refers to a repository [registry.heroku.com/angularityio/web]
f8dbfc208051: Pushed
de368a120282: Pushed
50e3e81cee36: Pushed
038dfa4966f8: Pushed
6bc5936494e3: Pushed
latest: digest: sha256:ad21744ffec2376decba3dabcb6a2f4afe4a90e4aa309b16eb5efe801a9ee27e size: 1364

```
docker push registry.heroku.com/angularityio/web
```