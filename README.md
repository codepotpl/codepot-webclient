# codepot-webclient
Codepot registration web client app.

# Development
`node_modules/.bin/ember server`

# Build On Staging/Production
1. `docker build --tag codepot-webclient .`
2. ``docker run -v `pwd`/dist:/app/dist codepot-webclient``

The compiled version of the app will be placed in ```pwd`/dist``. Serve it with eg. nginx. 
