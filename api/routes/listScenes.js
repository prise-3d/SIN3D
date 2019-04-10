'use strict'

import express from 'express'
import _fs, { promises as fs } from 'fs'
import boom from 'boom'
import { imagesPath } from '../config'
import { asyncMiddleware } from '../functions'

const router = express.Router()

// Route which returns a list of all available scenes in the `imagesPath` directory

/**
 * Get a list of all available scenes
 *
 * @returns {string[]} the available scenes
 */
const getAvailableScenes = async () => {
  try {
    // Check if the directory which contains images exists
    await fs.access(imagesPath, _fs.constants.R_OK)
  }
  catch (err) {
    // The images directory does not exist or is not accessible
    throw boom.badRequest(`Can't access the "${imagesPath}" directory. Check it exists and you have read permission on it.`)
  }
  return fs.readdir(imagesPath)
}

router.get('/', asyncMiddleware(async (req, res) => res.json(await getAvailableScenes())))

export default router
