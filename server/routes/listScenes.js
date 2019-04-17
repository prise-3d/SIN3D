'use strict'

import express from 'express'
import { promises as fs } from 'fs'
import boom from 'boom'
import { asyncMiddleware } from '../functions'
import { imagesPath } from '../../config'

const router = express.Router()

/**
 * Get the list of all files in the images directory
 *
 * @returns {string[]} the list of files
 * @throws the directory does not exist or is not accessible
 */
export const getSceneList = () => {
  try {
    return fs.readdir(imagesPath)
  }
  catch (err) {
    throw boom.conflict(`Can't access the "${imagesPath}" directory. Check it exists and you have read permission on it.`)
  }
}

// Route which returns a list of all available scenes in the `imagesPath` directory
router.get('/', asyncMiddleware(async (req, res) => res.json({ data: await getSceneList() })))

export default router
