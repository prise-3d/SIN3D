'use strict'

import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import WebSocket from 'ws'
import serveStatic from 'serve-static'
import routes from '../../server/routes'
import { apiPrefix, imageServedUrl, imagesPath } from '../../config'
import connectDb from '../../server/database'
import { errorHandler } from '../../server/functions'
import { errorHandler as wsErrorHandler } from '../../server/webSocket'
import wsMessageHandler from '../../server/webSocket/messageHandler'

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

/**
 * Open a WebSocket server on top of a HTTP server
 *
 * @param {object} httpServer a HTTP server instance (ie. Express server object)
 * @returns {object} a WebSocket server instance
 */
export const getWebSocketServer = httpServer => {
  const wss = new WebSocket.Server({ server: httpServer })
  wss.on('error', err => {
    throw err
  })
  wss.on('connection', ws => {
    ws.on('message', data => wsMessageHandler(ws)(data).catch(wsErrorHandler(ws)))
    ws.on('error', wsErrorHandler(ws))
  })
  return wss
}

/** Connect to the database */
export { connectDb }
