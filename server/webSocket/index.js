'use strict'

import WebSocket from 'ws'
import { wsLogger } from '../../config'
import messageHandler from './messageHandler'

/**
 * @typedef {object} LogObj
 * @property {Date} date current date
 * @property {object|string} log anything to log
 */
/**
 * Format a string or object to a log object
 *
 * @param {object|string} data any message or object
 * @param {('info'|'message'|'error')} event the type of event
 * @returns {LogObj} the log object
 */
export const formatLog = (data, event = 'info') => ({
  event,
  log: typeof data === 'object' ? JSON.stringify(data) : data,
  date: new Date()
})

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
  wsLogger.error(formatLog({ error: err.message, stack: err.stack }, 'error'))
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
  wss.on('error', err => wsLogger.error(formatLog('WebSocket server error - ' + err.message, 'error')))

  wss.on('connection', ws => {
    wsLogger.info(formatLog('New client connected.'))

    ws.on('message', data => messageHandler(ws)(data).catch(err => errorHandler(ws)(err)))

    ws.on('error', err => errorHandler(ws)(err))
    ws.on('close', () => wsLogger.info(formatLog('Client disconnected.')))
  })
}

export default createWsServer
