'use strict'

import mongoose from 'mongoose'
import { mongoDatabaseURI, dbLogger, TEST_MODE } from '../../config'
import { formatLog, formatError } from '../functions'

const connectDb = async () => {
  await mongoose.connect(mongoDatabaseURI, { useNewUrlParser: true, useFindAndModify: false })
  mongoose.connection.on('error', err => dbLogger.error(formatError(err)))

  if (!TEST_MODE) dbLogger.info(formatLog('The database connection was established.'))
}

export default connectDb
