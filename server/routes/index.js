'use strict'

import express from 'express'
import listScenes from './listScenes'
import listSceneQualities from './listSceneQualities'
import getImage from './getImage'
import getImageExtracts from './getImageExtracts'
import ping from './ping'

const router = express.Router()

router.use('/listScenes', listScenes)
router.use('/listSceneQualities', listSceneQualities)
router.use('/getImage', getImage)
router.use('/getImageExtracts', getImageExtracts)
router.get('/ping', ping)

export default router
