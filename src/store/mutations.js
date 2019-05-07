import Vue from 'vue'
import defaultState from '@/store/state'
import Experiments from '@/router/experiments'

const checkProgression = (state, experimentName, sceneName) => {
  if (!state.progression[experimentName])
    state.progression[experimentName] = {}
  if (!state.progression[experimentName][sceneName])
    state.progression[experimentName][sceneName] = { done: false, data: {} }
}

export default {
  resetApp(state, { hostConfig, progression }) {
    if (hostConfig) {
      if (state.socket.isConnected)
        this._vm.$disconnect()
      state.hostConfig = defaultState().hostConfig
    }
    if (progression) state.progression = defaultState().progression
  },

  setHostConfig(state, newConfig) {
    state.hostConfig = newConfig
  },

  setListScenes(state, scenes) {
    state.scenesList = scenes
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
  },

  setExperimentProgress(state, { experimentName, sceneName, data }) {
    checkProgression(state, experimentName, sceneName)
    state.progression[experimentName][sceneName].data = data
  },
  setExperimentDone(state, { experimentName, sceneName, done }) {
    checkProgression(state, experimentName, sceneName)
    state.progression[experimentName][sceneName].done = done
  },

  SOCKET_ONOPEN(state, event) {
    console.info('Connected to WebSocket server')
    Vue.prototype.$socket = event.currentTarget
    state.socket.isConnected = true
  },
  SOCKET_ONCLOSE(state, _event) {
    console.info('Disconnected from WebSocket server')
    state.hostConfig = defaultState().hostConfig
    state.socket.isConnected = false
  },
  SOCKET_ONERROR(state, event) {
    console.error('WebSocket connection error', state, event)
  },
  // default handler called for all methods
  SOCKET_ONMESSAGE(state, { data: rawMessage }) {
    const message = JSON.parse(rawMessage)
    state.socket.message = message
  },
  // mutations for reconnect methods
  SOCKET_RECONNECT(state, count) {
    console.info('Reconnect to WebSocket server', state, count)
  },
  SOCKET_RECONNECT_ERROR(state) {
    console.error('Could not reconnect to WebSocket server')
    state.socket.reconnectError = true
  }
}
