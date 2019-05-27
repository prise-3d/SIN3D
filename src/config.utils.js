import deepmerge from 'deepmerge'
import store from '@/store'
import { experiments } from '@/../experimentConfig'

// Merge a default config with a specific scene config
const buildConfig = ({ defaultConfig = {}, scenesConfig = {} }, sceneName) =>
  deepmerge(defaultConfig, scenesConfig[sceneName] || {})

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
  if (!experiments[experimentName])
    throw new Error(`Could not find the experiment "${experimentName}" in the config file.`)

  // Build parent mixin config
  const mixinConfig = buildConfig(experiments[experimentName].mixin, sceneName)
  // Build global config
  const globalConfig = buildConfig(experiments[experimentName], sceneName)
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
  if (!experiments[experimentName])
    throw new Error(`Could not find the experiment "${experimentName}" in the config file.`)

  let configuredScenesList = []

  const confObj = experiments[experimentName].availableScenes
  const scenesList = store.state.scenesList

  // Apply whitelist
  if (confObj.whitelist) configuredScenesList = scenesList.filter(x => confObj.whitelist.includes(x))
  else configuredScenesList = scenesList

  // Apply blacklist
  if (confObj.blacklist) configuredScenesList = configuredScenesList.filter(x => !confObj.blacklist.includes(x))

  return configuredScenesList
}
