'use strict'

const fs = require('fs-extra')
const path = require('path')

const setup = async () => {
  const testDir = path.resolve(__dirname, '..')
  await fs.remove(path.resolve(testDir, 'images'))
  await fs.copy(path.resolve(testDir, 'images_test'), path.resolve(testDir, 'images'))
}

setup()
