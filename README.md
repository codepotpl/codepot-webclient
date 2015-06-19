# codepot-webclient
Codepot registration web client app.

# Development
`node_modules/.bin/ember server`

# Build On Staging/Production
1. `docker build --tag codepot-webclient .`
2. `docker rm -f codepot-webclient`
3. ``docker run -v `pwd`/dist:/app/dist --name codepot-webclient -e API_HOST=http://0.0.0.0:1337 -e BASE_URL=https://registration.codepot.pl:8080/ codepot-webclient``

The compiled version of the app will be placed in ```pwd`/dist``. Serve it with eg. nginx. 
