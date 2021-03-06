import router from '../router'
import { API_ROUTES, serialize } from '../functions'

export default {
  setGdprValidated({ commit }) {
    commit('setGdprValidated')
    router.push('/hostConfig')
  },

  setAppUniqueId({ state, commit }) {
    if (!state.uuid) commit('setAppUniqueId')
  },

  async resetApp({ dispatch, commit }, { gdprConsent = false, hostConfig = false, progression = false, scenesList = false }) {
    if (!gdprConsent && !hostConfig && scenesList) {
      await dispatch('loadScenesList')
      router.go()
    }
    commit('resetApp', { gdprConsent, hostConfig, progression })
  },

  async setHostConfig({ commit, dispatch }, hostConfig) {
    // Timeout after 1.5s
    const controller = new AbortController()
    const signal = controller.signal
    setTimeout(() => controller.abort(), 1500)

    const URI = `${hostConfig}${API_ROUTES.ping}`
    return fetch(URI, { signal })
      .then(async res => {
        if (res.status !== 200) throw new Error(`Received wrong HTTP status code : ${res.status} (Need 200).`)

        const content = await res.text()
        if (content !== 'pong') throw new Error('Received wrong web content (Need to receive "pong").')

        // Configuration is valid
        commit('setHostConfig', hostConfig)
        router.push('/experiments')
        dispatch('collectUserData')
      })
      .catch(err => {
        // Host not reachable or invalid HTTP status code
        throw new Error(`Invalid configuration "${URI}". ${!err.message.includes('aborted') ? err.message : ''}`)
      })
  },

  setUserExperimentId({ commit }, { userId = null, experimentId = null }) {
    commit('setUserExperimentId', { userId, experimentId })
  },

  async collectUserData({ state, getters }) {
    let screen = serialize(window.screen)
    screen.orientation = serialize(window.screen.orientation)

    return fetch(getters.getHostURI + API_ROUTES.dataCollect, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uuid: state.uuid,
        userId: state.userId,
        experimentId: state.experimentId,
        screen
      })
    })
  },

  sendMessage({ state, getters: { getHostURI } }, { msgId, msg = undefined }) {
    fetch(`${getHostURI}${API_ROUTES.experimentCollect}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uuid: state.uuid,
        userId: state.userId,
        experimentId: state.experimentId,
        msgId,
        msg
      })
    })
  },

  async checkExistData({ state, getters: { getHostURI } }, { msgId, msg = undefined }) {
    const res = await fetch(`${getHostURI}${API_ROUTES.experimentCheck}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uuid: state.uuid,
        userId: state.userId,
        experimentId: state.experimentId,
        msgId,
        msg
      })
    })

    return res.status
  },

  async loadScenesList({ getters: { isHostConfigured, getHostURI }, commit }) {
    if (!isHostConfigured) throw new Error('Host is not configured.')

    const scenes = await fetch(`${getHostURI}${API_ROUTES.listScenes}`).then(res => res.json())
    commit('setListScenes', scenes.data)
  },

  updateExperimentProgress({ commit }) {
    commit('updateExperimentProgress')
  },
  setExperimentProgress({ commit }, { experimentName, sceneName, data }) {
    commit('setExperimentProgress', { experimentName, sceneName, data })
  },
  setExperimentDone({ commit }, { experimentName, sceneName, done = true }) {
    commit('setExperimentDone', { experimentName, sceneName, done })
  }
}
