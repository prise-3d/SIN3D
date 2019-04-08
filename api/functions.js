'use strict'

import _fs, { promises as fs } from 'fs'
import boom from 'boom'
import { apiConfig } from '../config'

/**
 * Call the error handler if a middleware function throw an error
 *
 * @param {Function} fn original middleware function of the route
 * @returns {Function} the same middleware function of the route but error handled
 */
export const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(err => {
    // Check whether the error is a boom error
    if (!err.isBoom) {
      // The error was not recognized, send a 500 HTTP error
      return next(boom.internal(err))
    }
    // It is a boom error, give it to express to handle it
    next(err)
  })
}

// Middleware to handle middleware errors
export const errorHandler = (err, req, res, next) => {
  const { output: { payload } } = err
  console.error(`Error ${payload.statusCode} - ${payload.error}\n${payload.message}\n`)
  return res.status(payload.statusCode).json(payload)
}

/**
 * Get a list of all available scenes
 *
 * @returns {string[]} the available scenes
 */
export const getAvailableScenes = async () => {
  try {
    // Check if the images directory exists
    await fs.access(apiConfig.imagesPath, _fs.constants.R_OK)
  }
  catch (err) {
    // The images directory does not exist or is not accessible
    throw boom.badRequest(`Can't access the "${apiConfig.imagesPath}" directory. Check it exists and you have read permission on it.`)
  }
  return fs.readdir(apiConfig.imagesPath)
}
