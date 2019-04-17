'use strict'

const fs = require('fs-extra')
const path = require('path')

const setup = async () => {
  console.log('Tests ran successfully. Running post-tests script...')

  const testDir = path.resolve(__dirname, '..')
  const imagesDir = path.resolve(testDir, 'images')

  console.log('Removing /test/images directory...')
  await fs.remove(imagesDir)

  console.log('Post-tests script finished.')
}

setup()
