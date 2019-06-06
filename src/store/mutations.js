import defaultState from '@/store/state'
import Experiments from '@/router/experiments'

const checkProgression = (state, experimentName, sceneName) => {
  if (!state.progression[experimentName])
    state.progression[experimentName] = {}
  if (!state.progression[experimentName][sceneName])
    state.progression[experimentName][sceneName] = { done: false, data: {} }
}
const createProgressionObj = (state, scenes) => {
  const progressionObj = Experiments.reduce((accExpe, expe) => {
    const scenesProgressObj = scenes.reduce((accScene, scene) => {
      // Do not overwrite current progression
      if (state.progression[expe.name] && state.progression[expe.name][scene])
        accScene[scene] = state.progression[expe.name][scene]
      else accScene[scene] = { done: false, data: {} }
      return accScene
    }, {})
    accExpe[expe.name] = scenesProgressObj
    return accExpe
  }, {})
  state.progression = progressionObj
}

export default {
  setCustomLinkData(state, data) {
    state.customLinkData = JSON.parse(atob(data))
  },
  clearCustomLinkData(state) {
    state.customLinkData = null
  },

  setGdprValidated(state) {
    state.gdprConsent = true
  },

  setAppUniqueId(state) {
    state.uuid = [...Array(30)].map(() => Math.random().toString(36)[2]).join('')
  },

  resetApp(state, { gdprConsent, hostConfig, progression }) {
    const defaultStateObj = defaultState()
    if (gdprConsent) {
      state.gdprConsent = false
      state.hostConfig = defaultStateObj.hostConfig
      state.userId = defaultStateObj.userId
      state.experimentId = defaultStateObj.experimentId
      state.progression = defaultStateObj.progression
      state.scenesList = defaultStateObj.scenesList
      return
    }

    if (hostConfig) {
      state.hostConfig = defaultStateObj.hostConfig
      state.userId = defaultStateObj.userId
      state.experimentId = defaultStateObj.experimentId
    }
    if (progression) {
      // Reset progression and recreate the progression object
      state.progression = defaultStateObj.progression
      if (state.scenesList) createProgressionObj(state, state.scenesList)
    }
  },

  setHostConfig(state, newConfig) {
    state.hostConfig = newConfig
  },

  setUserExperimentId(state, { userId, experimentId }) {
    state.userId = userId
    state.experimentId = experimentId
  },

  setListScenes(state, scenes) {
    state.scenesList = scenes
    createProgressionObj(state, scenes)
  },

  setExperimentProgress(state, { experimentName, sceneName, data }) {
    checkProgression(state, experimentName, sceneName)
    state.progression[experimentName][sceneName].data = data
  },
  setExperimentDone(state, { experimentName, sceneName, done }) {
    checkProgression(state, experimentName, sceneName)
    state.progression[experimentName][sceneName].done = done
  }
}
