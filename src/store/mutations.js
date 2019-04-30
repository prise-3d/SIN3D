import { defaultState } from '@/store/state'
import Experiences from '@/router/experiences'

export default {
  increment(state, amount = 1) {
    state.count += amount
  },

  resetApp(state, { hostConfig, scenesList }) {
    if (hostConfig) state.hostConfig = defaultState.hostConfig
    if (scenesList) state.scenesList = defaultState.scenesList
  },

  setHostConfig(state, newConfig) {
    state.hostConfig = newConfig
  },

  setListScenes(state, scenes) {
    state.scenesList = scenes
    const scenesProgressObj = scenes.reduce((acc, x) => {
      acc[x] = false
      return acc
    }, {})
    const progressionObj = Experiences.reduce((acc, x) => {
      acc[x.name] = scenesProgressObj
      return acc
    }, {})

    state.progression = progressionObj
  },

  setExperienceDone(state, { experienceName, sceneName }) {
    if (!state.progression[experienceName])
      state.progression[experienceName] = {}

    state.progression[experienceName][sceneName] = true
  }
}
