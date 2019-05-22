import deepmerge from 'deepmerge'
import { buildConfig } from '@/functions'

const getMixinConfig = () => import('@/mixins/ExperimentBaseAreSameImages/config')
const getGlobalConfig = () => import('@/../experimentConfig/Experiments/AreSameImagesRandom')

// This will apply to all the scenes
export const defaultConfig = async () => {
  // Import parent mixin config
  const mixinConfig = await getMixinConfig().then(({ defaultConfig: fn }) => fn())

  // Import global config
  const globalConfig = (await getGlobalConfig()).defaultConfig

  return deepmerge.all([
    mixinConfig,
    {},
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
