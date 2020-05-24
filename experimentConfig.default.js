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
      showHoverBorder: false,
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
    defaultConfig: {
      lockConfig: true,
      showHoverBorder: false,
      extractConfig: {
        x: 4,
        y: 4
      }
    },
    calibrationScene: '50_shades_of_grey',
    showCalibrationEvery: 5,
    scenesConfig: {},
    availableScenes: {
      whitelist: [
        'p3d_arcsphere-view0_part6',
        'p3d_bunny-fur-view0_part6',
        'p3d_car2-view0_part6',
        'p3d_caustic-view0_part6',
        'p3d_chopper-titan-view0_part6',
        'p3d_coffee-splash-view0_part6',
        'p3d_cornel-box-view0_part6',
        'p3d_crown-view0_part6',
        'p3d_dragon-view0_part6',
        'p3d_dragon_250-view0_part6',
        'p3d_ecosys-view0_part6',
        'p3d_eponge-fractal-5-view0_part6',
        'p3d_eponge-fractal-5-view1_part6',
        'p3d_eponge-fractal-6-view0_part6',
        'p3d_eponge-fractal-6-view1_part6',
        'p3d_ganesha-view0_part6',
        'p3d_glass-of-water-view0_part6',
        'p3d_indirect-view0_part6',
        'p3d_kitchen-view0_part6',
        'p3d_landscape-view3_part6',
        'p3d_living-room-view0_part6',
        'p3d_living-room-view1_part6',
        'p3d_living-room-view2_part6',
        'p3d_low_table_upper_view0_part6',
        'p3d_pavilion-day-view0_part6',
        'p3d_pavilion-day-view1_part6',
        'p3d_pavilion-day-view2_part6',
        'p3d_pavilion-night-view0_part6',
        'p3d_pavilion-night-view1_part6',
        'p3d_pavilion-night-view2_part6',
        'p3d_sportscar-view0_part6',
        'p3d_staircase-view1_part6',
        'p3d_staircase2-view0_part6',
        'p3d_tt-view0_part6',
        'p3d_vw-van-view0_part6'
      ],
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
    calibrationScene: '50_shades_of_grey',
    showCalibrationEvery: 5,
    availableScenes: {
      whitelist: null,
      blacklist: null
    }
  },
  AreSameImagesReference: {
    mixins: [mixins.ExperimentBaseAreSameImages],
    defaultConfig: {},
    scenesConfig: {},
    calibrationScene: '50_shades_of_grey',
    showCalibrationEvery: 5,
    availableScenes: {
      whitelist: null,
      blacklist: null
    }
  },
  AreSameImagesReferenceOneExtract: {
    mixins: [mixins.ExperimentBaseAreSameImages, mixins.ExperimentBaseExtracts],
    defaultConfig: {},
    scenesConfig: {},
    calibrationScene: '50_shades_of_grey',
    showCalibrationEvery: 5,
    availableScenes: {
      whitelist: null,
      blacklist: null
    }
  },
  PercentQualityRandom: {
    mixins: [mixins.ExperimentBase],
    defaultConfig: {},
    scenesConfig: {},
    calibrationScene: '50_shades_of_grey',
    showCalibrationEvery: 5,
    availableScenes: {
      whitelist: ['Appart1opt02', 'EchecsBas'],
      blacklist: null
    }
  },
  IsImageCorrect: {
    mixins: [mixins.ExperimentBase, mixins.ExperimentBaseExtracts],
    defaultConfig: {
      lockConfig: false,
      showHoverBorder: false,
      extractConfig: {
        x: 2,
        y: 1
      }
    },
    scenesConfig: {},
    calibrationScene: '50_shades_of_grey',
    showCalibrationEvery: 5,
    availableScenes: {
      whitelist: ['Appart1opt02', 'EchecsBas'],
      blacklist: null
    }
  },
  IsImageCorrectOneExtract: {
    mixins: [mixins.ExperimentBase, mixins.ExperimentBaseExtracts],
    defaultConfig: {
      lockConfig: false,
      showHoverBorder: false,
      extractConfig: {
        x: 4,
        y: 4
      }
    },
    scenesConfig: {},
    calibrationScene: '50_shades_of_grey',
    showCalibrationEvery: 5,
    availableScenes: {
      whitelist: null,
      blacklist: null
    }
  },
  CalibrationMeasurement: {
    mixins: [mixins.ExperimentBaseExtracts],
    defaultConfig: {
      lockConfig: true
    },
    scenesConfig: {},
    calibrationScene: '50_shades_of_grey',
    showCalibrationEvery: 5,
    availableScenes: {
      whitelist: ['50_shades_of_grey'],
      blacklist: null
    }
  }
}
