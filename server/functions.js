'use strict'

import { promises as fs } from 'fs'
import path from 'path'
import boom from 'boom'
import { logger, imagesPath, fileNameConvention, sceneFileNameBlackList } from '../config'

/**
 * Call the error handler if a middleware function throw an error
 *
 * @param {Function} fn original middleware function of the route
 * @returns {Promise<Function>} the same middleware function of the route but error handled
 */
export const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(err => {
    // Check whether the error is a boom error
    if (!err.isBoom) {
      // The error was not recognized, send a 500 HTTP error
      return next(boom.internal(err))
    }
    // It is a boom error, pass it to the error handler
    next(err)
  })
}

// Middleware to handle middleware errors
export const errorHandler = (err, req, res, next) => {
  const { output: { payload } } = err

  // Pass the error to the logging handler
  let logMsg = `Error ${payload.statusCode} - ${payload.error}` +
    ` - Message :\n${payload.message}`
  if (err.data) logMsg += `\nData : \n${JSON.stringify(err.data, null, 2) || err.data}`
  logMsg += `\nStack trace : \n${err.stack}`

  logger.error(logMsg)

  // Send the error to the client
  res.status(payload.statusCode).json({
    message: payload.message,
    data: err.data || undefined
  })

  next()
}


/**
 * Check the request contains all the required parameters
 *
 * @param {string[]} requiredParameters list of all required parameters
 * @param {object} parameters parameters provided in the request (req.query)
 * @returns {void}
 * @throws missing parameters
 */
export const checkRequiredParameters = (requiredParameters, parameters) => {
  if (!requiredParameters.every(aRequiredParameter => Object.keys(parameters).includes(aRequiredParameter)))
    throw boom.badRequest(`Missing parameter(s). Required parameters : ${requiredParameters.join(', ')}.`)
}

/**
 * Check a scene name is valid
 * (Not trying to go back in the file system tree by using `/../`)
 *
 * @param {string} sceneName the scene name to check
 * @returns {void}
 * @throws invalid scene name
 */
export const checkSceneName = sceneName => {
  if (!/^(?!.*\.\.).*$/.test(sceneName))
    throw boom.conflict(`The requested scene name "${sceneName}" is not valid.`)
}

/**
 * Check a file name is valid with configure convention
 *
 * @param {string} fileName the file name to check
 * @returns {void}
 * @throws file name does not match convention
 */
export const checkFileName = fileName => {
  if (!fileNameConvention.test(fileName))
    throw new Error(`The file name does not match convention (scene_000150.ext - ${fileNameConvention.toString()}) : "${fileName}"`)
}

/**
 * Get all files in a scene
 *
 * @param {string} sceneName the scene name
 * @returns {string[]} the list of all files in the scene
 * @throws scene directory is not accessible
 */
export const getSceneFiles = sceneName => {
  // Check the scene name is valid
  checkSceneName(sceneName)

  // Path to the scene directory
  const scenePath = path.resolve(imagesPath, sceneName)

  return fs.readdir(scenePath).catch(() => {
    throw boom.badRequest(`Can't access the "${scenePath}" directory. Check it exists and you have read permission on it.`)
  })
}

/** Image data type definition (do no remove)
 * @typedef {object} ImageData
 * @property {string} prefix prefix of image
 * @property {number} quality quality of image
 * @property {string} ext extension of image
 */
/**
 * Get image data from every files in a scene (exclude blacklisted ones)
 * @typedef {string} filename path to the image
 * @param {string} sceneName the scene name
 * @returns {Promise<Map<filename, ImageData>>} the data for all images in a scene (Map key = file name)
 * @throws some file names could not be parsed
 */
export const getSceneFilesData = async sceneName => {
  // Get scene files
  const files = await getSceneFiles(sceneName)

  // A list of all fails parsing scene file names
  let failList = []

  // Parse file name to get qualities
  const data = files.reduce((acc, image) => {
    // Go to next file if its name contains a blacklisted word
    if (!sceneFileNameBlackList.every(x => image !== x))
      return acc

    // Check file name is valid
    try {
      checkFileName(image)
    }
    catch (err) {
      failList.push(err.message)
      return acc
    }

    // Parse file name
    try {
      const regexRes = fileNameConvention.exec(image)
      // Check valid file name
      if (regexRes.length !== 4) return acc

      const fileData = {
        prefix: regexRes[1],
        quality: parseInt(regexRes[2], 10),
        ext: regexRes[3]
      }

      // Check valid quality
      if (isNaN(fileData.quality)) return acc

      // Data is valid, set it
      acc.set(regexRes[0], fileData)
    }
    catch (err) {
      failList.push(`Failed to parse file name : ${image}`)
    }
    return acc
  }, new Map())

  // Check if the parse fail list is empty
  if (failList.length > 0)
    throw boom.conflict(`Failed to parse file names in the "${sceneName}"'s scene directory.`, failList)

  return data
}
