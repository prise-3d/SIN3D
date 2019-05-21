'use strict'

import test from 'ava'
import request from 'supertest'
import { apiPrefix } from '../../config'
import { json, getHttpServer } from './_test_functions'

// ROUTE /dataCollect

// Before each tests, start a server
test.beforeEach(async t => (t.context.server = await getHttpServer()))

test('POST /dataCollect - No body', async t => {
  const res = await request(t.context.server)
    .post(`${apiPrefix}/dataCollect`)

  t.is(res.status, 400, json(res))
  t.true(res.body.message.includes('Missing parameter'), json(res.body))
  t.true(res.body.message.includes('uuid'), json(res.body))
  t.true(res.body.message.includes('screen'), json(res.body))
})

test('POST /dataCollect - Invalid body parameters', async t => {
  const res = await request(t.context.server)
    .post(`${apiPrefix}/dataCollect`)
    .send({ uuid: 42, screen: 'not an object' })

  t.is(res.status, 400, json(res))
  t.true(res.body.message.includes('Invalid body parameter'), json(res.body))
  t.truthy(res.body.data.find(x => x.includes('"uuid" must be a string.')), json(res.body))
  t.truthy(res.body.data.find(x => x.includes('"screen" must be a valid object.')), json(res.body))
})

test('POST /dataCollect - Valid body parameters', async t => {
  const res = await request(t.context.server)
    .post(`${apiPrefix}/dataCollect`)
    .send({ uuid: 'test', screen: { width: 1920, height: 1080 } })

  t.is(res.status, 200, json(res))
  t.is(res.body.message, 'OK', json(res.body))
})
