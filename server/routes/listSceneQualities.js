'use strict'

import express from 'express'
import { promises as fs } from 'fs'
import path from 'path'
import boom from 'boom'
import { imagesPath } from '../../config'
import { asyncMiddleware, checkRequiredParameters } from '../functions'

const router = express.Router()

// Route which returns a list of all available qualities for a scene
router.get('/', asyncMiddleware(async (req, res) => {
  // Check the request contains all the required parameters
  checkRequiredParameters(['sceneName'], req.query)

  const sceneName = req.query.sceneName

  // Check the scene name is valid (Not trying to go back in the file system tree by using `/../`)
  if (!/^(?!.*\.\.).*$/.test(sceneName))
    throw boom.conflict(`The requested scene name "${sceneName}" is not valid.`)

  // Path to the scene directory
  const scenePath = path.resolve(imagesPath, sceneName)

  // Get the list of all images in the selected scene
  const images = await fs.readdir(scenePath)
    .catch(() => {
      // The images directory does not exist or is not accessible
      throw boom.badRequest(`Can't access the "${scenePath}" directory. Check it exists and you have read permission on it.`)
    })

  // List of blacklisted words from image names
  const blackList = ['config', 'seuilExpe']

  // A list of all fails parsing file names
  let failList = []
  // Parse file name to get qualities
  const qualities = images.reduce((acc, image) => {
    // Go to next file if its name contains a blacklisted word
    if (!blackList.every(x => !image.includes(x))) return

    const sp = image.split('_')
    const end = sp[sp.length - 1] // 000650.png
    const qualityString = end.replace(/\..*/g, '') // 000650
    const qualityInteger = parseInt(qualityString, 10) // 650

    // Check the quality string
    if (isNaN(qualityInteger))
      return failList.push(`Failed to parse file name : ${image}`)

    acc.push(qualityInteger)
  }, [])

  // Check if the parse fail list is empty
  if (failList.length > 0)
    throw boom.internal(`Fail while parsing file names in the "${sceneName}"'s scene directory.`, failList)

  res.json(qualities)
}))

export default router
