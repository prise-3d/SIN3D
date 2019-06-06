// Deep copy to not mutate it with the store (default state is needed when reloading after a refresh)
export default () => JSON.parse(JSON.stringify({
  uuid: null,
  userId: null,
  experimentId: null,
  gdprConsent: false,
  hostConfig: {
    ssl: null,
    host: null,
    port: null
  },
  scenesList: null,
  progression: {},
  customLinkData: null
}))
