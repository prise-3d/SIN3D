FROM node:11.7.0-alpine

# Back docker image
COPY . /usr/src/app

WORKDIR /usr/src/app

EXPOSE $PORT

RUN yarn install

# Build front if SERVE_CLIENT=true
CMD if [ "$SERVE_CLIENT" == "true" ] ; then yarn run app:build && yarn run server:start ; else yarn run server:start ; fi
