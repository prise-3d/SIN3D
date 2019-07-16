# SIN3D
> Synthesis Image Noise Detection on Distributed Data (SIN3D)

A web app to collect data on noise detection by humans on images.

## Download project
```sh
git clone https://gogs.univ-littoral.fr/Prise3D/SIN3D.git
cd SIN3D
```

## Application
See [https://diran.univ-littoral.fr](https://diran.univ-littoral.fr)

## Developer documentation
See [`/DOCUMENTATION`](./DOCUMENTATION)

## API documentation
See [https://diran.univ-littoral.fr/doc](https://diran.univ-littoral.fr/doc)

## Data extraction
You can use the [SIN3D-data-extract](https://gogs.univ-littoral.fr/Prise3D/SIN3D-data-extract) library to easily extract data from this application database.

## Run as a Docker instance
### Configure application
Use the following environment variables to configure the application.

| Option      | Default value | Description | Server | Client |
| ----------- | ------------- | ----------- | :------: | :------: |
| `PORT` | `5000` | The port used by the started application |  ✅  | ✅ |
| `SERVE_CLIENT` | `true` | Should the server serve client (Fully local application) |  ✅  | ⬜️ |
| `IMAGES_PATH` | `./images` | The directory where the images are stored (absolute path if changed ⚠️) |  ✅  | ⬜️ |
| `MONGO_URI` | `mongodb://localhost/sin3d` | MongoDB database connection URI |  ✅  | ⬜️ |

Configure more deeply the way the app works by modifying *[config.js](config.js)*.

| Option      | Default value | Description |
| ----------- | ------------- | ----------- |
| `apiPrefix` | `/api` | The url prefix for the API |
| `imageServedUrl` | `/api/images` | The url prefix from where the images are served |
| `serverPort` | `5000` | The port used by the server |
| `mongoDatabaseURI` | `mongodb://localhost/sin3d` | MongoDB database connection URI |
| `imagesPath` | `./images` | The directory where the images are stored |
| `serveClient` | `true` | Should the server serve client files from the `/dist` directory |
| `fileNameConvention` | `/^(.*)?_([0-9]{2,})\.(.*)$/` | File name convention for images |
| `extractsDirName` | `extracts` | Name of the directory containing extracts |
| `sceneFileNameBlackList` | `['config', 'seuilExpe', 'extracts']` | Files to ignore in scenes |
| `deleteExtractsCronTime` | `0 3 * * *` (every day at 03:00 AM) | Cron time for extracts deletion |
| `logger` | Logs : `logs/server.combined.log` Errors : `logs/server.error.log` | Default application logger |
| `dbLogger` | Logs : `logs/db.log` Errors : `logs/db.error.log` | Database logger configuration |

### Run server + client
Linux
```sh
PORT=8080 SERVE_CLIENT=true IMAGE_PATH=/var/images docker-compose up
```
Windows
```bat
SET PORT=8080
SET SERVE_CLIENT=true
SET IMAGE_PATH=C:\my\images
docker-compose up
```

### Run server only
Linux
```sh
SERVE_CLIENT=false docker-compose up
```
Windows
```bat
SET SERVE_CLIENT=false
docker-compose up
```

### Run client only
```sh
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

#### Docker instance on a Windows host
As of now, Windows hosts are not supported due to MongoDB volumes not being mappable to this system.

## Run on the file system
### Project setup
Install project's dependencies.
```
yarn install
```

If this is a production build, set the `NODE_ENV` environment variable to `production` to enhance performance.

Linux
```sh
export NODE_ENV=production
```
Windows
```bat
SET NODE_ENV=production
```

### API
#### Run the server
```sh
yarn run server:start
```
If you specifically want to not start the extracts remover service (extracts are automatically deleted everyday), use the following.
```sh
server:start:no-delete-extracts
```

#### Automatically fix the API code syntax with ESLint
```sh
yarn run server:lint
```


### Client
To use the client, you need to initialize experiment configurations first.
```sh
cp -r experimentConfig.default experimentConfig
```
You can modify the configuration for each mixins, experiments or scene by modifying files in the newly created *`./experimentConfig`* directory.


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
```sh
yarn run app:lint
```

## Automated deployment
The app can be automatically deployed when a push event is sent to the master branch using Gogs. Open a port to the web and start *[webhook_deploy_gogs.js](webhook_deploy_gogs.js)*.
```sh
WEBHOOK_SECRET=your_webhook_secret WEBHOOK_PORT=5000 SERVE_CLIENT=true PORT=8080 node webhook_deploy_gogs.js
```
You can pass any parameters to the script, they will be passed to the Docker instance. The following are required.

| Option      | Description |
| ----------- | ----------- |
| `WEBHOOK_SECRET` | The secret set on Gogs to verify the identity |
| `WEBHOOK_PORT` | The port the script is listening to |

## Running tests
The `docker-compose` script will automatically run tests. Use the following command to run them by hand.
```sh
yarn test
```

## Generate API documentation
The `docker-compose` script will automatically build the API documentation. Use the following command to build it by hand.
```sh
yarn doc
```
The documentation is generated to the `doc/` directory. If you started the server, the documentation is served at `/doc/`.

## Collected DATA

During application use a lot of data is collected by platform, here a description of main message identifier used:

- COLLECT_DATA: specify that the collected data process began.
- EXPERIMENT_STARTED: message which is used for start of an experiment.
- EXPERIMENT_DATA: message for data of an experiment.
- EXPERIMENT_VALIDATED: end of experiences message.

## License

[The MIT license](LICENSE)
