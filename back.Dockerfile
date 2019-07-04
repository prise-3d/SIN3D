FROM node:11.7.0-alpine

# Back docker image
COPY . /usr/src/app

WORKDIR /usr/src/app

# Server port
EXPOSE 5000

# Install dependencies and generate documentation
RUN yarn install && yarn doc

# Build front if SERVE_CLIENT=true
CMD if [ "$SERVE_CLIENT" == "true" ] ; \
  then \
    ([ -f ./experimentConfig.js ] && \
      echo "Experiment configuration found" \
      || (echo "Experiment configuration not found, copying default" && cp experimentConfig.default.js experimentConfig.js)) && \
    NODE_ENV=test yarn test && \
    yarn run app:build && \
    yarn run server:start ; \
  else NODE_ENV=test yarn test && yarn run server:start ; fi
