'use strict'

import path from 'path'

const PRODUCTION_MODE = process.env.NODE_ENV === 'production'

const apiConfig = {
  routePrefix: '/api',
  port: PRODUCTION_MODE ? 5000 : 5000,
  imagesPath: path.resolve(__dirname, 'images')
}

export { PRODUCTION_MODE, apiConfig }
