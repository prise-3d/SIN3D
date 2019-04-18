'use strict'

import { formatLog } from './index'
import { wsLogger } from '../../config'

/**
 * @typedef {Function} MessageHandler
 * @param {string} data a message received from a client
 */
/**
 * Treat received message from a WebSocket client
 * @param {object} ws a WebSocket connected client
 * @returns {MessageHandler} the message handler
 */
const messageHandler = ws => async data => {
  let json
  try {
    json = JSON.parse(data)
  }
  catch (err) {
    throw new Error('Invalid JSON data.')
  }

  wsLogger.info(formatLog(json, 'message'))
  ws.send('ok')
}

export default messageHandler
