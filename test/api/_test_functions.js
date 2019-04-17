'use strict'

import path from 'path'
import express from 'express'
import serveStatic from 'serve-static'
import routes from '../../server/routes'
import { apiPrefix, imageServedUrl, imagesPath } from '../../config'

// Path to `test` directory
export const testDir = path.resolve(__dirname, '..')

// Pretty-print a JSON object
export const json = obj => 'JSON DATA : ' + (JSON.stringify(obj, null, 2) || obj)

/**
 * Uses supertest to open an Express server on an ephemeral port.
 * The server serves images in `test/images`, all api routes and
 * uses a custom error handler (no logging to stdout).
 *
 * Using `request` (supertest) on this object will start the server
 *
 * @returns {object} an Express server
 */
export const serve = () => {
  const app = express()
  app.use(imageServedUrl, serveStatic(imagesPath))
  app.use(apiPrefix, routes)
  app.use((err, req, res, next) => {
    res.status(err.output.payload.statusCode).json({
      message: err.message || err.output.payload.message,
      data: err.data || undefined
    })
  })
  return app
}

// Before each tests, start a server
export const beforeEachTests = async t => {
  t.context.server = serve()
}
