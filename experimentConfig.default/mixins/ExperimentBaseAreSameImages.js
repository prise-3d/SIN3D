import { buildConfig } from '@/functions'

// This will apply to all the scenes
export const defaultConfig = {
  // maxTestCount: 5
}

// This will overwrite the config for the given scene
export const scenesConfig = {
  // bathroom: {
  //   maxTestCount: 5
  // }
}

export default buildConfig(defaultConfig, scenesConfig)
