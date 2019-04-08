'use strict'

import express from 'express'
import listScenes from './listScenes'

const router = express.Router()

router.use('/listScenes', listScenes)

export default router
