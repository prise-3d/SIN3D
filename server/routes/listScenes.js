'use strict'

import express from 'express'
import { promises as fs } from 'fs'
import path from 'path'
import boom from '@hapi/boom'
import { asyncMiddleware } from '../functions'
import { imagesPath } from '../../config'

const router = express.Router()

/**
 * @api {get} /listScenes Get a list of all available scenes
 * @apiVersion 0.1.0
 * @apiName GetListScenes
 * @apiGroup API
 *
 * @apiDescription List all scenes availables in your `IMAGES_PATH` directory
 * @apiSampleRequest /listScenes
 *
 * @apiExample Usage example
 * curl -i -L -X GET "http://diran.univ-littoral.fr/api/listScenes"
 *
 * @apiSuccess {String[]} data List of available scenes
 * @apiSuccessExample {json} Success response example
 * HTTP/1.1 200 OK /api/listScenes
 * {
 *   "data": [
 *      "bathroom",
 *      "contemporary",
 *   ]
 * }
 *
 * @apiError (Error 5xx) 500_[1] Can't access the `IMAGES_PATH` directory
 * @apiErrorExample {json} Images directory not accessible
 * HTTP/1.1 500 Internal Server Error
 * {
 *   "message": "Can't access the \"images\" directory. Check it exists and you have read permission on it"
 * }
 */

/**
 * Get the list of all files in the images directory
 *
 * @returns {string[]} the list of files
 * @throws the directory does not exist or is not accessible
 */
export const getSceneList = () => {
  return fs.readdir(imagesPath).catch(() => {
    throw boom.internal(`Can't access the "${path.basename(imagesPath)}" directory. Check it exists and you have read permission on it.`)
  })
}

// Route which returns a list of all available scenes in the `imagesPath` directory
router.get('/', asyncMiddleware(async (req, res) => res.json({ data: await getSceneList() })))

export default router
