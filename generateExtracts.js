'use strict'
/* eslint-disable no-global-assign */
/* eslint-disable no-native-reassign */

require = require('esm')(module) // ES Module loader
const fs = require('fs-extra')
const yargs = require('yargs')
const path = require('path')

const { getImage } = require('./server/routes/getImage')
const { cutImage } = require('./server/routes/getImageExtracts')

/**
 * @typedef {Object} CliObject
 * @property {String} sceneName Input scene. Must be in the `./images` directory
 * @property {String} [outputDir] Directory where to output extracts. Defaults to the extracts directory
 * @property {String} [extractConfigX=4] Horizontal extracting configuration. Defaults to 4
 * @property {String} [extractConfigY=4] Vertical extracting configuration. Defaults to 4
 * @property {String} $0 The script name or node command
 */
/**
 * @constant
 * @type {CliObject}
 */
const cli = yargs
  .usage('Cut a scene using provided configuration.')
  .usage('Usage: node generateExtracts.js --sceneName=<sceneName> --quality=<quality> [--extractConfigX=<extractConfigX=4>] [--extractConfigY=<extractConfigY=4>] [--outputDir=<outputDir>]')
  .example('node generateExtracts.js --sceneName=cuisine01 --quality=150 --extractConfigX=4 --extractConfigY=5 --outputDir=extracts')
  .option('sceneName', {
    demandOption: true,
    describe: 'Input scene. Must be in the `./images` directory',
    type: 'string'
  })
  .option('quality', {
    demandOption: true,
    describe: 'Scene quality to choose.',
    type: Number
  })
  .option('extractConfigX', {
    demandOption: false,
    describe: 'Horizontal extracting configuration. Defaults to 4.',
    type: Number,
    default: 4
  })
  .option('extractConfigY', {
    demandOption: false,
    describe: 'Vertical extracting configuration. Defaults to 4.',
    type: Number,
    default: 4
  })
  .option('outputDir', {
    demandOption: false,
    describe: 'Directory where to output extracts. Defaults to the extracts directory.',
    type: 'string'
  })
  .help('h')
  .alias('h', 'help')
  .wrap(yargs.terminalWidth())
  .argv


const setup = async () => {
  const { sceneName, quality, extractConfigX, extractConfigY, outputDir } = cli
  console.log(sceneName, quality, extractConfigX, extractConfigY, outputDir)
  // Get the image path and link
  const image = await getImage(sceneName, quality)

  // Cut the image
  const extracts = await cutImage(image, extractConfigX, extractConfigY)
  console.log(extracts)

  // Move extracts images if outputDir is specified
  if (outputDir)
    await Promise.all(extracts.map(x => fs.move(x.path, path.resolve(outputDir, path.basename(x.path)))))
}
setup()
