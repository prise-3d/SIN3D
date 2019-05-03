export const defaultState = {
  hostConfig: {
    protocol: null,
    host: null,
    port: null
  },
  scenesList: null,
  progression: {}
}

// Deep copy defaultState to not modify it with the store
export default JSON.parse(JSON.stringify(defaultState))
