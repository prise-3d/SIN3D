'use strict'

import test from 'ava'
import request from 'supertest'
import { apiPrefix } from '../../../config'
import { json, getHttpServer } from '../../utils/_test_functions'

// ROUTE /experimentCollect

// Before each tests, start a server
test.beforeEach(async t => (t.context.server = await getHttpServer()))

test('POST /experimentCollect - No body', async t => {
  const res = await request(t.context.server)
    .post(`${apiPrefix}/experimentCollect`)

  t.is(res.status, 400, json(res))
  t.true(res.body.message.includes('Missing parameter'), json(res.body))
  t.true(res.body.message.includes('msgId'), json(res.body))
  t.true(res.body.message.includes('msg'), json(res.body))
})

test('POST /experimentCollect - Invalid body parameters', async t => {
  const res = await request(t.context.server)
    .post(`${apiPrefix}/experimentCollect`)
    .send({ msgId: { notAstring: 'not a string' }, msg: 'Valid data' })

  t.is(res.status, 400, json(res))
  t.true(res.body.message.includes('Invalid body parameter'), json(res.body))
  t.truthy(res.body.data.find(x => x.includes('"msgId" must be a string.')), json(res.body))
})

test('POST /experimentCollect - Valid body parameters', async t => {
  const res = await request(t.context.server)
    .post(`${apiPrefix}/experimentCollect`)
    .send({ msgId: 'TEST_FEATURE', msg: { some: 'data' } })

  t.is(res.status, 204)
})
