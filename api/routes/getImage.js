'use strict'

import express from 'express'
import { promises } from 'fs'

import { apiConfig } from '../../config'

const fs = promises

const router = express.Router()

router.get('/', async (req, res) => {
  const requiredParameters = ['sceneName', 'imageQuality']
  const params = req.query

  // Check if all required parameters were passed
  if (!requiredParameters.every(parameter => Object.keys(params).includes(parameter))) {
    // Some parameters are missing
    res.statusCode = 400
    res.json({ error: `Missing parameter(s). Required parameters : ${requiredParameters.join(', ')}.` })
    return
  }

  const dirContent = await fs.readdir(apiConfig.imagesPath)
  res.json(req.query)
  res.json({ msg: 'Not ready yet' })
})

export default router
