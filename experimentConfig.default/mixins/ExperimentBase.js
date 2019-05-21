import { buildConfig } from '@/functions'

// This will apply to all the scenes
export const defaultConfig = {
  // lockConfig: true
}

// This will overwrite the config for the given scene
export const scenesConfig = {
  // bathroom: {
  //   lockConfig: true
  // }
}

export default buildConfig(defaultConfig, scenesConfig)
