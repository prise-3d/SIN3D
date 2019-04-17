import test from 'ava'
import request from 'supertest'
import fs from 'fs-extra'
import path from 'path'
import express from 'express'
import serveStatic from 'serve-static'
import { apiPrefix, imageServedUrl, imagesPath } from '../../config'
import routes from '../../server/routes'

// Path to `test` directory
const testDir = path.resolve(__dirname, '..', '..', 'test')

// Pretty-print a JSON object
const json = obj => 'JSON DATA : ' + (JSON.stringify(obj, null, 2) || obj)

/**
 * Uses supertest to open an Express server on an ephemeral port.
 * The server serves images in `test/images`, all api routes and
 * uses a custom error handler (no logging to stdout).
 *
 * Using `request` (supertest) on this object will start the server
 *
 * @returns {object} an Express server
 */
const serve = () => {
  const app = express()
  app.use(imageServedUrl, serveStatic(imagesPath))
  app.use(apiPrefix, routes)
  app.use((err, req, res, next) => {
    res.status(err.output.payload.statusCode).json({
      message: err.message || err.output.payload.message,
      data: err.data || undefined
    })
  })
  return app
}

// Before starting all the tests, copy `test/images_test` to `test/images`
test.before(async t => {
  await fs.copy(path.resolve(testDir, 'images_test'), path.resolve(testDir, 'images'))
})

// Before each tests, start a server
test.beforeEach(async t => {
  t.context.server = serve()
})

// After finishing all the tests, remove `test/images`
test.after.always(async t => {
  await fs.remove(path.resolve(testDir, 'images'))
})


// ROUTE /listScenes
test('GET /listScenes', async t => {
  const res = await request(t.context.server)
    .get(`${apiPrefix}/listScenes`)

  t.is(res.status, 200, json(res))
  t.deepEqual(res.body.data, ['bathroom', 'contemporary'], json(res.body))
})


// ROUTE /listSceneQualities
test('GET /listSceneQualities', async t => {
  const res = await request(t.context.server)
    .get(`${apiPrefix}/listSceneQualities`)

  t.is(res.status, 400, json(res))
  t.true(res.body.message.includes('Missing parameter'), json(res.body))
  t.true(res.body.message.includes('sceneName'), json(res.body))
})

test('GET /listSceneQualities?sceneName=invalid/../scene', async t => {
  const res = await request(t.context.server)
    .get(`${apiPrefix}/listSceneQualities?sceneName=invalid/../scene`)

  t.is(res.status, 409, json(res))
  t.truthy(res.body.message.match(/The requested scene name.*is not valid/), json(res.body))
})

test('GET /listSceneQualities?sceneName=unknown-scene-name', async t => {
  const res = await request(t.context.server)
    .get(`${apiPrefix}/listSceneQualities?sceneName=unknown-scene-name`)

  t.is(res.status, 500, json(res))
  t.truthy(res.body.message.match(/Can't access.*scene dir.*Check it exist.*and you have read permission/), json(res.body))
})

test('GET /listSceneQualities?sceneName=bathroom', async t => {
  const res = await request(t.context.server)
    .get(`${apiPrefix}/listSceneQualities?sceneName=bathroom`)

  t.is(res.status, 200, json(res))
  t.true(Array.isArray(res.body.data) && res.body.data.every(x => Number.isInteger(x)), json(res.body))
})


// ROUTE /getImage
test('GET /getImage', async t => {
  const res = await request(t.context.server)
    .get(`${apiPrefix}/getImage`)

  t.is(res.status, 400, json(res))
  t.true(res.body.message.includes('Missing parameter'), json(res.body))
  t.true(res.body.message.includes('sceneName'), json(res.body))
  t.true(res.body.message.includes('imageQuality'), json(res.body))
})

test('GET /getImage?sceneName=invalid/../scene&imageQuality=aaaa', async t => {
  const res = await request(t.context.server)
    .get(`${apiPrefix}/getImage?sceneName=invalid/../scene&imageQuality=aaaa`)

  t.is(res.status, 400, json(res))
  t.true(res.body.message.includes('Invalid query parameter'), json(res.body))
  t.truthy(res.body.data.find(x => x.match(/The requested scene name.*is not valid/)), json(res.body))
  t.truthy(res.body.data.find(x => x.includes('The specified quality is not an integer')), json(res.body))
})

test('GET /getImage?sceneName=unknown-scene-name&imageQuality=10', async t => {
  const res = await request(t.context.server)
    .get(`${apiPrefix}/getImage?sceneName=unknown-scene-name&imageQuality=10`)

  t.is(res.status, 500, json(res))
  t.truthy(res.body.message.match(/Can't access.*scene dir.*Check it exist.*and you have read permission/), json(res.body))
})

test('GET /getImage?sceneName=bathroom&imageQuality=999999', async t => {
  const res = await request(t.context.server)
    .get(`${apiPrefix}/getImage?sceneName=bathroom&imageQuality=999999`)

  t.is(res.status, 404, json(res))
  t.truthy(res.body.message.match(/requested quality.*not found for.*scene/), json(res.body))
})

test('GET /getImage?sceneName=bathroom&imageQuality=10', async t => {
  const res = await request(t.context.server)
    .get(`${apiPrefix}/getImage?sceneName=bathroom&imageQuality=10`)

  t.is(res.status, 200, json(res))
  t.is(res.body.data, `${imageServedUrl}/bathroom/bathroom_00010.png`, json(res.body))

  // Check link is accessible and is an image
  const res2 = await request(t.context.server)
    .get(`${imageServedUrl}/bathroom/bathroom_00010.png`)

  t.is(res2.status, 200, json(res2))
  t.is(res2.header['content-type'], 'image/png', json(res2))
})


// ROUTE /getImageExtracts
test('GET /getImageExtracts', async t => {
  const res = await request(t.context.server)
    .get(`${apiPrefix}/getImageExtracts`)

  t.is(res.status, 400, json(res))
  t.true(res.body.message.includes('Missing parameter'), json(res.body))
  t.true(res.body.message.includes('sceneName'), json(res.body))
  t.true(res.body.message.includes('imageQuality'), json(res.body))
  t.true(res.body.message.includes('horizontalExtractCount'), json(res.body))
  t.true(res.body.message.includes('verticalExtractCount'), json(res.body))
})

test('GET /getImageExtracts?sceneName=/../&imageQuality=a&horizontalExtractCount=a&verticalExtractCount=a', async t => {
  const res = await request(t.context.server)
    .get(`${apiPrefix}/getImageExtracts?sceneName=/../&imageQuality=a&horizontalExtractCount=a&verticalExtractCount=a`)

  t.is(res.status, 400, json(res))
  t.true(res.body.message.includes('Invalid query parameter'), json(res.body))
  t.truthy(res.body.data.find(x => x.match(/The requested scene name.*is not valid/)), json(res.body))
  t.truthy(res.body.data.find(x => x.includes('The specified quality is not an integer')), json(res.body))
  t.truthy(res.body.data.find(x => x.includes('horizontal axis is not an integer')), json(res.body))
  t.truthy(res.body.data.find(x => x.includes('vertical axis is not an integer')), json(res.body))
})

test('GET /getImageExtracts?sceneName=unknown-scene-name&imageQuality=10&horizontalExtractCount=5&verticalExtractCount=2', async t => {
  const res = await request(t.context.server)
    .get(`${apiPrefix}/getImageExtracts?sceneName=unknown-scene-name&imageQuality=10&horizontalExtractCount=5&verticalExtractCount=2`)

  t.is(res.status, 500, json(res))
  t.truthy(res.body.message.match(/Can't access.*scene dir.*Check it exist.*and you have read permission/), json(res.body))
})

test('GET /getImageExtracts?sceneName=bathroom&imageQuality=99999&horizontalExtractCount=5&verticalExtractCount=2', async t => {
  const res = await request(t.context.server)
    .get(`${apiPrefix}/getImageExtracts?sceneName=bathroom&imageQuality=99999&horizontalExtractCount=5&verticalExtractCount=2`)

  t.is(res.status, 404, json(res))
  t.truthy(res.body.message.match(/requested quality.*not found for.*scene/), json(res.body))
})

test('GET /getImageExtracts?sceneName=bathroom&imageQuality=10&horizontalExtractCount=0&verticalExtractCount=9999', async t => {
  const res = await request(t.context.server)
    .get(`${apiPrefix}/getImageExtracts?sceneName=bathroom&imageQuality=10&horizontalExtractCount=0&verticalExtractCount=9999`)

  t.is(res.status, 400, json(res))
  t.true(res.body.message.includes('Invalid query parameter'), json(res.body))
  t.truthy(res.body.data.find(x => x.includes('Incompatible number of horizontal extracts')), json(res.body))
  t.truthy(res.body.data.find(x => x.includes('Incompatible number of vertical extracts')), json(res.body))
})

test('GET /getImageExtracts?sceneName=bathroom&imageQuality=10&horizontalExtractCount=5&verticalExtractCount=2', async t => {
  const res = await request(t.context.server)
    .get(`${apiPrefix}/getImageExtracts?sceneName=bathroom&imageQuality=10&horizontalExtractCount=5&verticalExtractCount=2`)

  t.is(res.status, 200, json(res))
  t.true(Array.isArray(res.body.data), json(res.body))
  t.is(res.body.data[0], `${imageServedUrl}/bathroom/extracts/x5_y2/zone00001/bathroom_zone00001_10.png`, json(res.body))

  // Check link is accessible and is an image
  const res2 = await request(t.context.server)
    .get(`${imageServedUrl}/bathroom/extracts/x5_y2/zone00001/bathroom_zone00001_10.png`)

  t.is(res2.status, 200, json(res2))
  t.is(res2.header['content-type'], 'image/png', json(res2))

  // Check the extract on the file system
  const extracts = path.resolve(imagesPath, 'bathroom', 'extracts')
  const aBathroomConfig = path.resolve(extracts, 'bathroom', 'x5_y2')
  const aBathroomConfigZone = path.resolve(extracts, 'bathroom', 'x5_y2', 'zone00001')
  const aBathroomConfigZoneImg = path.resolve(extracts, 'bathroom', 'x5_y2', 'zone00001', 'bathroom_zone00001_10.png')
  const fsp = fs.promises
  // Check `bathroom/extracts`
  t.true(await fs.pathExists(extracts))
  t.is(await fsp.readdir(extracts), ['x5_y2'])

  // Check `bathroom/extracts/x5_y2`
  t.true(await fs.pathExists(aBathroomConfig))
  t.is((await fsp.readdir(extracts)).length, 10)

  // Check `bathroom/extracts/x5_y2/zone00001`
  t.true(await fs.pathExists(aBathroomConfigZone))
  t.is((await fsp.readdir(aBathroomConfigZone)).length, 1)

  // Check `bathroom/extracts/x5_y2/zone00001/bathroom_zone00001_10.png`
  t.true(await fs.pathExists(aBathroomConfigZoneImg))
})
