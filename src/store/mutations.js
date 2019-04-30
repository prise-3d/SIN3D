import { defaultState } from '@/store/state'

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
  }
}
