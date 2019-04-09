'use strict'

import express from 'express'
import listScenes from './listScenes'
import getImage from './getImage'

const router = express.Router()

router.use('/listScenes', listScenes)
router.use('/getImage', getImage)

export default router
