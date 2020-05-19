'use strict'

import express from 'express'
import boom from '@hapi/boom'

import { TEST_MODE } from '../../config'
import DataController from '../database/controllers/Data'
import { asyncMiddleware, checkRequiredParameters } from '../functions'

const router = express.Router()

/**
 * @api {post} /experimentCheck /experimentCheck
 * @apiVersion 0.1.11
 * @apiName experimentCheck
 * @apiGroup API
 *
 * @apiDescription Collect user's data
 *
 * @apiParam {String} msgId The type of message to store
 * @apiParam {any} Any data that needs to be stored
 *
 * @apiExample Usage example
 * curl -i -L -H "Content-Type: application/json" -X POST "https://diran.univ-littoral.fr/api/experimentCheck" -d {"msgId":"test","msg":{}}
 *
 * @apiSuccessExample {string} Success response example
 * HTTP/1.1 204 OK /api/experimentCheck
 *
 * @apiError (Error 4xx) 400_[1] Missing parameter(s)
 * @apiErrorExample {json} Missing parameter
 * HTTP/1.1 400 Bad Request
 * {
 *   "message": "Missing parameter(s). Required parameters : msgId, msg."
 * }
 *
 * @apiError (Error 4xx) 400_[2] Invalid query parameter
 * @apiErrorExample {json} Invalid query parameter(s)
 * HTTP/1.1 400 Bad Request
 * {
 *   "message": "Invalid body parameter(s).",
 *   "data": [
 *     "\"msgId\" must be a string."
 *   ]
 * }
 *
 */

router.post('/', asyncMiddleware(async (req, res) => {
  // Check the request contains all the required body parameters
  const b = req.body
  checkRequiredParameters(['msgId', 'msg'], b)

  const {
    msgId,
    msg,
    userId = null,
    experimentId = null
  } = req.body

  console.log('Trying to find data')

  // Check there is no errors with parameters
  if (typeof b.msgId !== 'string')
    throw boom.badRequest('Invalid body parameter(s).', ['"msgId" must be a string.'])

  let status = 204

  console.log('Trying to find data')
  // Add data to the database
  if (!TEST_MODE) {
    console.log({ msgId, msg, userId, experimentId })
    const findDoc = await DataController.findOne({ msgId, msg, userId, experimentId })
    console.log(findDoc)
    if (findDoc)
      status = 208
  }

  res.status(status).send()
}))

export default router
