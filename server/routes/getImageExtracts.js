'use strict'

import express from 'express'
import sharp from 'sharp'
import { constants as fsConstants, promises as fs } from 'fs'
import path from 'path'
import boom from '@hapi/boom'

import { asyncMiddleware, checkSceneName, checkRequiredParameters } from '../functions'
import { imageServedUrl, imagesPath, extractsDirName } from '../../config'
import { getImage } from './getImage'

const router = express.Router()

/**
 * @api {get} /getImageExtracts?sceneName=:sceneName&imageQuality=:imageQuality&horizontalExtractCount=:horizontalExtractCount&verticalExtractCount=:verticalExtractCount&nearestQuality=:nearestQuality Get image extracts
 * @apiVersion 0.1.0
 * @apiName GetImageExtracts
 * @apiGroup API
 *
 * @apiDescription Get an image from a scene with the required quality and cut it with the requested configuration
 *
 * @apiParam {String} sceneName The selected scene
 * @apiParam {Number|"min"|"max"|"median"} imageQuality The required quality of the image
 * @apiParam {Number} horizontalExtractCount The amount of extracts for the horizontal axis
 * @apiParam {Number} verticalExtractCount The amount of extracts for the vertical axis
 * @apiParam {Boolean} [nearestQuality=false] if selected quality not availabie, select the nearest one
 *
 * @apiExample Usage example
 * curl -i -L -X GET "http://diran.univ-littoral.fr/api/getImageExtracts?sceneName=bathroom&imageQuality=200&horizontalExtractCount=1&verticalExtractCount=2"
 *
 * @apiSuccess {String[]} data Path to the extracted images
 * @apiSuccessExample {json} Success response example
 * HTTP/1.1 200 OK /api/getImageExtracts?sceneName=bathroom&imageQuality=200&horizontalExtractCount=1&verticalExtractCount=2
 * {
 *   "data": {
 *     extracts: [
 *       "/api/images/bathroom/extracts/x1_y2/zone00001/bathroom_zone00001_200.png",
 *       "/api/images/bathroom/extracts/x1_y2/zone00002/bathroom_zone00002_200.png"
 *     ],
 *     "info": {
 *       "link": "/api/images/bathroom/bathroom_00200.png",
 *       "fileName": "bathroom_00200.png",
 *       "sceneName": "bathroom",
 *       "quality": 200,
 *       "ext": "png"
 *     }
 *   }
 * }
 *
 * @apiError (Error 4xx) 400_[1] Missing parameter(s)
 * @apiErrorExample {json} Missing parameter
 * HTTP/1.1 400 Bad Request
 * {
 *   "message": "Missing parameter(s). Required parameters : sceneName, imageQuality, horizontalExtractCount, verticalExtractCount."
 * }
 *
 * @apiError (Error 4xx) 400_[2] Invalid query parameter
 * @apiErrorExample {json} Invalid query parameter(s)
 * HTTP/1.1 400 Bad Request
 * {
 *   "message": "Invalid query parameter(s).",
 *   "data": [
 *     "The requested scene name \".//../\" is not valid.",
 *     "The specified quality is not an integer.",
 *     "The specified number of extract for the horizontal axis is not an integer.",
 *     "The specified number of extract for the vertical axis is not an integer.",
 *     "Impossible to use \"min\", \"max\" or \"median\" with \"nearestQuality\" on."
 *   ]
 * }
 *
 * @apiError (Error 4xx) 400_[3] Invalid configuration
 * @apiErrorExample {json} Invalid configuration
 * HTTP/1.1 400 Bad Request
 * {
 *   "message": "Invalid query parameter(s).",
 *   "data": [
 *     "Incompatible number of horizontal extracts (width % numberOfExtracts != 0).",
 *     "Incompatible number of vertical extracts (height % numberOfExtracts != 0)."
 *   ]
 * }
 *
 * @apiError (Error 4xx) 404_[1] Quality not found
 * @apiErrorExample {json} Quality not found
 * HTTP/1.1 404 Not Found
 * {
 *   "message": "The requested quality (9999) was not found for the requested scene (bathroom)."
 * }
 *
 * @apiError (Error 5xx) 500_[1] Can't access the `IMAGES_PATH` directory
 * @apiErrorExample {json} Images directory not accessible
 * HTTP/1.1 500 Internal Server Error
 * {
 *   "message": "Can't access the \"images\" directory. Check it exists and you have read permission on it"
 * }
 *
 * @apiError (Error 5xx) 500_[2] Failed to parse a file's name
 * @apiErrorExample {json} Failed to parse a file's name
 * HTTP/1.1 500 Internal Server Error
 * {
 *   "message": "Failed to parse file names in the \"bathroom\"'s scene directory.",
 *   "data": [
 *     "The file name does not match convention (scene_000150.ext - /^(.*)?_([0-9]{2,})\\.(.*)$/) : \"bathroom_adz00020.png\".",
 *     "The file name does not match convention (scene_000150.ext - /^(.*)?_([0-9]{2,})\\.(.*)$/) : \"bathroom_adz00020.png\"."
 *   ]
 * }
 *
 */

/**
 * Cut an image, save its extracts and get the url of these extracts
 *
 * @param {object} image the path to the image to cut
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
  if (!Number.isInteger(xCropSize)) errorsList.push('Incompatible number of horizontal extracts (width % numberOfExtracts != 0).')
  if (!Number.isInteger(yCropSize)) errorsList.push('Incompatible number of vertical extracts (height % numberOfExtracts != 0).')
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
  const nearestQuality = req.query.nearestQuality === 'true'

  let errorList = []

  // Check the scene name is valid
  try {
    checkSceneName(sceneName)
  }
  catch (err) {
    errorList.push(err.message)
  }

  // Check `imageQuality` is an integer or `min`, `max` or `median`
  const qualityInt = parseInt(imageQuality, 10)
  let quality = null
  if (['min', 'median', 'max'].some(x => x === imageQuality)) {
    if (nearestQuality)
      errorList.push('Impossible to use "min", "max" or "median" with "nearestQuality" on.')
    else quality = imageQuality
  }
  else if (!isNaN(qualityInt))
    quality = qualityInt
  else
    errorList.push('The specified quality is not an integer or "min", "max" or "median".')

  // Check `horizontalExtractCount` is an integer
  const horizontalExtractCountInt = parseInt(horizontalExtractCount, 10)
  if (isNaN(horizontalExtractCountInt)) errorList.push('The specified number of extract for the horizontal axis is not an integer.')

  // Check `verticalExtractCountInt` is an integer
  const verticalExtractCountInt = parseInt(verticalExtractCount, 10)
  if (isNaN(verticalExtractCountInt)) errorList.push('The specified number of extract for the vertical axis is not an integer.')


  // Check there is no errors with parameters
  if (errorList.length > 0)
    throw boom.badRequest('Invalid query parameter(s).', errorList)

  // Get the image path and link
  const image = await getImage(sceneName, quality, nearestQuality)

  // Cut the image
  const extracts = await cutImage(image, horizontalExtractCountInt, verticalExtractCountInt)

  image.path = undefined

  // Send an array of links
  res.json({
    data: {
      extracts: extracts.map(x => x.link),
      info: image
    }
  })
}))

export default router
