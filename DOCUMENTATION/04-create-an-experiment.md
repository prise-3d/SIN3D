# Create an experiment

This wiki page details how to fully create an experiment.

## Summary

 - [Prerequisites](#prerequisites)
 - [Experiment file tree](#experiment-file-tree)
 - [Experiment creation](#experiment-creation)

---

## Prerequisites
To learn how to create an experiment, **you first need to know how [Vue.js](https://vuejs.org/v2/guide/) works**.

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
            ├── _template_.vue                       || Experiment minimal template
            ├── AreSameImagesRandom.vue              || Two random quality images (versus)
            ├── AreSameImagesReference.vue           || One random quality image, one reference image (versus)
            ├── AreSameImagesReferenceOneExtract.vue || Two reference images, one has a random quality extract (versus)
            ├── IsImageCorrect.vue                   || An image cut in half horizontally, tell if it looks normal
            ├── IsImageCorrectOneExtract.vue         || An image cut in half horizontally, tell if it looks normal
            ├── MatchExtractsWithReference.vue       || Lowest quality extracts, match them to reference image
            └── PercentQualityRandom.vue             || Random quality image, tell how high the quality is
```

## Experiment creation
Follow the following steps to create a new experiment.

##### 1. Choose an experiment name, it must be in [UpperCamelCase](https://en.wikipedia.org/wiki/Camel_case)

##### 2. Create a new `<YourExperimentName>.vue` file in the [`/src/views/Experiments`](../src/views/Experiments) directory

##### 3. Link your experiment to the [Vue.js routing system](https://router.vuejs.org/)

Create a new entry in the [`/src/router/experiments.js`](../src/router/experiments.js) file following this structure:

```js
{
  path: '/experiments/<YourExperimentName>/:sceneName',
  name: '<YourExperimentName>',
  component: () => import('@/views/Experiments/<YourExperimentName>'),
  props: true,
  meta: {
    fullName: '<The visible name of your experiment>'
  }
}
```

##### 4. Choose or create the experiment mixin

An experiment mixin is a subset of data or methods that can be used in a type of experiment. The [`ExperimentBase`](./05-experiment-mixins-api.md#experimentbase) mixin is the bare minimum to include in your experiment, it is mandatory.

Keep in mind that if the mixin you are using already extends [`ExperimentBase`](./05-experiment-mixins-api.md#experimentbase), you do not need to import it a second time.

See [Experiment mixins API](./05-experiment-mixins-api.md) to check data and methods available to you. You need to use the `this` keyword in any Vue methods/templates to use these features.

##### 5. Create the experiment configuration

Create a new entry in the `experiments` object of the [`/experimentConfig.default.js`](../experimentConfig.default.js) file following this structure:

```js
YourExperimentName: {
  mixins: [mixins.ExperimentBase], // Your used mixins
  defaultConfig: {                 // Configuration used for all scenes
    // Data to apply to any scenes of the experiment
    // maxTestCount: 5
  },
  scenesConfig: {                  // Scene-specific configuration
    // Data to apply to only some scenes
    // bathroom: {
    //   maxTestCount: 5
    // }
  },
  availableScenes: {
    whitelist: null,               // Whitelist available scenes (String[]). If null, takes all scenes
    blacklist: null                // Remove scenes (String[])
  }
}
```

You can add any data in `defaultConfig` and `scenesConfig` properties, It will get merged with your experiment data (the configuration file has more priority, if you have an experiment data with the same key, it will replace it).

##### 6. Actual experiment creation

Copy the minimal experiment template [`/src/views/Experiments/_template.vue`](../src/views/Experiments/_template.vue) content to your new experiment.

You are all set! You can now develop your own experiment.
