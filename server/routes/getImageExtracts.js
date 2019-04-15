'use strict'

import express from 'express'
import sharp from 'sharp'
import { constants as fsConstants, promises as fs } from 'fs'
import path from 'path'
import boom from 'boom'

import { asyncMiddleware, checkSceneName, checkRequiredParameters } from '../functions'
import { getImage } from './getImage'
import { imageServedUrl, imagesPath, extractsDirName } from '../../config'

const router = express.Router()

/**
 * @typedef {import('./getImage').Image} Image
 */
/**
 * Cut an image, save its extracts and get the url of these extracts
 *
 * @param {Image} image the path to the image to cut
 * @param {Number} xExtracts the number of extract to do on the horizontal axis (integer)
 * @param {Number} yExtracts the number of extract to do on the vertical axis (integer)
 * @returns {Promise<Image[]>} the list of extracted images
 */
const cutImage = async (image, xExtracts, yExtracts) => {
  const input = sharp(image.path)

  const { width, height } = await input.metadata()

  const xCropSize = width / xExtracts
  const yCropSize = height / yExtracts

  // Check the image is cuttable with the current parameters
  let errorsList = []
  if (!Number.isInteger(xCropSize)) errorsList.push('Incompatible number of horizontal extracts (width % numberOfExtracts != 0)')
  if (!Number.isInteger(yCropSize)) errorsList.push('Incompatible number of vertical extracts (height % numberOfExtracts != 0)')
  if (errorsList.length > 0) throw boom.badRequest('Invalid query parameter(s).', errorsList)

  let extracts = []
  // Cut images
  // Vertical
  for (let y = 0; y < yExtracts; y++) {
    // Horizontal
    for (let x = 0; x < xExtracts; x++) {
      // How to cut the image
      const config = {
        left: x * xCropSize,
        top: y * yCropSize,
        width: xCropSize,
        height: yCropSize
      }

      // Zone number of the extract `00020`
      const fileNameCount = (extracts.length + 1).toString().padStart(5, '0')

      // File name of the extract : `Scene2_zone00199_100.png`
      const extractName = `${image.sceneName}_zone${fileNameCount}_${image.quality}.${image.ext}`

      // Configured path to the image (Check defined convention)
      const pathToImage = [image.sceneName, extractsDirName, `x${xExtracts}_y${yExtracts}`, `zone${fileNameCount}`, extractName]

      // File system path to the extract
      const extractPath = path.resolve(imagesPath, ...pathToImage)

      // URL to the extract on the app
      const extractLink = `${imageServedUrl}/${pathToImage.join('/')}`

      const extractObj = {
        link: extractLink,
        path: extractPath,
        fileName: extractName,
        sceneName: image.sceneName
      }

      // Check the file already exist
      let fileAlreadyExists = false
      try {
        await fs.access(extractPath, fsConstants.R_OK)
        fileAlreadyExists = true
      }
      catch (err) {
        // File does not exist already
      }

      // File already exist, just send its data
      if (fileAlreadyExists) {
        extracts.push(extractObj)
        continue
      }

      // File does not already exist, create it
      // Create the arborescence
      try {
        await fs.mkdir(path.resolve(imagesPath, ...pathToImage.slice(0, pathToImage.length - 1)), { recursive: true })
      }
      catch (err) {
        // An error was caught, add it and go to next extract
        errorsList.push(err.message)
        continue
      }

      // Cut and save the extract
      try {
        await input.extract(config).toFile(extractPath)
        extracts.push(extractObj)
      }
      catch (err) {
        // Error while cutting image
        errorsList.push(err)
      }
    }
  }

  // Extraction finished, check for errors
  if (errorsList.length > 0) throw boom.internal('Error(s) while extracting from image.', errorsList)

  return extracts
}


router.get('/', asyncMiddleware(async (req, res) => {
  // Check the request contains all the required parameters
  checkRequiredParameters(['sceneName', 'imageQuality', 'horizontalExtractCount', 'verticalExtractCount'], req.query)

  const { sceneName, imageQuality, horizontalExtractCount, verticalExtractCount } = req.query

  let errorList = []

  // Check the scene name is valid
  try {
    checkSceneName(sceneName)
  }
  catch (err) {
    errorList.push(err.message)
  }

  // Check `imageQuality` is an integer
  const qualityInt = parseInt(imageQuality, 10)
  if (isNaN(qualityInt)) errorList.push('The specified quality is not an integer.')

  // Check `horizontalExtractCount` is an integer
  const horizontalExtractCountInt = parseInt(horizontalExtractCount, 10)
  if (isNaN(horizontalExtractCountInt)) errorList.push('The specified number of extract for the horizontal axis is not an integer.')

  // Check `imageQuality` is an integer
  const verticalExtractCountInt = parseInt(verticalExtractCount, 10)
  if (isNaN(verticalExtractCountInt)) errorList.push('The specified number of extract for the vertical axis is not an integer.')


  // Check there is no errors with parameters
  if (errorList.length > 0)
    throw boom.badRequest('Invalid query parameter(s).', errorList)

  // Get the image path and link
  const image = await getImage(sceneName, qualityInt)

  // Cut the image
  const extracts = await cutImage(image, horizontalExtractCountInt, verticalExtractCountInt)

  // Send an array of links
  res.json({ data: extracts.map(x => x.link) })
}))

export default router
