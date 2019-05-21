import { buildConfig } from '@/functions'

// This will apply to all the scenes
export const defaultConfig = {}

// This will overwrite the config for the given scene
export const scenesConfig = {}

export default buildConfig(defaultConfig, scenesConfig)
