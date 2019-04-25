'use strict'

import test from 'ava'
import request from 'supertest'
import { apiPrefix } from '../../config'
import { json, getHttpServer } from './_test_functions'

// ROUTE /listSceneQualities

// Before each tests, start a server
test.beforeEach(async t => (t.context.server = await getHttpServer()))

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

  t.is(res.status, 400, json(res))
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
