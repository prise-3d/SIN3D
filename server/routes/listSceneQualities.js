'use strict'

import express from 'express'
import _fs, { promises as fs } from 'fs'
import boom from 'boom'
import { imagesPath } from '../../config'
import { asyncMiddleware, checkRequiredParameters } from '../functions'

const router = express.Router()

// Route which returns a list of all available qualities for a scene

/**
 * Get a list of all qualities available for a given scene
 *
 * @returns {string[]} the available scenes
 */
const getAvailableScenes = async () => {
  try {
    // Check if the directory which contains images exists
    await fs.access(imagesPath, _fs.constants.R_OK)

    // Return the list of all files in the images directory
    return fs.readdir(imagesPath)
  }
  catch (err) {
    // The images directory does not exist or is not accessible
    throw boom.badRequest(`Can't access the "${imagesPath}" directory. Check it exists and you have read permission on it.`)
  }
}

router.get('/', async (req, res) => {
  // Check the request contains all the required parameters
  checkRequiredParameters(['sceneName', 'imageQuality'], req.query)

  const dirContent = await fs.readdir(imagesPath)
  res.json({ msg: 'Not ready yet' })
})

router.get('/', asyncMiddleware(async (req, res) => res.json(await getAvailableScenes())))

export default router
