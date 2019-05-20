import deepmerge from 'deepmerge'
import { buildConfig } from '@/functions'

const getMixinConfig = () => import('@/mixins/ExperimentBase/config')
const getGlobalConfig = () => import('@/../experimentConfig/mixins/ExperimentBaseExtracts')

// This will apply to all the scenes
export const defaultConfig = async () => {
  // Import parent mixin config
  const mixinConfig = await getMixinConfig().then(({ defaultConfig: fn }) => fn())

  // Import global config
  const globalConfig = (await getGlobalConfig()).defaultConfig

  return deepmerge.all([
    mixinConfig,
    {
      showHoverBorder: false,
      extractConfig: {
        x: 4,
        y: 4
      }
    },
    globalConfig
  ])
}

// This will overwrite the config for the given scene
export const scenesConfig = async () => {
  // Import parent mixin config
  const mixinConfig = await getMixinConfig().then(({ scenesConfig: fn }) => fn())

  // Import global config
  const globalConfig = (await getGlobalConfig()).scenesConfig

  return deepmerge.all([
    mixinConfig,
    {},
    globalConfig
  ])
}

export default async () => buildConfig(await defaultConfig(), await scenesConfig())
