'use strict'

import express from 'express'
import listScenes from './listScenes'
import listSceneQualities from './listSceneQualities'
import getImage from './getImage'

const router = express.Router()

router.use('/listScenes', listScenes)
router.use('/listSceneQualities', listSceneQualities)
router.use('/getImage', getImage)

export default router
