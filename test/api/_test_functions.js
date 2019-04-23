'use strict'

import path from 'path'
import express from 'express'
import WebSocket from 'ws'
import serveStatic from 'serve-static'
import routes from '../../server/routes'
import { apiPrefix, imageServedUrl, imagesPath } from '../../config'
import connectDb from '../../server/database'
import { errorHandler as wsErrorHandler } from '../../server/webSocket'
import wsMessageHandler from '../../server/webSocket/messageHandler'

// Path to `test` directory
export const testDir = path.resolve(__dirname, '..')

// Pretty-print a JSON object
export const json = obj => 'JSON DATA : ' + (JSON.stringify(obj, null, 2) || obj)

/**
 * @typedef PluginConfig
 * @property {boolean} [webSocket=false] should the server start with a WebSocket server
 * @property {boolean} [database=false] should the server start with a WebSocket server
 */
/**
 * Open an Express server not listening to any port.
 * The server serves images in `test/images`, all api routes and
 * uses a custom error handler (no logging to stdout).
 *
 * Using `request` (supertest) on this object will start the server
 * on an ephemeral port.
 * @param {PluginConfig} plugins plugins that should be loaded with the server
 * @returns {object} an Express server
 */
const serve = async (plugins = { webSocket: false, database: false }) => {
  // Connect to db
  if (plugins && plugins.database) await connectDb()

  // Open a HTTP server
  const app = express()
  app.use(imageServedUrl, serveStatic(imagesPath))
  app.use(apiPrefix, routes)
  app.use((err, req, res, next) => {
    res.status(err.output.payload.statusCode).json({
      message: err.message || err.output.payload.message,
      data: err.data || undefined
    })
  })

  // Open a WebSocket server
  if (plugins && plugins.webSocket) {
    const wss = new WebSocket.Server({ server: app })
    wss.on('error', err => {
      throw err
    })
    wss.on('connection', ws => {
      ws.on('message', data => wsMessageHandler(ws)(data).catch(wsErrorHandler(ws)))
      ws.on('error', wsErrorHandler(ws))
    })
  }

  return app
}

// Pass a server to test context
export const getTestServer = async (t, plugins) => (t.context.server = await serve(plugins))

