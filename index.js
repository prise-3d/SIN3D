'use strict'

import { CronJob } from 'cron'

import server from './server'
import cleanExtracts from './cleanExtracts'
import { imagesPath, deleteExtractsCronTime } from './config'

const argv = process.argv.slice(2)

// Start the extracts remover service
if (!argv.includes('--no-delete')) { /* eslint no-new: 0 */
  new CronJob(deleteExtractsCronTime, () => cleanExtracts(imagesPath, false, true), null, true, null, null, false)
  console.log('Started the extracts remover service.')
}

// Start the server
server()
