import { buildConfig } from '@/functions'

// This will apply to all the scenes
export const defaultConfig = {
  // showHoverBorder: false,
  // extractConfig: {
  //   x: 4,
  //   y: 6
  // }
}

// This will overwrite the config for the given scene
export const scenesConfig = {
  // bathroom: {
  //   showHoverBorder: false,
  //   extractConfig: {
  //     x: 4,
  //     y: 10
  //   }
  // }
}

export default buildConfig(defaultConfig, scenesConfig)
