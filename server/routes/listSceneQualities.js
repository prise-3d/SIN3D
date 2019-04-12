'use strict'

import express from 'express'
import { asyncMiddleware, checkRequiredParameters, getSceneFilesData } from '../functions'

const router = express.Router()

// Route which returns a list of all available qualities for a scene
router.get('/', asyncMiddleware(async (req, res) => {
  // Check the request contains all the required parameters
  checkRequiredParameters(['sceneName'], req.query)

  const { sceneName } = req.query
  const sceneData = await getSceneFilesData(sceneName)
  const data = Array.from(sceneData.values()).map(x => x.quality)
  res.json(data)
}))

export default router
