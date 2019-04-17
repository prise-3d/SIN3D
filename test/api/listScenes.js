'use strict'

import test from 'ava'
import request from 'supertest'
import { apiPrefix } from '../../config'
import { json, beforeEachTests } from './_test_functions'

// ROUTE /listScenes

// Before each tests, start a server
test.beforeEach(beforeEachTests)

test('GET /listScenes', async t => {
  const res = await request(t.context.server)
    .get(`${apiPrefix}/listScenes`)

  t.is(res.status, 200, json(res))
  t.deepEqual(res.body.data, ['bathroom', 'contemporary'], json(res.body))
})
