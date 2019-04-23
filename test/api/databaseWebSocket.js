'use strict'

import test from 'ava'
import WebSocket from 'ws'
import request from 'supertest'
import { json, getTestServer } from './_test_functions'
import DataController from '../../server/database/controllers/Data'

// Database testing

// Before all tests, connect to the database
test.beforeEach(t => getTestServer(t, { database: true, webSocket: true }))

test('Check database is working', async t => {
  await request(t.context.server)

  const testData = { test_database: 'add', test_database_obj: { msg: 'Hello world' } }
  const doc = await DataController.add(testData)
  t.deepEqual(doc.data, testData, json(doc))

  const findDoc = await DataController.find(doc.id)
  t.deepEqual(findDoc.data, testData, json(findDoc))

  testData.test_database = 'updated'
  const updateTo = { newObject: 'test', newProperties: { test: true } }
  const docUpdated = await DataController.update(doc.id, updateTo)
  t.deepEqual(docUpdated.data, updateTo, json(docUpdated))

  t.notThrowsAsync(await DataController.del(doc.id))
})
