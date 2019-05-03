import { defaultState } from '@/store/state'
import Experiences from '@/router/experiences'

export default {
  increment(state, amount = 1) {
    state.count += amount
  },

  resetApp(state, { hostConfig, scenesList, progression }) {
    if (hostConfig) state.hostConfig = defaultState.hostConfig
    if (scenesList) state.scenesList = defaultState.scenesList
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
    const progressionObj = Experiences.reduce((acc, x) => {
      acc[x.name] = scenesProgressObj
      return acc
    }, {})

    state.progression = progressionObj
  },

  setExperienceProgress(state, { experienceName, sceneName, data }) {
    if (!state.progression[experienceName])
      state.progression[experienceName] = {}
    if (!state.progression[experienceName][sceneName])
      state.progression[experienceName][sceneName] = { done: false, data: {} }
    state.progression[experienceName][sceneName].data = data
  },
  setExperienceDone(state, { experienceName, sceneName, done }) {
    if (!state.progression[experienceName])
      state.progression[experienceName] = {}
    if (!state.progression[experienceName][sceneName])
      state.progression[experienceName][sceneName] = { done: false, data: {} }

    state.progression[experienceName][sceneName].done = done
  }
}
