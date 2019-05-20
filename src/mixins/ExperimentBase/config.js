import deepmerge from 'deepmerge'
import { buildConfig } from '@/functions'

// const getMixinConfig = () => {}
const getGlobalConfig = () => import('@/../experimentConfig/mixins/ExperimentBase')

// This will apply to all the scenes
export const defaultConfig = async () => {
  const globalConfig = (await getGlobalConfig()).defaultConfig
  return deepmerge.all([
    {
      lockConfig: true
    },
    globalConfig
  ])
}

// This will overwrite the config for the given scene
export const scenesConfig = async () => {
  const globalConfig = (await getGlobalConfig()).scenesConfig
  return deepmerge.all([
    {},
    globalConfig
  ])
}

export default async () => buildConfig(await defaultConfig(), await scenesConfig())
