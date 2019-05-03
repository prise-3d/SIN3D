import { defaultState } from '@/store/state'
import Experiments from '@/router/experiments'

const checkProgression = (state, experimentName, sceneName) => {
  if (!state.progression[experimentName])
    state.progression[experimentName] = {}
  if (!state.progression[experimentName][sceneName])
    state.progression[experimentName][sceneName] = { done: false, data: {} }
}

export default {
  resetApp(state, { hostConfig, progression }) {
    if (hostConfig) state.hostConfig = defaultState.hostConfig
    if (progression) state.progression = defaultState.progression
  },

  setHostConfig(state, newConfig) {
    state.hostConfig = newConfig
  },

  setListScenes(state, scenes) {
    state.scenesList = scenes
    const scenesProgressObj = scenes.reduce((acc, x) => {
      acc[x] = { done: false, data: {} }
      return acc
    }, {})
    const progressionObj = Experiments.reduce((acc, x) => {
      acc[x.name] = scenesProgressObj
      return acc
    }, {})

    state.progression = progressionObj
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
