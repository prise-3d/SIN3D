'use strict'

import express from 'express'
import routes from './routes'

import { apiConfig } from '../config'

const app = express()

app.listen(apiConfig.port, () => {
  console.log('The server was started on http://localhost:' + apiConfig.port)
})

app.use(apiConfig.routePrefix, routes)
