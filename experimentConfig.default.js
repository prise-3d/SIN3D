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
    scenesConfig: {}
  },
  AreSameImagesRandom: {
    mixin: mixins.ExperimentBaseAreSameImages,
    defaultConfig: {},
    scenesConfig: {}
  },
  AreSameImagesReference: {
    mixin: mixins.ExperimentBaseAreSameImages,
    defaultConfig: {},
    scenesConfig: {}
  }
}
