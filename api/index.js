'use strict'

import path from 'path'
import express from 'express'
import compression from 'compression'
import serveStatic from 'serve-static'
import helmet from 'helmet'

import routes from './routes'
import { errorHandler } from './functions'
import { apiPrefix, serverPort, serveClient, imagesPath } from '../config'

const app = express()

// Use gzip compression to improve performance
app.use(compression())

// Enhance the app security by setting some HTTP headers
app.use(helmet())


if (serveClient) {
  // Serve client files (Client is local)
  app.use('/', express.static(path.resolve(__dirname, '../dist')))
}
else {
  // Don't serve client files (Client is remote)
  // Turn "Cross-origin resource sharing" on to allow the remote client to connect to the API
  import('cors').then(({ default: cors }) => app.use(cors()))
}

// Serve images. "serve-static" is used because it caches images ("express.static" doesn't)
app.use(serveStatic(imagesPath))


// Load all the API routes in the server
app.use(apiPrefix, routes)

// Error handler (Middleware called when throwing in another middleware)
app.use(errorHandler)

// Start the server on the configured port
app.listen(serverPort, () => console.log('The server was started on http://localhost:' + serverPort))
