'use strict'

import mongoose from 'mongoose'
import { mongoDatabaseURI, dbLogger } from '../../config'
import { formatLog, formatError } from '../functions'

const connectDb = async () => {
  await mongoose.connect(mongoDatabaseURI, { useNewUrlParser: true })
  mongoose.connection.on('error', err => dbLogger.error(formatError(err)))

  dbLogger.info(formatLog('The database connection was established.'))
}

export default connectDb
