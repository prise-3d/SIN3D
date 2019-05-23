'use strict'

import { promises as fs } from 'fs'
import path from 'path'
import boom from '@hapi/boom'
import { logger, imagesPath, fileNameConvention, sceneFileNameBlackList, TEST_MODE } from '../config'

/**
 * Call the error handler if a middleware function throw an error
 *
 * @param {Function} fn original middleware function of the route
 * @returns {Promise<Function>} the same middleware function of the route but error handled
 */
export const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(err => {
    next(err)
  })
}

// Middleware to handle middleware errors
export const errorHandler = (err, req, res, next) => {
  // Check whether the error is a boom error
  if (!err.isBoom) {
    // Check if error is invalid JSON body
    if (err instanceof SyntaxError && err.status === 400 && err.hasOwnProperty('body'))
      err = boom.badRequest(err)
    else {
      // The error was not recognized, send a 500 HTTP error
      err = boom.internal(err)
    }
  }

  const { output: { payload } } = err

  // Pass the error to the logging handler
  let errorLogged = new Error(`Error ${payload.statusCode} - ${payload.error} - Message :\n${payload.message}`)
  errorLogged.stack = err.stack

  if (!TEST_MODE) logger.error(formatError(errorLogged, err.data))

  // Send the error to the client
  res.status(payload.statusCode).json({
    message: err.message || payload.message,
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
  if (!requiredParameters.every(aRequiredParameter => parameters.hasOwnProperty(aRequiredParameter)))
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
  if (!sceneName || sceneName === '.' || !/^(?!.*\.\.).*$/.test(sceneName))
    throw boom.badRequest(`The requested scene name "${sceneName}" is not valid.`)
}

/**
 * Check a file name is valid with configured convention
 *
 * @param {string} fileName the file name to check
 * @returns {void}
 * @throws file name does not match convention
 */
export const checkFileName = fileName => {
  if (!fileNameConvention.test(fileName))
    throw new Error(`The file name does not match convention (scene_000150.ext - ${fileNameConvention.toString()}) : "${fileName}".`)
}

/**
 * Get all files in a scene
 *
 * @param {string} sceneName the scene name
 * @returns {Promise<string[]>} the list of all files in the scene
 * @throws scene directory is not accessible
 */
export const getSceneFiles = sceneName => {
  // Check the scene name is valid
  checkSceneName(sceneName)

  // Path to the scene directory
  const scenePath = path.resolve(imagesPath, sceneName)

  return fs.readdir(scenePath).catch(() => {
    throw boom.internal(`Can't access the "${sceneName}" scene directory. Check it exists and you have read permission on it.`)
  })
}

/** Image data type definition (do no remove)
 * @typedef {object} ImageData
 * @property {string} fileName file name of image
 * @property {string} sceneName scene name of image
 * @property {string} prefix prefix of image
 * @property {number} quality quality of image
 * @property {string} ext extension of image
 */
/**
 * Get image data from every files in a scene (exclude blacklisted ones)
 * @typedef {string} filename path to the image
 * @param {string} sceneName the scene name
 * @returns {Promise<ImageData[]>} the data for all images in a scene
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
        ext: regexRes[3],
        fileName: regexRes[0],
        sceneName
      }

      // Check valid quality
      if (isNaN(fileData.quality)) return acc

      // Data is valid, set it
      acc.push(fileData)
    }
    catch (err) {
      failList.push(`Failed to parse file name : "${image}".`)
    }
    return acc
  }, [])

  // Check if the parse fail list is empty
  if (failList.length > 0)
    throw boom.internal(`Failed to parse file names in the "${sceneName}"'s scene directory.`, failList)

  return data
}

/**
 * Format a string or object to a log object
 *
 * @param {object|string} data any message or object
 * @param {('info'|'message'|'error'|any|undefined)} event the type of event
 * @returns {string} the log object stringified
 */
export const formatLog = (data, event = undefined) => ({
  event,
  log: data,
  date: new Date()
})

/**
 * Format an error object
 *
 * @param {Error} errObj an Error object
 * @param {any} data any data to pass to the formatter
 * @returns {string} formatted log object stringified
 */
export const formatError = (errObj, data = undefined) => formatLog({ error: errObj.message, stack: errObj.stack, data })
