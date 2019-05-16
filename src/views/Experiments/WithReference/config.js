import { buildConfig } from './utils'
import {
  defaultConfig as mixinDefaultConfig,
  scenesConfig as mixinScenesConfig
} from '@/mixins/ExperimentBaseExtracts'

// This will apply to all the scenes
export const defaultConfig = {
  ...mixinDefaultConfig,
  showHoverBorder: false,
  extractConfig: {
    x: 4,
    y: 4
  },
  lockConfig: true
}

// This will overwrite the config for the given scene
export const scenesConfig = {
  ...mixinScenesConfig,
  bathroom: {
    showHoverBorder: false,
    extractConfig: {
      x: 4,
      y: 4
    },
    lockConfig: true
  }
}

export default buildConfig(defaultConfig, scenesConfig)
