# Antoine_Internship

Travaux développés par Antoine dans le cadre de son stage de DUT2.

## Run as a Docker instance
### Run the server + client version
```sh
# TODO
# docker-compose -f docker-compose.yml up backapp
```

### Run the client only version
```sh
# TODO
#docker-compose -f docker-compose.yml up backapp
```


## Run on the file system
### Project setup
Install project's dependencies.
```
yarn install
```

### API
#### Run the server
```sh
yarn run api:start
```

#### Run the server with hot-reload for development
```sh
yarn run api:dev
```

#### Automatically fix the API code syntax with ESLint
```sh
yarn run api:lint
```


### Client
#### Compile and minify for production
Files will be built to the `dist/` directory.
```sh
yarn run app:build
```

#### Run a hot-reload server for client development
```sh
yarn run app:dev
```


#### Automatically fix the client code syntax with ESLint
```
yarn run app:lint
```

## License
[The MIT license](LICENSE)
