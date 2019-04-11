'use strict'

import express from 'express'
import { promises as fs } from 'fs'
import boom from 'boom'
import { imagesPath } from '../../config'
import { asyncMiddleware } from '../functions'

const router = express.Router()

// Route which returns a list of all available scenes in the `imagesPath` directory
router.get('/', asyncMiddleware(async (req, res) => {
  try {
    // Return the list of all files in the images directory
    res.json(await fs.readdir(imagesPath))
  }
  catch (err) {
    // The images directory does not exist or is not accessible
    throw boom.badRequest(`Can't access the "${imagesPath}" directory. Check it exists and you have read permission on it.`)
  }
}))

export default router
