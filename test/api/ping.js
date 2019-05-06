'use strict'

import test from 'ava'
import request from 'supertest'
import { apiPrefix } from '../../config'
import { json, getHttpServer } from './_test_functions'

// ROUTE /ping

// Before each tests, start a server
test.beforeEach(async t => (t.context.server = await getHttpServer()))

test('GET /ping', async t => {
  const res = await request(t.context.server)
    .get(`${apiPrefix}/ping`)

  t.is(res.status, 200, json(res))
  t.is(res.text, 'pong')
})
