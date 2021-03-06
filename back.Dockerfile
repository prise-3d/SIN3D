FROM node:12.6.0-alpine

# Back docker image
COPY . /usr/src/app

WORKDIR /usr/src/app

# Server port
EXPOSE 5000

# Install python
RUN apk add --update --no-cache gcc gfortran python python-dev py-pip build-base wget freetype-dev libpng-dev openblas-dev
RUN pip install pymongo
RUN pip install numpy

# Install dependencies and generate documentation
RUN yarn install && yarn doc

# Build front if SERVE_CLIENT=true
CMD if [ "$SERVE_CLIENT" == "true" ] ; \
  then \
    ([ -f ./experimentConfig.js ] && \
      echo "Experiment configuration found" \
      || (echo "Experiment configuration not found, copying default" && cp experimentConfig.default.js experimentConfig.js)) && \
    ([ -d ./results ] || mkdir results) && \
    ([ -f ./results/match_extracts_probs.json ] || echo "[]" >> results/match_extracts_probs.json) && \
    NODE_ENV=test yarn test && \
    yarn run app:build && \
    yarn run server:start ; \
  else NODE_ENV=test yarn test && yarn run server:start ; fi
