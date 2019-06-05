'use strict'

const fs = require('fs-extra')
const path = require('path')

const setup = async () => {
  console.log('Running pre-tests script...')

  const testDir = path.resolve(__dirname, '..')
  const imagesTestDir = path.resolve(testDir, 'images_test')
  const imagesDir = path.resolve(testDir, 'images')

  console.log('Removing /test/images directory...')
  await fs.remove(imagesDir)

  console.log('Copying /test/images_test directory to /test/images...')
  await fs.copy(imagesTestDir, imagesDir)

  console.log('Pre-tests script finished. Running tests...')
}

setup()
