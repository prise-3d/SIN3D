import deepmerge from 'deepmerge'
import store from '@/store'
import { experiments as experimentsDEFAULT } from '@/../experimentConfig.default'
import { experiments } from '@/../experimentConfig'

// Merge a default config with a specific scene config
const buildConfig = ({ defaultConfig = {}, scenesConfig = {} }, sceneName) =>
  deepmerge(defaultConfig, scenesConfig[sceneName] || {})

// Merge multiple configs (used for multiple mixins)
const buildMultiConfig = (confArr, sceneName) =>
  deepmerge.all(confArr.map(aConfig => buildConfig(aConfig, sceneName)))


/**
 * Find the configuration.
 * Will use the default configuration if not found in the real one.
 * @param {String} experimentName The selected experiment
 * @returns {Object} Configuration object
 */
const getConfigObject = experimentName => {
  if (experiments[experimentName])
    return experiments
  else if (experimentsDEFAULT[experimentName])
    return experimentsDEFAULT
  throw new Error(`Could not find the experiment "${experimentName}" in the config file nor the default config file.`)
}

/**
* Build a configuration file by merging the default config with the asked scene.
* The asked scene config will overwrite the default config.
* It merges the mixin config with the experiment config.
* Experiment config overwrites all.
*
* @param {Object} experimentName The selected experiment
* @param {Object} sceneName The selected scene
* @returns {Object} The config for the selected experiment with the selected scene
*/
export const getExperimentConfig = (experimentName, sceneName) => {
  const config = getConfigObject(experimentName)

  // Build parent mixin config
  const mixinConfig = buildMultiConfig(config[experimentName].mixins, sceneName)
  // Build global config
  const globalConfig = buildConfig(config[experimentName], sceneName)
  // Merge configs
  return deepmerge(mixinConfig, globalConfig)
}

/**
 * Read config to get the list of available scenes for a given experiment.
 * If no whitelist is supplied, it will take all the available scenes.
 * If a blacklist is supplied, it will remove its scenes from the list of scenes.
 *
 * @param {Object} experimentName The selected experiment
 * @returns {String[]} The list of available scenes for this experiment
 */
export const getExperimentSceneList = experimentName => {
  const config = getConfigObject(experimentName)

  let configuredScenesList = []

  const confObj = config[experimentName].availableScenes
  const scenesList = store.state.scenesList

  // Apply whitelist
  if (confObj.whitelist) configuredScenesList = scenesList.filter(x => confObj.whitelist.includes(x))
  else configuredScenesList = scenesList

  // Apply blacklist
  if (confObj.blacklist) configuredScenesList = configuredScenesList.filter(x => !confObj.blacklist.includes(x))

  return configuredScenesList
}
