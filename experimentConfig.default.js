export const mixins = {
  ExperimentBase: {
    defaultConfig: {
      lockConfig: true
    },
    scenesConfig: {
      // bathroom: {
      //   lockConfig: true
      // }
    }
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
      showHoverBorder: false,
      extractConfig: {
        x: 4,
        y: 4
      }
    },
    scenesConfig: {
      // bathroom: {
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
    mixin: mixins.ExperimentBaseExtracts,
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
    mixin: mixins.ExperimentBaseAreSameImages,
    defaultConfig: {},
    scenesConfig: {},
    availableScenes: {
      whitelist: null,
      blacklist: null
    }
  },
  AreSameImagesReference: {
    mixin: mixins.ExperimentBaseAreSameImages,
    defaultConfig: {},
    scenesConfig: {},
    availableScenes: {
      whitelist: null,
      blacklist: null
    }
  }
}
