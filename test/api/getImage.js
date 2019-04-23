'use strict'

import test from 'ava'
import request from 'supertest'
import { apiPrefix, imageServedUrl } from '../../config'
import { json, getTestServer } from './_test_functions'

// ROUTE /getImage

// Before each tests, start a server
test.beforeEach(getTestServer)

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
