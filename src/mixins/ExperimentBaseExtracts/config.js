import { buildConfig } from './utils'

// This will apply to all the scenes
export const defaultConfig = {
  showHoverBorder: false,
  extractConfig: {
    x: 4,
    y: 4
  },
  lockConfig: true
}

// This will overwrite the config for the given scene
export const scenesConfig = {
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
