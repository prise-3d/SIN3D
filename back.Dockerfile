FROM node:11.7.0-alpine

# Back docker image
COPY . /usr/src/app

WORKDIR /usr/src/app

EXPOSE 5000

RUN yarn install

# Build front if SERVE_CLIENT=true
CMD if [ "$SERVE_CLIENT" == "true" ] ; then NODE_ENV=test yarn test && yarn run app:build && yarn run server:start ; else NODE_ENV=test yarn test && yarn run server:start ; fi
