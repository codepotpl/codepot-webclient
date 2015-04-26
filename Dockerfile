FROM node:0.12.2-slim
MAINTAINER Tomasz Netczuk contact@netczuk.pl

RUN ["apt-get", "update"]
RUN ["apt-get", "install", "git", "-y"]

WORKDIR /app
ADD package.json /app/package.json
RUN ["npm", "install"]

ADD bower.json /app/bower.json
RUN ["node_modules/.bin/bower", "install", "--allow-root"]

ADD . /app

#CMD ["node_modules/ember-cli/bin/ember", "build", "--environment"] production
CMD ["node_modules/.bin/ember", "build"]
