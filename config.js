'use strict'

import path from 'path'
import winston from 'winston'

export const PRODUCTION_MODE = process.env.NODE_ENV === 'production'
export const TEST_MODE = process.env.NODE_ENV === 'test'

// The url prefix for the API
export const apiPrefix = '/api'

// The url prefix from where the images are served
export const imageServedUrl = apiPrefix + '/images'

// The port used by the server
export const serverPort = parseInt(process.env.PORT, 10) || 5000

// The directory where the images are stored
export const imagesPath = TEST_MODE
  ? path.resolve(__dirname, 'test', 'images') // Used for automated testing, don't touch
  : process.env.IMAGES_PATH || path.resolve(__dirname, 'images')

// Should the server serve client files from the `/dist` directory
export const serveClient = process.env.SERVE_CLIENT === 'true' || true

// File name convention for images
export const fileNameConvention = /^(.*)?_([0-9]{2,})\.(.*)$/

// Name of the directory containing extracts
export const extractsDirName = 'extracts'

// Files to ignore in scenes
export const sceneFileNameBlackList = ['config', 'seuilExpe', extractsDirName]

// Logger configuration
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      format: winston.format.simple()
    })
  ],
  exitOnError: false
})
