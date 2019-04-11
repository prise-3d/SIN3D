'use strict'

import path from 'path'
import winston from 'winston'

export const PRODUCTION_MODE = process.env.NODE_ENV === 'production'

// The url prefix for the API
export const apiPrefix = '/api'

// The port used by the server
export const serverPort = parseInt(process.env.PORT, 10) || 5000

// The directory where the images are stored (do not edit it)
export const imagesPath = path.resolve(__dirname, 'images')

// Should the server serve client files from the `/dist` directory
export const serveClient = process.env.SERVE_CLIENT === 'true'

// Logger configuration
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      format: winston.format.simple()
    })
  ],
  exitOnError: false
})
