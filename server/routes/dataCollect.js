'use strict'

import express from 'express'
import boom from '@hapi/boom'
import userAgentParser from 'ua-parser-js'

import { TEST_MODE } from '../../config'
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
 * @apiParam {String} userId The user ID
 * @apiParam {String} experimentId The experiment ID
 * @apiParam {String} uuid The unique user identifier
 * @apiParam {Object} screen Screen data, `window.screen` @see https://developer.mozilla.org/en-US/docs/Web/API/Screen
 *
 * @apiExample Usage example
 * curl -i -L -H "Content-Type: application/json" -X POST "https://diran.univ-littoral.fr/api/dataCollect" -d {"uuid":"test","userId":"rigwild","experimentId":"expe-test","screen":{"width":1920,"height":1024}}
 *
 * @apiSuccessExample {string} Success response example
 * HTTP/1.1 200 OK /api/dataCollect
 * OK
 *
 * @apiError (Error 4xx) 400_[1] Missing parameter(s)
 * @apiErrorExample {json} Missing parameter
 * HTTP/1.1 400 Bad Request
 * {
 *   "message": "Missing parameter(s). Required parameters : uuid, userId, experimentId, screen."
 * }
 *
 * @apiError (Error 4xx) 400_[2] Invalid query parameter
 * @apiErrorExample {json} Invalid query parameter(s)
 * HTTP/1.1 400 Bad Request
 * {
 *   "message": "Invalid body parameter(s).",
 *   "data": [
 *     "\"uuid\" must be a string.",
 *     "\"userId\" must be a string.",
 *     "\"experimentId\" must be a string.",
 *     "\"screen\" must be a valid object."
 *   ]
 * }
 *
 */

router.post('/', asyncMiddleware(async (req, res) => {
  // Check the request contains all the required body parameters
  const b = req.body
  checkRequiredParameters(['uuid', 'screen', 'userId', 'experimentId'], b)

  let errorList = []

  if (typeof b.uuid !== 'string')
    errorList.push('"uuid" must be a string.')

  if (b.userId && typeof b.userId !== 'string')
    errorList.push('"userId" must be a string.')

  if (b.experimentId && typeof b.experimentId !== 'string')
    errorList.push('"experimentId" must be a string.')

  if (typeof b.screen !== 'object' || Object.keys(b.screen).length > 30)
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
    },
    userid: b.userId || null,
    experimentId: b.experimentId || null
  }

  if (!TEST_MODE) await DataController.add(data)

  res.send({ message: 'OK' })
}))

export default router
