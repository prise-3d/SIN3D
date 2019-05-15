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
 * @apiExample Usage example
 * curl -i -L -H "Content-Type: application/json" -X POST "http://diran.univ-littoral.fr/api/dataCollect" -d '{"uuid":"test","viewport":{"x":1920,"y":1024}}'
 *
 * @apiSuccessExample {string} Success response example
 * HTTP/1.1 200 OK /api/dataCollect
 * OK
 */

router.post('/', asyncMiddleware(async (req, res) => {
  // Check the request contains all the required body parameters
  const b = req.body
  checkRequiredParameters(['uuid', 'viewport'], b)

  let errorList = []

  if (typeof b.uuid !== 'string')
    errorList.push('"uuid" must be a string.')

  if (!Number.isInteger(b.viewport.x) || !Number.isInteger(b.viewport.y))
    errorList.push('"viewport.x" and "viewport.y" must be integers.')

  // Check there is no errors with parameters
  if (errorList.length > 0)
    throw boom.badRequest('Invalid body parameter(s).', errorList)

  const userAgent = userAgentParser(req.headers['user-agent'])

  // Collected data object
  const data = {
    uuid: b.uuid,
    msgId: COLLECT_DATA,
    msg: {
      viewport: b.viewport,
      userAgent,
      ip: req.ip
    }
  }

  await DataController.add(data)
  res.send('OK')
}))

export default router
