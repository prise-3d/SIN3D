'use strict'

import express from 'express'
import { promises } from 'fs'

import { imagesPath } from '../../config'
import { checkRequiredParameters } from '../functions'

const fs = promises

const router = express.Router()

router.get('/', async (req, res) => {
  // Check the request contains all the required parameters
  checkRequiredParameters(['sceneName', 'imageQuality'], req.query)

  const dirContent = await fs.readdir(imagesPath)
  res.json({ msg: 'Not ready yet' })
})

export default router
