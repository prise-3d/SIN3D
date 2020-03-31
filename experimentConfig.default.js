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
    defaultConfig: {
      lockConfig: true,
      showHoverBorder: true,
      extractConfig: {
        x: 4,
        y: 4
      }
    },
    scenesConfig: {},
    availableScenes: {
      whitelist: [
        'p3d_arcsphere_800_800',
        'p3d_bathroom_800_800',
        'p3d_bedroom_800_800',
        'p3d_bidir_800_800',
        'p3d_bmw-m6_800_800',
        'p3d_bunny-fur_800_800',
        'p3d_car2_800_800',
        'p3d_caustic_800_800',
        'p3d_chopper-titan_800_800',
        'p3d_classroom_800_800',
        'p3d_coffee-splash_800_800',
        'p3d_contemporary-bathroom_800_800',
        'p3d_crown_800_800',
        'p3d_dining-room_800_800',
        'p3d_dragon_250_800_800',
        'p3d_dragon_800_800',
        'p3d_ecosys_800_800',
        'p3d_ganesha_800_800',
        'p3d_glass-of-water_800_800',
        'p3d_glass_800_800',
        'p3d_kitchen_800_800',
        'p3d_lamp_800_800',
        'p3d_landscape-view-0_800_800',
        'p3d_landscape-view-1_800_800',
        'p3d_landscape-view-2_800_800',
        'p3d_landscape-view-3_800_800',
        'p3d_landscape-view-4_800_800',
        'p3d_living-room-2_800_800',
        'p3d_living-room-3_800_800',
        'p3d_living-room_800_800',
        'p3d_pavilion-day_800_800',
        'p3d_pavilion-night_800_800',
        'p3d_sanmiguel_800_800',
        'p3d_sanmiguel_cam18_800_800',
        'p3d_sanmiguel_cam1_800_800',
        'p3d_sanmiguel_cam3_800_800',
        'p3d_staircase2_800_800',
        'p3d_staircase_800_800',
        'p3d_tt_800_800',
        'p3d_tungsten_veach-mis_800_800',
        'p3d_veach-ajar_800_800',
        'p3d_villa-daylight_800_800',
        'p3d_vw-van_800_800',
        // 'p3d_water-caustic_800_800',
        // 'p3d_whiteroom-daytime_800_800',
        'p3d_whiteroom-night_800_800'
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
  },
  PercentQualityRandom: {
    mixins: [mixins.ExperimentBase],
    defaultConfig: {},
    scenesConfig: {},
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
    availableScenes: {
      whitelist: ['50_shades_of_grey'],
      blacklist: null
    }
  }
}
