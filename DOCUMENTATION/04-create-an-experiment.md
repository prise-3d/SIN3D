# Create an experiment

This wiki page details how to fully create an experiment.

## Summary

 - [Prerequisites](#prerequisites)
 - [Experiment file tree](#experiment-file-tree)
 - [Experiment creation](#experiment-creation)
   - [Experiment initialization](#experiment-initialization)
   - [Experiment configuration](#experiment-configuration)
 - [Experiment mixins API](#experiment-mixins-api)
   - [ExperimentBase](#experimentbase)
   - [ExperimentBaseAreSameImages](#experimentbasearesameimages)
   - [ExperimentBaseExtracts](#experimentbaseextracts)

---

## Prerequisites
To learn how to create an experiment, you first need to know how [Vue.js](https://vuejs.org/v2/guide/) works.

If you want to use the same style as the application, here is the [Vuetify documentation](https://vuetifyjs.com/en/getting-started/quick-start).

## Experiment file tree
This is a more experiment-focused file tree.

The complete `/src` directory file tree can be found here: [Application file tree - `/src` directory](./01-application-file-tree.md#src-directory).

```console
└── src                                              || 
    ├── components                                   || Common components
    │   └── ExperimentsComponents                    || Experiment-specific components
    │       ├── ExtractConfiguration.vue             || Extracts configurator
    │       └── ExtractsToImage.vue                  || Shows multiple extracts as a unique image
    ├── functions.js                                 || Common utils
    ├── mixins                                       || Experiments bases: contains utils for a type of experiment
    │   ├── ExperimentBaseAreSameImages.vue          || Images versus based experiment base
    │   ├── ExperimentBaseExtracts.vue               || Extracts-based experiment base
    │   └── ExperimentBase.vue                       || Global experiment base, used in every experiments
    ├── router                                       || Vue-router (routing logic)
    │   ├── experiments.js                           || Experiment-specific routing logic
    │   └── index.js                                 || Main routing logic
    └── views                                        || Application views (pages)
        └── Experiments                              || Experiments
            ├── AreSameImagesRandom.vue              || Two random quality images (versus)
            ├── AreSameImagesReferenceOneExtract.vue || Two reference images, one has a random quality extract (versus)
            ├── AreSameImagesReference.vue           || One random quality image, one reference image (versus)
            └── MatchExtractsWithReference.vue       || Lowest quality extracts, match them to reference image
```

## Experiment creation

### Experiment initialization
When creating an experiment

##### 1. Choose an experiment name, it must be in [UpperCamelCase](https://en.wikipedia.org/wiki/Camel_case)
##### 2. Create a new `<YourExperimentName>.vue` file in the [`/src/views/Experiments`](../src/views/Experiments) directory

##### 3. Link your experiment to the [Vue.js routing system](https://router.vuejs.org/)
Create a new entry in the [`/src/router/experiments.js`](../src/router/experiments.js) file following this structure:

```js
{
  path: '/experiments/YourExperimentName/:sceneName',
  name: 'YourExperimentName',
  component: () => import('@/views/Experiments/YourExperimentName'),
  props: true,
  meta: {
    fullName: 'The visible name of your experiment'
  }
}
```

##### 4. Choose or create the experiment mixin
`TODO: finish this part`

An experiment mixin is a subset of functions or data that can be used in a type of experiment.


##### 5. Actual experiment creation
Copy the minimal experiment template [`/src/views/Experiments/_template.vue`](../src/views/Experiments/_template.vue) content to your new experiment.

You are all set! You can now develop your own experiment.
See [Experiment mixins API](#experiment-mixins-api) to check data and methods available from your selected parent mixins using the `this` keyword in any Vue methods/templates.

### Experiment configuration
`TODO: finish this part`

## Experiment mixins API
### ExperimentBase
File: [`/src/mixins/ExperimentBase.vue`](../src/mixins/ExperimentBase.vue)

Extends: []

This mixin is mandatory. If you want to create a new mixin, use this mixin in your mixin.

When drawing the tree from top mixins to the experiment itself, `ExperimentBase` must be the very top parent.

| Data | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `loadingMessage` | `String` | `null` | Message to display while loading the application. `null` = not loading
| `loadingErrorMessage` |  `String` | `null` | Message to display when the application failed to load. `null` = no loading errror
| `qualities` | `Number[]` | `null` | List of qualities for the current scene

| Method | Return type | Description |
| ------ | ----------- | ----------- |
| `loadProgress()` | `void` | Load progress from store into local state |
| `saveProgress()` | `void` | Save progress from local state into store |
| `loadConfig()` | `void` | Load a config object into the local state |
| `finishExperiment()` | `void` | Finish an experiment, sending full data to the server . Don't forget to surcharge this function when using this mixin to add more data! |
| `getQualitiesList()` | `Promise<void>` | Load qualities list from the API |
| `getImage(quality: Number)` | `Promise<Object>` | Load an image from the API |
| `sendMessage({ msgId: String, msg: Object })` | `void` | Send a message using WebSockets, your message will be stored in the database. Message IDs are listed in [`/config.messageId.js`](../config.messageId.js) |
| `setExperimentFinished([done=true: Boolean])` | `void` | Set the current experiment as finished in the browser's cache |

### ExperimentBaseAreSameImages
File: [`/src/mixins/ExperimentBaseAreSameImages.vue`](../src/mixins/ExperimentBaseAreSameImages.vue)

Extends: [[ExperimentBase](#experimentbase)]

| Data | Type | Default | Description |
| ---- | ---- | ------- | ----------- |

| Method | Return type | Description |
| ------ | ----------- | ----------- |

`TODO: finish this part`

### ExperimentBaseExtracts
File: [`/src/mixins/ExperimentBaseExtracts.vue`](../src/mixins/ExperimentBaseExtracts.vue)

Extends: [[ExperimentBase](#experimentbase)]

| Data | Type | Default | Description |
| ---- | ---- | ------- | ----------- |

| Method | Return type | Description |
| ------ | ----------- | ----------- |

`TODO: finish this part`
