export const API_PREFIX = '/api'
export const API_ROUTES = {
  ping: () => `${API_PREFIX}/ping`,

  dataCollect: () => `${API_PREFIX}/dataCollect`,

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

export const sortIntArray = intArray => intArray ? intArray.sort((a, b) => a - b) : null

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

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 * @param {any[]} array Array to randomize
 * @returns {any[]} The randomized array
 * @see https://stackoverflow.com/a/12646864
 */
export const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

/**
 * Build a configuration file by merging the default config with the asked scene.
 * The asked scene config will overwrite the default config.
 * @param {Object} defaultConfig The default configuration object
 * @param {Object} scenesConfig The scenes specific configuration
 * @returns {Function} A function that will return the scene configuration
 */
export const buildConfig = (defaultConfig = {}, scenesConfig = {}) =>
  sceneName => Object.assign(defaultConfig, scenesConfig[sceneName])
