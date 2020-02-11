'use strict'

import test from 'ava'
import request from 'supertest'
import sharp from 'sharp'
import fs from 'fs-extra'
import path from 'path'
import { apiPrefix, imageServedUrl, imagesPath } from '../../../config'
import { json, getHttpServer } from '../../utils/_test_functions'

// ROUTE /getImageExtracts

// Before each tests, start a server
test.beforeEach(async t => (t.context.server = await getHttpServer()))

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

test('GET /getImageExtracts?sceneName=bathroom&horizontalExtractCount=5&verticalExtractCount=2&imageQuality=max&nearestQuality=true', async t => {
  const res = await request(t.context.server)
    .get(`${apiPrefix}/getImageExtracts?sceneName=bathroom&horizontalExtractCount=5&verticalExtractCount=2&imageQuality=max&nearestQuality=true`)

  t.is(res.status, 400, json(res))
  t.true(res.body.message.includes('Invalid query parameter'), json(res.body))
  t.truthy(res.body.data.find(x => x.match(/Impossible to use.*min.*max.*median.*with.*nearestQuality/)), json(res.body))
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

test('GET /getImageExtracts?sceneName=bathroom&imageQuality=min&horizontalExtractCount=5&verticalExtractCount=2', async t => {
  const res = await request(t.context.server)
    .get(`${apiPrefix}/getImageExtracts?sceneName=bathroom&imageQuality=min&horizontalExtractCount=5&verticalExtractCount=2`)

  t.is(res.status, 200, json(res))
  t.true(Array.isArray(res.body.data.extracts), json(res.body))
  t.is(res.body.data.extracts[0], `${imageServedUrl}/bathroom/extracts/x5_y2/zone00001/bathroom_zone00001_00010.png`, json(res.body))
})

test('GET /getImageExtracts?sceneName=bathroom&imageQuality=median&horizontalExtractCount=5&verticalExtractCount=2', async t => {
  const res = await request(t.context.server)
    .get(`${apiPrefix}/getImageExtracts?sceneName=bathroom&imageQuality=median&horizontalExtractCount=5&verticalExtractCount=2`)

  t.is(res.status, 200, json(res))
  t.true(Array.isArray(res.body.data.extracts), json(res.body))
  t.is(res.body.data.extracts[0], `${imageServedUrl}/bathroom/extracts/x5_y2/zone00001/bathroom_zone00001_00010.png`, json(res.body))
})

test('GET /getImageExtracts?sceneName=bathroom&imageQuality=max&horizontalExtractCount=5&verticalExtractCount=2', async t => {
  const res = await request(t.context.server)
    .get(`${apiPrefix}/getImageExtracts?sceneName=bathroom&imageQuality=max&horizontalExtractCount=5&verticalExtractCount=2`)

  t.is(res.status, 200, json(res))
  t.true(Array.isArray(res.body.data.extracts), json(res.body))
  t.is(res.body.data.extracts[0], `${imageServedUrl}/bathroom/extracts/x5_y2/zone00001/bathroom_zone00001_00010.png`, json(res.body))
})

test('GET /getImageExtracts?sceneName=bathroom&imageQuality=99999&horizontalExtractCount=5&verticalExtractCount=2&nearestQuality=true', async t => {
  const res = await request(t.context.server)
    .get(`${apiPrefix}/getImageExtracts?sceneName=bathroom&imageQuality=99999&horizontalExtractCount=5&verticalExtractCount=2&nearestQuality=true`)

  t.is(res.status, 200, json(res))
  t.is(res.body.data.extracts[0], `${imageServedUrl}/bathroom/extracts/x5_y2/zone00001/bathroom_zone00001_00010.png`, json(res.body))
})

test.serial('GET /getImageExtracts?sceneName=bathroom&imageQuality=10&horizontalExtractCount=5&verticalExtractCount=2', async t => {
  const res = await request(t.context.server)
    .get(`${apiPrefix}/getImageExtracts?sceneName=bathroom&imageQuality=10&horizontalExtractCount=5&verticalExtractCount=2`)

  t.is(res.status, 200, json(res))
  t.true(Array.isArray(res.body.data.extracts), json(res.body))
  t.is(res.body.data.extracts[0], `${imageServedUrl}/bathroom/extracts/x5_y2/zone00001/bathroom_zone00001_00010.png`, json(res.body))
  t.deepEqual(res.body.data.info, {
    extractsConfig: {
      x: 5,
      y: 2
    },
    extractsSize: {
      width: 160,
      height: 400
    },
    image: {
      link: `${imageServedUrl}/bathroom/bathroom_00010.png`,
      fileName: 'bathroom_00010.png',
      sceneName: 'bathroom',
      quality: 10,
      ext: 'png',
      metadata: {
        format: 'png',
        width: 800,
        height: 800,
        space: 'srgb',
        channels: 3,
        depth: 'uchar',
        density: 72,
        isProgressive: false,
        paletteBitDepth: 8,
        hasProfile: false,
        hasAlpha: false
      }
    }
  }, json(res.body))

  // Check link is accessible and is an image
  const res2 = await request(t.context.server)
    .get(`${imageServedUrl}/bathroom/extracts/x5_y2/zone00001/bathroom_zone00001_00010.png`)

  t.is(res2.status, 200, json(res2))
  t.is(res2.header['content-type'], 'image/png', json(res2))
})

test.serial('Check extracts were successfully generated', async t => {
  // Check the extract on the file system
  const extracts = path.resolve(imagesPath, 'bathroom', 'extracts')
  const aBathroomConfig = path.resolve(extracts, 'x5_y2')
  const aBathroomConfigZone = path.resolve(aBathroomConfig, 'zone00001')
  const aBathroomConfigZoneImg = path.resolve(aBathroomConfigZone, 'bathroom_zone00001_00010.png')
  const fsp = fs.promises
  // Check `bathroom/extracts`
  t.true(await fs.pathExists(extracts))
  t.deepEqual(await fsp.readdir(extracts), ['x5_y2'])

  // Check `bathroom/extracts/x5_y2`
  t.true(await fs.pathExists(aBathroomConfig), aBathroomConfig)
  t.is((await fsp.readdir(aBathroomConfig)).length, 10)

  // Check `bathroom/extracts/x5_y2/zone00001`
  t.true(await fs.pathExists(aBathroomConfigZone))
  t.is((await fsp.readdir(aBathroomConfigZone)).length, 1)

  // Check `bathroom/extracts/x5_y2/zone00001/bathroom_zone00001_00010.png`
  t.true(await fs.pathExists(aBathroomConfigZoneImg))

  // Check image's type, width and height
  const metadata = await sharp(aBathroomConfigZoneImg).metadata()
  t.is(metadata.width, 160, json(metadata))
  t.is(metadata.height, 400, json(metadata))
  t.is(metadata.format, 'png', json(metadata))
})
