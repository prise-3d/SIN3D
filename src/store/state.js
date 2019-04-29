export const defaultState = {
  hostConfig: {
    protocol: null,
    host: null,
    port: null
  },
  scenesList: null,
  count: 0
}

// Deep copy defaultState to not modify it with the store
export default JSON.parse(JSON.stringify(defaultState))
