// Deep copy to not mutate it with the store (default state is needed when reloading after a refresh)
export default () => JSON.parse(JSON.stringify({
  uuid: null,
  userId: 'global', // default param
  experimentId: 'global', // default param
  gdprConsent: false,
  hostConfig: null,
  scenesList: null,
  progression: {},
  customLinkData: null
}))
