# Experiment mixins API

This wiki page details available data and methods in the experiments mixins.

## Summary

 - [ExperimentBase](#experimentbase)
 - [ExperimentBaseAreSameImages](#experimentbasearesameimages)
 - [ExperimentBaseExtracts](#experimentbaseextracts)

---

## ExperimentBase
File: [`/src/mixins/ExperimentBase.vue`](../src/mixins/ExperimentBase.vue)

Extends: None

**This mixin is mandatory**. If you want to create a new mixin, **use this mixin in your mixin**.

When drawing the tree from top mixins to the experiment itself, **`ExperimentBase` must be the very top parent**.

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
| `sendMessage({ msgId: String, msg: Object })` | `void` | Send a message using `/experimentCollect` API route, your message will be stored in the database. Message IDs are listed in [`/config.messageId.js`](../config.messageId.js) |
| `setExperimentFinished([done=true: Boolean])` | `void` | Set the current experiment as finished in the browser's cache |

## ExperimentBaseAreSameImages
File: [`/src/mixins/ExperimentBaseAreSameImages.vue`](../src/mixins/ExperimentBaseAreSameImages.vue)

Extends: [[`ExperimentBase`](#experimentbase)]

| Data | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `maxTestCount` | `Number` | `null` | The total number of tests to pass for this scene |
| `testCount` | `Number` | `1` | Passed tests count |
| `image1` | `Object` | `null` | One of the two images |
| `image2` | `Object` | `null` | One of the two images |

| Method | Return type | Description |
| ------ | ----------- | ----------- |
| `scrollToChoiceButtons()` | `void` | Scroll the page to the answer buttons |
| `getTest(leftQuality: Number, rightQuality: Number)` | `Promise<Object>` | Load a test using provided qualities |
| `areTheSameAction(areTheSame: Boolean, getTestFn: Function, additionalData: any)` | `Promise<Object>` | Answer to the versus. `getTestFn` shoud be an async function that returns an object matching `{ image1: Object, image2: Object }`. additionalData is the experiment-specific content you want to send to the database  |
| `finishExperiment()` | `void` | Finish an experiment |

## ExperimentBaseExtracts
File: [`/src/mixins/ExperimentBaseExtracts.vue`](../src/mixins/ExperimentBaseExtracts.vue)

Extends: [[`ExperimentBase`](#experimentbase)]

| Data | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `extractConfig` | `Object` | `{ x=null: Number, y=null: Number }` | Used configuration to cut the image |
| `extracts` | `Object[]` | `[]` | List of extracts of the cutted image |
| `extractsInfos` | `Object` | `null` | Informations on the cutted image |
| `showHoverBorder` | `Boolean` | `null` | Should the extracts be hoverable (white rectangle around the extract) |
| `lockConfig` | `Boolean` | `null` | Should the extract configuration be editable |

| Method | Return type | Description |
| ------ | ----------- | ----------- |
| `getExtracts([quality='min']: Number|String)` | `Promise<Object>` | Load image extracts using the provided quality and extract configuration |
| `setExtractConfig(config: Object, [configuratorRef: Object])` | `Promise<Object>` | Change the extract configuration. It loads the new extracts. `config` is the new extracts configuration to use. If `configuratorRef` is provided, it will extract the extracts configurator |
| `extractAction(event: MouseEvent, extractObj: Object)` | `Promise<void>` | Used when clicking on an extract. `event` is the mouse event (left/right click). `extractObj` is the object corresponding to the clicked extract (from the extracts array) |
| `getExtractFullObject(extractsApiObj: Object)` | `Promise<Object>` | Takes the API image extracts response and apply more data to the extracts (like next/prec quality, zone, index or full link to image) |
| `getClickDataObject(event, extractObj, action)` | `Object` | Calculate data on clicked event. Will get the click position on the responsive image, calculate the ratio to the real-sized image. It returns the full message sent when clicking on an extract |
| `finishExperiment()` | `void` | Finish an experiment sending final experiment data |
