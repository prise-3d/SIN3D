'use strict'

import express from 'express'
import boom from 'boom'

import { imageServedUrl } from '../../config'
import { asyncMiddleware, checkSceneName, checkRequiredParameters, getSceneFilesData } from '../functions'

const router = express.Router()

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
    errorList.push(err)
  }

  // Check `imageQuality` is an integer
  const qualityInt = parseInt(imageQuality, 10)
  if (isNaN(qualityInt)) errorList.push('The specified quality is not an integer.')

  // Check there is no errors with parameters
  if (errorList.length > 0)
    throw boom.badRequest('Invalid query parameter(s).', errorList)


  const sceneData = await getSceneFilesData(sceneName)

  // Search an image with the requested quality in the scene
  for (const [imageName, imageData] of sceneData.entries()) {
    if (qualityInt === imageData.quality)
      return res.json({ link: `${imageServedUrl}/${sceneName}/${imageName}` })
  }

  throw boom.notFound(`The requested quality (${imageQuality}) was not found for the requested scene (${sceneName}).`)
}))

export default router
