# Application file tree

This wiki page details how the application file tree is structured.

## Summary

 - [Project's general file structure](#projects-general-file-structure)
 - [`/docs` directory](#docs-directory)
 - [`/dist` directory](#dist-directory)
 - [`/images` directory](#images-directory)
 - [`/logs` directory](#logs-directory)
 - [`/server` directory](#server-directory)
 - [`/src` directory](#src-directory)
 - [`/test` directory](#test-directory)

---

## Project's general file structure

The following file tree represents the full application.

```console
.                                    || 
├── babel.config.js                  || 
├── back.Dockerfile                  || Back-end Docker configuration
├── cleanExtracts.js                 || Extracts remover service
├── config.js                        || Application configuration
├── config.messagesId.js             || Database message identifiers
├── data                             || Database (Docker)
│   └── ...                          || 
├── docs                             || Generated API documentation
│   └── ...                          || 
├── docker-compose.frontapp_only.yml || General Docker configuration for a front-only instance
├── docker-compose.yml               || General Docker configuration
├── DOCUMENTATION                    || This documentation
│   └── ...                          || 
├── dist                             || Generated Front-end files (build)
│   └── ...                          || 
├── experimentConfig.default.js      || Default experiments configuration
├── experimentConfig.js              || Experiments configuration
├── front.Dockerfile                 || Front-end Docker configuration
├── images                           || Experiments images (Can be configured)
│   └── ...                          || 
├── index.js                         || Server + Extracts remover service starter
├── jsconfig.json                    || 
├── LICENSE                          || Application license
├── logs                             || Application logs
│   └── ...                          || 
├── package.json                     || Project's scripts, dependencies and configuration
├── public                           || Static front-end files
│   ├── favicon.ico                  || Website favicon
│   └── index.html                   || 
├── README.md                        || 
├── server                           || Server and database code
│   └── ...                          || 
├── src                              || Front-end code
│   └── ...                          || 
├── test                             || API automated tests
│   └── ...                          || 
├── webhook_deploy_gogs.js           || Continuous integration script
└── yarn.lock                        || Project's dependencies versions lock file
```

## `/docs` directory

The `/docs` directory contains the generated API documentation. This documentation is accessible through `/doc` on the website and describes every routes of the API.

To generate the documentation, use the following npm script:

```sh
yarn doc
```

## `/dist` directory

The `/dist` directory contains the build output of the Front-end of the application. It is bundled with WebPack to contain only HTML/CSS/JavaScript files.

To generate the Front-end files, use the following npm script:

```sh
yarn app:build
```

## `/images` directory

The `/images` directory contains all the images available for the experiments.

This path is the default one, but you can configure it by setting an absolute path with the `IMAGES_PATH` environment variable when running the application.

```console
└── images                                               ||
    ├── Appart1opt02                                     || A scene directory
    │   ├── appartAopt_00890.png                         || Scene images
    │   ├── ...                                          || 
    │   └── extracts                                     || Images extracts cut by the server
    │       ├── x4_y4                                    || A cutting configuration (4 and 4 cuts on x and y axis)
    │       │   ├── zone00001                            || Image extract zone 1 (top left of image)
    │       │   │   ├── Appart1opt02_zone00001_00020.png || The actual extract (x4_y4 config, zone 1, quality 20)
    │       │   │   └── ...                              || 
    │       │   └── ...                                  || 
    │       └── ...                                      || 
    └── ...                                              || 
```

## `/logs` directory

The `/logs` directory contains all the logs of the application.

```console
└── logs                                 || 
    ├── db.error.log                     || Database errors
    ├── db.log                           || Database logs
    ├── extractsRemoverService.error.log || Extracts remover service errors
    ├── extractsRemoverService.log       || Extracts remover service logs
    ├── server.combined.log              || Server combined logs
    └── server.error.log                 || Server errors
```

## `/server` directory

The [`/server`](../server) directory contains the Back-end: server and database code.

```console
└── server                    || 
    ├── database              || Database link
    │   ├── controllers       || Database controllers (Functions)
    │   │   └── Data.js       || 
    │   ├── index.js          || Database link module: connects to database and links models
    │   └── models            || Database models (Schemas, types)
    │       └── Data.js       || 
    ├── functions.js          || Common utils for the server
    ├── index.js              || Server module: links server and database
    ├── routes                || All API routes
    │   ├── index.js          || Router module to inject all routes
    │   ├── getImage.js       || 
    │   └── ...               || 
    └── winston.config.js     || All the server's logging configuration
```

## `/src` directory

The [`/src`](../src) directory contains the Front-end code.

```console
└── src                                              || 
    ├── App.vue                                      || Main template, defines how the page looks
    ├── components                                   || Common components
    │   ├── ExperimentsComponents                    || Experiment-specific components
    │   │   ├── ExtractConfiguration.vue             || Extracts configurator
    │   │   └── ExtractsToImage.vue                  || Shows multiple extracts as a unique image
    │   ├── Loader.vue                               || Loading component
    │   ├── ResetAppButton.vue                       || Global application reset button
    │   └── ToastMessage.vue                         || Show a temporary toast message
    ├── config.utils.js                              || Some utils related to experiments configuration files
    ├── functions.js                                 || Common utils
    ├── main.js                                      || Vue modules and plugins register
    ├── mixins                                       || Experiments bases: contains utils for a type of experiment
    │   ├── ExperimentBaseAreSameImages.vue          || Images versus based experiment base
    │   ├── ExperimentBaseExtracts.vue               || Extracts-based experiment base
    │   └── ExperimentBase.vue                       || Global experiment base, used in every experiments
    ├── plugins                                      || Vue.js plugins
    │   └── vuetify.js                               || Vuetify design framework
    ├── router                                       || Vue-router (routing logic)
    │   ├── experiments.js                           || Experiment-specific routing logic
    │   └── index.js                                 || Main routing logic
    ├── store                                        || VueX store (global state management)
    │   ├── actions.js                               || Store actions (can be async)
    │   ├── getters.js                               || Compute store state values
    │   ├── index.js                                 || Store module
    │   ├── mutations.js                             || Store mutations (must be synchronous and atomic)
    │   └── state.js                                 || Store initial state
    ├── style.css                                    || Global application style
    └── views                                        || Application views (pages)
        ├── Experiments                              || Experiments
        │   ├── AreSameImagesRandom.vue              || Two random quality images (versus)
        │   ├── AreSameImagesReferenceOneExtract.vue || Two reference images, one has a random quality extract (versus)
        │   ├── AreSameImagesReference.vue           || One random quality image, one reference image (versus)
        │   └── MatchExtractsWithReference.vue       || Lowest quality extracts, match them to reference image
        ├── ExperimentsList.vue                      || A list of all available experiments
        ├── ExperimentValidated.vue                  || The experiment ending screen
        ├── GdprNotice.vue                           || The GDPR notice
        ├── HostConfig.vue                           || The application host configuration
        └── SelectExperimentScene.vue                || Experiment scene selector
```

## `/test` directory

The [`/test`](../test) directory contains the automated tests of the application.

```console
└── test                         ||
    ├── api                      || API tests
    │   ├── getImage.js          || A test file
    │   ├── ...                  || 
    │   ├── _test_functions.js   || Common utils for the tests
    │   ├── _test_setup_start.js || Script called before running all the tests
    │   └── _test_setup_stop.js  || Script called after running all the tests
    └── images_test              || Some experiment images copied for tests
        └── ...                  || 
```

To run these automated tests, use the following npm script:
```sh
yarn app:build
```
