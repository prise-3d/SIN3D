'use strict'

const fs = require('fs-extra')
const fsp = fs.promises

const winston = require('winston')

// File logger configuration
const fileLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/extractsRemoverService.log' }),
    new winston.transports.File({ filename: 'logs/extractsRemoverService.error.log', level: 'error' }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      format: winston.format.json()
    })
  ],
  exitOnError: false
})

const { resolve: r } = require('path')

const setup = async (imagesPath, shouldLog = false, logToFile = false) => {
  try {
    if (!(await fs.pathExists(imagesPath)))
      throw new Error(`Could not locate the image directory. Images path: ${imagesPath}`)

    // Get a list of all scenes
    const scenes = await fsp.readdir(r(imagesPath))

    for (const aScene of scenes) {
      const extractsPath = r(imagesPath, aScene, 'extracts')

      // Check the "extracts" dir exists
      if (!(await fs.pathExists(extractsPath))) {
        if (shouldLog) process.stdout.write(`"${aScene}/extracts" does not exist.\n`)
        continue
      }
      if (shouldLog) process.stdout.write(`Deleting "${aScene}/extracts"...`)
      await fs.remove(extractsPath)
      if (shouldLog) process.stdout.write(' done.\n')
    }

    if (logToFile) fileLogger.info({ log: 'The extracts remover service finished successfully.', date: new Date() })
  }
  catch (err) {
    if (shouldLog) console.error(err)
    if (logToFile) fileLogger.error({ log: { error: err.message, stack: err.stack }, date: new Date() })
  }
}

// Execute if param is set
const argv = process.argv.slice(2)
if (argv.includes('--execute')) {
  if (!process.env.IMAGES_PATH)
    return console.log('You must pass the "IMAGES_PATH" environment variable')

  setup(process.env.IMAGES_PATH, false, true)
}

module.exports = setup
