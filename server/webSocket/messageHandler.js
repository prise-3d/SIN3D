'use strict'

import { formatLog } from '../functions'
import { wsLogger, TEST_MODE } from '../../config'
import DataController from '../database/controllers/Data'

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

  await DataController.add(json)
  if (!TEST_MODE) wsLogger.info(formatLog(json, 'message'))
  ws.send('{"message":"ok"}')
}

export default messageHandler
