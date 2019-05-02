'use strict'

import express from 'express'
import path from 'path'
import boom from '@hapi/boom'

import { imagesPath, imageServedUrl } from '../../config'
import { asyncMiddleware, checkSceneName, checkRequiredParameters, getSceneFilesData } from '../functions'

const router = express.Router()

/**
 * @api {get} /getImage?sceneName=:sceneName&imageQuality=:imageQuality Get an image from a scene
 * @apiVersion 0.1.0
 * @apiName GetImage
 * @apiGroup API
 *
 * @apiDescription Get an image from a scene with the required quality
 *
 * @apiParam {String} sceneName The selected scene
 * @apiParam {Number|"min"|"max"|"median"} imageQuality The required quality of the image
 *
 * @apiExample Usage example
 * curl -i -L -X GET "http://diran.univ-littoral.fr/api/getImage?sceneName=bathroom&imageQuality=200"
 *
 * @apiSuccess {String} data Path to the image
 * @apiSuccessExample {json} Success response example
 * HTTP/1.1 200 OK /api/getImage?sceneName=bathroom&imageQuality=200
 * {
 *   "data": "/api/images/bathroom/bathroom_00200.png"
 * }
 *
 * @apiError (Error 4xx) 400_[1] Missing parameter(s)
 * @apiErrorExample {json} Missing parameter
 * HTTP/1.1 400 Bad Request
 * {
 *   "message": "Missing parameter(s). Required parameters : sceneName, imageQuality."
 * }
 *
 * @apiError (Error 4xx) 400_[2] Invalid query parameter
 * @apiErrorExample {json} Invalid query parameter(s)
 * HTTP/1.1 400 Bad Request
 * {
 *   "message": "Invalid query parameter(s).",
 *   "data": [
 *     "The requested scene name \".//../\" is not valid.",
 *     "The specified quality is not an integer."
 *   ]
 * }
 *
 * @apiError (Error 4xx) 404_[1] Quality not found
 * @apiErrorExample {json} Quality not found
 * HTTP/1.1 404 Not Found
 * {
 *   "message": "The requested quality (9999) was not found for the requested scene (bathroom)."
 * }
 *
 * @apiError (Error 5xx) 500_[1] Can't access the `IMAGES_PATH` directory
 * @apiErrorExample {json} Images directory not accessible
 * HTTP/1.1 500 Internal Server Error
 * {
 *   "message": "Can't access the \"images\" directory. Check it exists and you have read permission on it"
 * }
 *
 * @apiError (Error 5xx) 500_[2] Failed to parse a file's name
 * @apiErrorExample {json} Failed to parse a file's name
 * HTTP/1.1 500 Internal Server Error
 * {
 *   "message": "Failed to parse file names in the \"bathroom\"'s scene directory.",
 *   "data": [
 *     "The file name does not match convention (scene_000150.ext - /^(.*)?_([0-9]{2,})\\.(.*)$/) : \"bathroom_adz00020.png\".",
 *     "The file name does not match convention (scene_000150.ext - /^(.*)?_([0-9]{2,})\\.(.*)$/) : \"bathroom_adz00020.png\"."
 *   ]
 * }
 *
 */

/**
 * @typedef {Object} Image
 * @property {string} link the link (URL) to an image on the app
 * @property {string} path the path to the image in the file system
 * @property {string} fileName the name of the image
 * @property {string} sceneName the scene of the image
 * @property {number} quality the quality of the image
 * @property {string} ext the extension of the image
 */

/**
 * Get the link and path to an image
 * @param {string} sceneName the scene to get the image from
 * @param {number|"min"|"max"|"median"} quality the requested quality
 * @returns {Promise<Image>} the link and path to the image
 */
export const getImage = async (sceneName, quality) => {
  const sceneData = await getSceneFilesData(sceneName)

  let imageData = null
  // Search an image with the requested quality in the scene
  if (quality === 'min') {
    const toFind = Math.min(...sceneData.map(x => x.quality))
    imageData = sceneData.find(x => x.quality === toFind)
  }
  else if (quality === 'max') {
    const toFind = Math.max(...sceneData.map(x => x.quality))
    imageData = sceneData.find(x => x.quality === toFind)
  }
  else if (quality === 'median')
    imageData = sceneData.length > 0 ? sceneData[Math.ceil(sceneData.length / 2) - 1] : null
  else
    imageData = sceneData.find(x => quality === x.quality)

  if (imageData)
    return {
      link: `${imageServedUrl}/${sceneName}/${imageData.fileName}`,
      path: path.resolve(imagesPath, sceneName, imageData.fileName),
      fileName: imageData.fileName,
      sceneName: imageData.sceneName,
      quality: imageData.quality,
      ext: imageData.ext
    }

  // Image not found
  throw boom.notFound(`The requested quality "${quality}" was not found for the requested scene "${sceneName}".`)
}

router.get('/', asyncMiddleware(async (req, res) => {
  // Check the request contains all the required parameters
  checkRequiredParameters(['sceneName', 'imageQuality'], req.query)

  const { sceneName, imageQuality } = req.query

  let errorList = []

  // Check the scene name is valid
  try {
    checkSceneName(sceneName)
  }
  catch (err) {
    errorList.push(err.message)
  }

  // Check `imageQuality` is an integer or `min`, `max` or `median`
  const qualityInt = parseInt(imageQuality, 10)
  let quality = null
  if (['min', 'median', 'max'].some(x => x === imageQuality))
    quality = imageQuality
  else if (!isNaN(qualityInt))
    quality = qualityInt
  else
    errorList.push('The specified quality is not an integer or "min", "max" or "median".')

  // Check there is no errors with parameters
  if (errorList.length > 0)
    throw boom.badRequest('Invalid query parameter(s).', errorList)

  const { link } = await getImage(sceneName, quality)
  res.json({ data: link })
}))

export default router
