export const mixins = {
  ExperimentBase: {
    defaultConfig: {},
    scenesConfig: {}
  },

  ExperimentBaseAreSameImages: {
    defaultConfig: {
      maxTestCount: 10
    },
    scenesConfig: {
      // bathroom: {
      //   maxTestCount: 5
      // }
    }
  },

  ExperimentBaseExtracts: {
    defaultConfig: {
      lockConfig: false,
      showHoverBorder: true,
      extractConfig: {
        x: 4,
        y: 4
      }
    },
    scenesConfig: {
      // bathroom: {
      //   lockConfig: false,
      //   showHoverBorder: false,
      //   extractConfig: {
      //     x: 4,
      //     y: 10
      //   }
      // }
    }
  }
}


export const experiments = {
  MatchExtractsWithReference: {
    mixins: [mixins.ExperimentBaseExtracts],
    defaultConfig: {},
    scenesConfig: {},
    availableScenes: {
      whitelist: null,
      blacklist: null
      // No whitelist = Select all scenes
      // Whitelist = Only select some scenes
      // Blacklist = remove scenes
      // whitelist: ['Appart1opt02', 'contemporary', 'bathroom', 'SdbDroite'],
      // blacklist: ['Appart1opt02']
    }
  },
  AreSameImagesRandom: {
    mixins: [mixins.ExperimentBaseAreSameImages],
    defaultConfig: {},
    scenesConfig: {},
    availableScenes: {
      whitelist: null,
      blacklist: null
    }
  },
  AreSameImagesReference: {
    mixins: [mixins.ExperimentBaseAreSameImages],
    defaultConfig: {},
    scenesConfig: {},
    availableScenes: {
      whitelist: null,
      blacklist: null
    }
  },
  AreSameImagesReferenceOneExtract: {
    mixins: [mixins.ExperimentBaseAreSameImages, mixins.ExperimentBaseExtracts],
    defaultConfig: {},
    scenesConfig: {},
    availableScenes: {
      whitelist: null,
      blacklist: null
    }
  }
}
