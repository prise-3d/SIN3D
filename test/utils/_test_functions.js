'use strict'

import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import serveStatic from 'serve-static'
import routes from '../../server/routes'
import { apiPrefix, imageServedUrl, imagesPath } from '../../config'
import connectDb from '../../server/database'
import { errorHandler } from '../../server/functions'

// Path to `test` directory
export const testDir = path.resolve(__dirname, '..')

// Pretty-print a JSON object
export const json = obj => 'JSON DATA : ' + (JSON.stringify(obj, null, 2) || obj)

/**
 * Open an Express server not listening to any port.
 * The server serves images in `test/images`, all api routes and
 * uses a custom error handler (no logging to stdout).
 *
 * Using `request` (supertest) on this object will start the server
 * on an ephemeral port.
 *
 * @param {PluginConfig} plugins plugins that should be loaded with the server
 * @returns {object} an Express server
 */
export const getHttpServer = () => {
  const app = express()
  app.use(bodyParser.json())
  app.use(imageServedUrl, serveStatic(imagesPath))
  app.use(apiPrefix, routes)
  app.use(errorHandler)
  return app
}

/** Connect to the database */
export { connectDb }
