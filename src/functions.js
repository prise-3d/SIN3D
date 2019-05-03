export const API_PREFIX = '/api'
export const API_ROUTES = {
  ping: () => `${API_PREFIX}/ping`,

  listScenes: () => `${API_PREFIX}/listScenes`,

  listSceneQualities: sceneName => `${API_PREFIX}/listSceneQualities?sceneName=${new URLSearchParams({ sceneName })}`,

  getImage: (sceneName, imageQuality, nearestQuality = false) => `${API_PREFIX}/getImage?${new URLSearchParams({ sceneName, imageQuality, nearestQuality })}`,

  getImageExtracts: (sceneName, imageQuality, horizontalExtractCount, verticalExtractCount, nearestQuality = false) =>
    `${API_PREFIX}/getImage?${new URLSearchParams({
      sceneName,
      imageQuality,
      horizontalExtractCount,
      verticalExtractCount,
      nearestQuality
    })}`
}

export const delay = ms => new Promise(res => setTimeout(res, ms))

export const buildURI = (protocol, host, port, route = '') => `${protocol}://${host}:${port}${route}`
