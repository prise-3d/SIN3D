'use strict'

import express from 'express'
import { asyncMiddleware, checkRequiredParameters, getSceneFilesData } from '../functions'

const router = express.Router()

/**
 * @api {get} /listSceneQualities?sceneName=:sceneName Get a list of available qualities for a scene
 * @apiVersion 0.1.0
 * @apiName ListScenesQualities
 * @apiGroup API
 *
 * @apiDescription List all available qualities for a given scene
 *
 * @apiParam {String} sceneName The selected scene
 *
 * @apiHeader (Response Headers) {String} Content-Type application/json; charset=utf-8
 *
 * @apiExample Usage example
 * curl -i -L -X GET "http://localhost:5000/api/listSceneQualities?sceneName=bathroom"
 *
 * @apiSuccess {Number[]} data List of available qualities
 * @apiSuccessExample {json} Success response example
 * HTTP/1.1 200 OK /api/listSceneQualities?sceneName=bathroom
 * {
 *   "data": [
 *      10,
 *      20,
 *      30
 *   ]
 * }
 *
 * @apiError (Error 4xx) 400 Missing parameter(s)
 * @apiErrorExample {json} Missing parameter
 * HTTP/1.1 400 Bad Request
 * {
 *   "message": "Missing parameter(s). Required parameters : sceneName."
 * }
 *
 * @apiError (Error 4xx) 400 The requested scene name is not valid
 * @apiErrorExample {json} Invalid scene name
 * HTTP/1.1 400 Bad Request
 * {
 *   "message": "The requested scene name \"bathroom/../\" is not valid."
 * }
 *
 * @apiError (Error 5xx) 500 Can't access the `IMAGES_PATH` directory
 * @apiErrorExample {json} Images directory not accessible
 * HTTP/1.1 500 Internal Server Error
 * {
 *   "message": "Can't access the \"images\" directory. Check it exists and you have read permission on it"
 * }
 *
 * @apiError (Error 5xx) 500 Failed to parse a file's name
 * @apiErrorExample {json} Failed to parse a file's name
 * HTTP/1.1 500 Internal Server Error
 * {
 *   "message": "Failed to parse file names in the \"bathroom\"'s scene directory.",
 *   "data": [
 *     "The file name does not match convention (scene_000150.ext - /^(.*)?_([0-9]{2,})\\.(.*)$/) : \"bathroom_adz00020.png\".",
 *     "The file name does not match convention (scene_000150.ext - /^(.*)?_([0-9]{2,})\\.(.*)$/) : \"bathroom_adz00020.png\"."
 *   ]
 * }
 */

// Route which returns a list of all available qualities for a scene
router.get('/', asyncMiddleware(async (req, res) => {
  // Check the request contains all the required parameters
  checkRequiredParameters(['sceneName'], req.query)

  const { sceneName } = req.query
  const sceneData = await getSceneFilesData(sceneName)
  const data = Array.from(sceneData.values()).map(x => x.quality)
  res.json({ data })
}))

export default router
