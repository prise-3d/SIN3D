'use strict'

import express from 'express'

const router = express.Router()

/**
 * @api {get} /ping /ping
 * @apiVersion 0.1.0
 * @apiName ping
 * @apiGroup API
 *
 * @apiDescription Check if the API is up
 *
 * @apiExample Usage example
 * curl -i -L -X GET "http://diran.univ-littoral.fr/api/ping"
 *
 * @apiSuccessExample {string} Success response example
 * HTTP/1.1 200 OK /api/ping
 * pong
 */

router.get('/ping', (req, res) => res.send('pong'))

export default router
