'use strict'

import boom from 'boom'
import { logger } from '../config'

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
 */
export const checkRequiredParameters = (requiredParameters, parameters) => {
  if (!requiredParameters.every(aRequiredParameter => Object.keys(parameters).includes(aRequiredParameter)))
    throw boom.badRequest(`Missing parameter(s). Required parameters : ${requiredParameters.join(', ')}.`)
}
