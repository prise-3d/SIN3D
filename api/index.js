'use strict'

import express from 'express'
import routes from './routes'

import { errorHandler } from './functions'
import { apiConfig } from '../config'

const app = express()

app.listen(apiConfig.port, () => {
  console.log('The server was started on http://localhost:' + apiConfig.port)
})

// Load all the routes in the server
app.use(apiConfig.routePrefix, routes)

// Error handler (Middleware called when throwing in another middleware)
app.use(errorHandler)
