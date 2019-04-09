'use strict'

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
  console.error(`Error ${payload.statusCode} - ${payload.error}\n${payload.message}\n`)
  return res.status(payload.statusCode).json(payload)
}
