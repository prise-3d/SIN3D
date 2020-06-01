'use strict'

import { CronJob } from 'cron'

import server from './server'
import { setup as cleanExtracts, extractsRemoverServiceLogger } from './cleanExtracts'
import { setup as expeStats, expeStatsServiceLogger } from './expeStats'
import { imagesPath, deleteExtractsCronTime, expeStatsCronTime } from './config'

const argv = process.argv.slice(2)

new CronJob(expeStatsCronTime, () => expeStats(true), null, true, null, null, false)
expeStatsServiceLogger.info('Started the expe stats service.')

// Start the extracts remover service
if (!argv.includes('--no-delete')) { /* eslint no-new: 0 */
  new CronJob(deleteExtractsCronTime, () => cleanExtracts(imagesPath, false, true), null, true, null, null, false)
  extractsRemoverServiceLogger.info('Started the extracts remover service.')
}

// Start the server
server()
