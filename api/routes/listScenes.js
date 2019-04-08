'use strict'

import express from 'express'
import { promises } from 'fs'

import { apiConfig } from '../../config'

const fs = promises

const router = express.Router()

router.get('/', async (req, res) => {
  const dirContent = await fs.readdir(apiConfig.imagesPath)
  res.json(dirContent)
})

export default router
