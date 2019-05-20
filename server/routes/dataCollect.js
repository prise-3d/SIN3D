'use strict'

import express from 'express'
import boom from '@hapi/boom'
import userAgentParser from 'ua-parser-js'

import { COLLECT_DATA } from '../../config.messagesId'
import DataController from '../database/controllers/Data'
import { asyncMiddleware, checkRequiredParameters } from '../functions'

const router = express.Router()

/**
 * @api {post} /dataCollect /dataCollect
 * @apiVersion 0.1.11
 * @apiName dataCollect
 * @apiGroup API
 *
 * @apiDescription Collect user's data
 *
 * @apiParam {String} uuid The unique user identifier
 * @apiParam {Object} screen Screen data, `window.screen` @see https://developer.mozilla.org/en-US/docs/Web/API/Screen
 *
 * @apiExample Usage example
 * curl -i -L -H "Content-Type: application/json" -X POST "http://diran.univ-littoral.fr/api/dataCollect" -d {"uuid":"test","screen":{"width":1920,"height":1024}}
 *
 * @apiSuccessExample {string} Success response example
 * HTTP/1.1 200 OK /api/dataCollect
 * OK
 *
 * @apiError (Error 4xx) 400_[1] Missing parameter(s)
 * @apiErrorExample {json} Missing parameter
 * HTTP/1.1 400 Bad Request
 * {
 *   "message": "Missing parameter(s). Required parameters : uuid, screen."
 * }
 *
 * @apiError (Error 4xx) 400_[2] Invalid query parameter
 * @apiErrorExample {json} Invalid query parameter(s)
 * HTTP/1.1 400 Bad Request
 * {
 *   "message": "Invalid body parameter(s).",
 *   "data": [
 *     "\"uuid\" must be a string.",
 *     "\"screen\" must be a valid object."
 *   ]
 * }
 *
 */

router.post('/', asyncMiddleware(async (req, res) => {
  // Check the request contains all the required body parameters
  const b = req.body
  checkRequiredParameters(['uuid', 'screen'], b)

  let errorList = []

  if (typeof b.uuid !== 'string')
    errorList.push('"uuid" must be a string.')

  if (!Object.isObject(b.screen) || Object.keys(b.screen).length > 30)
    errorList.push('"screen" must be a valid object.')

  // Check there is no errors with parameters
  if (errorList.length > 0)
    throw boom.badRequest('Invalid body parameter(s).', errorList)

  const userAgent = userAgentParser(req.headers['user-agent'])

  // Collected data object
  const data = {
    uuid: b.uuid,
    msgId: COLLECT_DATA,
    msg: {
      screen: b.screen,
      userAgent,
      ip: req.ip
    }
  }

  await DataController.add(data)
  res.send('OK')
}))

export default router
