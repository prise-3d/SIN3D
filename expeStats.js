'use strict'

// import { experiments } from './experimentConfig'
const config = require('./experimentConfig')
const mongoose = require('mongoose')
const configApp = require('./config')
const mongoDatabaseURI = configApp.mongoDatabaseURI
const fs = require('fs-extra')

const winston = require('winston')
const execSync = require('child_process').execSync

// const connectDb = async () => {
//   await mongoose.connect(mongoDatabaseURI, { useNewUrlParser: true, useFindAndModify: false })
//   mongoose.connection.on('error', (err) => console.log(err))
// }

// get whitelist scene for MatchExtractsWithReference experiment
const scenes = config.experiments.MatchExtractsWithReference.availableScenes.whitelist

// File logger configuration
const fileLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/expeStats.log' }),
    new winston.transports.File({ filename: 'logs/expeStats.error.log', level: 'error' }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      format: winston.format.json()
    })
  ],
  exitOnError: false
})

const setup = async (logToFile = false) => {
  // await connectDb()

  if (logToFile) fileLogger.info({ log: 'Start extraction of data from mongo for `MatchExtractsExperiments`.', date: new Date() })

  execSync('python utils/extract_experiment.py', { encoding: 'utf-8' })
  if (logToFile) fileLogger.info({ log: 'Mongo extraction done', date: new Date() })
  execSync('python utils/extract_stats_freq_and_min_all.py --file results/experiments_results.json --output results/match_extracts_stats.csv', { encoding: 'utf-8' })
  if (logToFile) fileLogger.info({ log: 'Stats computation done, need to create probability for each scene', date: new Date() })

  // read extracted stats in order to compute probabilities
  let statsPath = 'results/match_extracts_stats.csv'
  let buffer = fs.readFileSync(statsPath)
  let lines = buffer.toString().split('\n')

  let stats = {}
  let nUsers = 0

  for (let l of lines) {
    if (l.length > 0) {
      // extract data from csv file
      let data = l.split(';')

      // data[0] contains scene name
      // data[1] contains number of users who do this scene
      let u = Number(data[1])
      stats[String(data[0])] = u
      nUsers += u
    }
  }

  // start computing probabilities
  let probabilities = {}
  let probsArr = []
  let nUnknownScenes = 0

  // based on white list
  for (let s of scenes) {
    if (s in stats) {
      probabilities[s] = stats[s] / nUsers

      probsArr.push(probabilities[s])
    }
    else {
      nUnknownScenes += 1
    }
  }

  // normalize probabilities
  let currentMax = Math.max(...probsArr)

  for (let s of scenes) {
    // if new scene
    if (!(s in stats)) {
      // multiply prob criteria based on number of unknown scene
      // => increase chance for user to pass this scene
      probabilities[s] = (1 + (1 - (nUnknownScenes / scenes.length))) * currentMax
      probsArr.push(probabilities[s])
    }
  }

  // get sum of current probs
  let sum = probsArr.reduce((a, b) => a + b, 0)

  for (let s of scenes) {
    probabilities[s] /= sum
  }

  if (logToFile) fileLogger.info({ log: 'New probabilities extracted:' + JSON.stringify(probabilities, null, 3), date: new Date() })

  fs.writeFile('results/match_extracts_probs.json', JSON.stringify(probabilities, null, 3))
}

// Execute setup command
setup()

module.exports = { setup, expeStatsServiceLogger: fileLogger }
