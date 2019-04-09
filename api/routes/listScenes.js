'use strict'

import express from 'express'
import { asyncMiddleware, getAvailableScenes } from '../functions'

const router = express.Router()

router.get('/', asyncMiddleware(async (req, res) => {
  const dirContent = await getAvailableScenes()
  console.log('triggered')
  res.json(dirContent)
}))

export default router
