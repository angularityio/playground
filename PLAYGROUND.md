# Welcome to Angularity.io's Playground.

This repo contains various Angular demos and examples showcased on Angularity.io's blog.

I'm also taking the opportunity to learn more about using a mono repo to host all this various code. One benefit will be to keep all these examples up to date with latest version of Angular. I'm using Nwrl Nx to manage the mono repo.

Nwrl/Nx

## Created the repo

```
curl -fsSL https://raw.githubusercontent.com/nrwl/nx/master/packages/install/install.sh | bash -s myproject
```

## Created first app

```
ng g app hello-world
```


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

