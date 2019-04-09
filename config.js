'use strict'

import path from 'path'

export const PRODUCTION_MODE = process.env.NODE_ENV === 'production'

// The url prefix for the API
export const apiPrefix = '/api'

// The port used by the server
export const serverPort = 5000

// The directory where the images are stored
export const imagesPath = path.resolve(__dirname, 'images')

// Should the server serve client files from the `/dist` directory
export const serveClient = true
