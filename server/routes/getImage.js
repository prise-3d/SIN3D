'use strict'

import express from 'express'
import path from 'path'
import boom from 'boom'

import { imagesPath, imageServedUrl } from '../../config'
import { asyncMiddleware, checkSceneName, checkRequiredParameters, getSceneFilesData } from '../functions'

const router = express.Router()

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
 * @param {number} qualityInt the requested quality
 * @returns {Image} the link and path to the image
 */
export const getImage = async (sceneName, qualityInt) => {
  const sceneData = await getSceneFilesData(sceneName)

  // Search an image with the requested quality in the scene
  for (const [imageName, imageData] of sceneData.entries())
    if (qualityInt === imageData.quality)
      return {
        link: `${imageServedUrl}/${sceneName}/${imageName}`,
        path: path.resolve(imagesPath, sceneName, imageName),
        fileName: imageName,
        sceneName,
        quality: imageData.quality,
        ext: imageData.ext
      }

  // Image not found
  throw boom.notFound(`The requested quality (${qualityInt}) was not found for the requested scene (${sceneName}).`)
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

  // Check `imageQuality` is an integer
  const qualityInt = parseInt(imageQuality, 10)
  if (isNaN(qualityInt)) errorList.push('The specified quality is not an integer.')

  // Check there is no errors with parameters
  if (errorList.length > 0)
    throw boom.badRequest('Invalid query parameter(s).', errorList)

  const { link } = await getImage(sceneName, qualityInt)
  res.json({ data: link })
}))

export default router
