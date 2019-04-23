'use strict'

import WebSocket from 'ws'
import { formatLog, formatError } from '../functions'
import { wsLogger, TEST_MODE } from '../../config'
import messageHandler from './messageHandler'

/**
 * @typedef {function} ErrorLogger
 * @param {Error} err an Error object
 */
/**
 * Handle thrown errors
 *
 * @param {object} ws a WebSocket connected client
 * @returns {ErrorLogger} the actual error logger
 */
export const errorHandler = ws => err => {
  ws.send(err.message)
  if (!TEST_MODE) wsLogger.error(formatError(err))
}

/**
 * Create the WebSocket server
 *
 * @param {*} httpServer an HTTP node object (provided by Express here)
 * @returns {void}
 */
const createWsServer = httpServer => {
  const wss = new WebSocket.Server({ server: httpServer })

  wss.on('listening', () => wsLogger.info(formatLog('The WebSocket server was started')))
  wss.on('error', err => wsLogger.error(formatError(err)))

  wss.on('connection', ws => {
    wsLogger.info(formatLog('New client connected.'))

    ws.on('message', data => messageHandler(ws)(data).catch(err => errorHandler(ws)(err)))

    ws.on('error', err => errorHandler(ws)(err))
    ws.on('close', () => wsLogger.info(formatLog('Client disconnected.')))
  })
}

export default createWsServer
