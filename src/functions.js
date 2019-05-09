export const API_PREFIX = '/api'
export const API_ROUTES = {
  ping: () => `${API_PREFIX}/ping`,

  listScenes: () => `${API_PREFIX}/listScenes`,

  listSceneQualities: sceneName => `${API_PREFIX}/listSceneQualities?${new URLSearchParams({ sceneName })}`,

  getImage: (sceneName, imageQuality, nearestQuality = false) => `${API_PREFIX}/getImage?${new URLSearchParams({ sceneName, imageQuality, nearestQuality })}`,

  getImageExtracts: (sceneName, imageQuality, horizontalExtractCount, verticalExtractCount, nearestQuality = false) =>
    `${API_PREFIX}/getImageExtracts?${new URLSearchParams({
      sceneName,
      imageQuality,
      horizontalExtractCount,
      verticalExtractCount,
      nearestQuality
    })}`
}

export const delay = ms => new Promise(res => setTimeout(res, ms))

export const buildURI = (ssl, host, port, route = '') => `${ssl ? 'https' : 'http'}://${host}:${port}${route}`
export const buildWsURI = (ssl, host, port, uuid = '') => `${ssl ? 'wss' : 'ws'}://${host}:${port}?uuid=${uuid}`

export const sortIntArray = intArray => intArray.sort((a, b) => a - b)

export const findNearestUpper = (value, arrInt) => {
  const arr = sortIntArray(arrInt)
  const index = arr.findIndex(x => value === x)
  if (index >= 0 && index <= arr.length - 1)
    return index === arr.length - 1
      ? arr[index]
      : arr[index + 1]
}

export const findNearestLower = (value, arrInt) => {
  const arr = sortIntArray(arrInt)
  const index = arr.findIndex(x => value === x)
  if (index >= 0 && index <= arr.length - 1)
    return index === 0
      ? arr[index]
      : arr[index - 1]
}
