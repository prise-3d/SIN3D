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
    ([ -d ./experimentConfig ] && \
      echo "Experiment configuration found" \
      || echo "Experiment configuration not found, copying default" && cp -r experimentConfig.default experimentConfig) && \
    NODE_ENV=test yarn test && \
    yarn run app:build && \
    yarn run server:start ; \
  else NODE_ENV=test yarn test && yarn run server:start ; fi
