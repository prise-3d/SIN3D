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
| `IMAGES_PATH` | `./images` | The directory where the images are stored (absolute path if changed ⚠️) |  ✅  | ⬜️ |

Configure more deeply the way the app works by modifying *[config.js](config.js)*.

| Option      | Default value | Description |
| ----------- | ------------- | ----------- |
| `apiPrefix` | `/api` | The url prefix for the API |
| `imageServedUrl` | `/api/images` | The url prefix from where the images are served |
| `serverPort` | `5000` | The port used by the server |
| `imagesPath` | `./images` | The directory where the images are stored |
| `serveClient` | `true` | Should the server serve client files from the `/dist` directory |
| `fileNameConvention` | `/^(.*)?_([0-9]{2,})\.(.*)$/` | File name convention for images |
| `sceneFileNameBlackList` | `['config', 'seuilExpe', 'extracts']` | Files to ignore in scenes |
| `extractsDirName` | `extracts` | Name of the directory containing extracts |

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

#### Using Windows
When using Windows, it may happen that you can't properly run the containers because of Windows's path system being different. To circumvant this problem, you can do the [following steps](https://github.com/docker/compose/issues/4303#issuecomment-379563170).
> 1. On **Command Line**: "set COMPOSE_CONVERT_WINDOWS_PATHS=1";
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

## License
[The MIT license](LICENSE)
