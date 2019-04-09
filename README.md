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

If this is a production build, set the `NODE_ENV` environment variable to `production` to enhance performance.

On Linux hosts :
```sh
export NODE_ENV=production
```
On Windows hosts :
```bat
SET NODE_ENV=production
```

### Configuration 
Configure the project by modifying *[config.js](config.js)*.

#### Configuration options
| Option      | Default value | Description |
| ----------- | ------------- | ----------- |
| apiPrefix | `/api` | The url prefix for the API |
| serverPort | `5000` | The port used by the server |
| imagesPath | `images` | The directory where the images are stored |
| serveClient | `true` | Should the server serve client files from the `/dist` directory |


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
