# Antoine_Internship
A web app to collect data on noise detection by humans on images.

## Download project
```sh
git clone https://gogs.univ-littoral.fr/Prise3D/Antoine_Internship.git
cd Antoine_Internship
```

## Run as a Docker instance
### Configure
Use the following environment variables to configure the application.
| Option      | Default value | Description | Server | Client |
| ----------- | ------------- | ----------- | :------: | :------: |
| `PORT` | `5000` | The port used by the started application |  ✅  | ✅ |
| `SERVE_CLIENT` | `true` | Should the server serve client (Fully local application) |  ✅  | ⬜️ |

### Run server + client
Linux
```sh
PORT=8080 SERVE_CLIENT=true docker-compose up
```
Windows
```bat
SET PORT=8080
SET SERVE_CLIENT=true
docker-compose up
```

### Run server only
Linux
```sh
PORT=8080 SERVE_CLIENT=false docker-compose up
```
Windows
```bat
SET PORT=8080
SET SERVE_CLIENT=false
docker-compose up
```

### Run client only
Linux
```sh
PORT=8080 docker-compose -f docker-compose.frontapp_only.yml up
```
Windows
```bat
SET PORT=8080
docker-compose -f docker-compose.frontapp_only.yml up
```

### Notice
#### New version Docker build
When using a new version of the project, you need to re-build the application with Docker.
```sh
# Server / Server + client versions
docker-compose build

# Client only version
docker-compose -f docker-compose.frontapp_only.yml build
```

### Using Windows
When using Windows, it may happen that you can't properly run the containers because of Windows's path system being different. To circumvant this problem, you can do the [following steps](https://github.com/docker/compose/issues/4303#issuecomment-379563170).
> 1. On **Command Line**: "_set COMPOSE_CONVERT_WINDOWS_PATHS=1_";
> 2. Restart **Docker for Windows**;
> 3. Go to **Docker for Windows** settings **>** Shared Drives **>** Reset credentials **>** select drive **>** Apply;
> 4. Reopen **Command Line**;
> 5. Kill the _Containers_;
> 6. Rerun the _Containers_.

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
SET SERVE_CLIENT=false
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
yarn run server:start
```

#### Run the server with hot-reload for development
```sh
yarn run server:dev
```

#### Automatically fix the API code syntax with ESLint
```sh
yarn run server:lint
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
