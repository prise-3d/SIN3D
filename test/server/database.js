'use strict'

import test from 'ava'
import { json, getHttpServer, connectDb } from '../utils/_test_functions'
import DataController from '../../server/database/controllers/Data'

// Database and WebSocket testing

// Before all tests, connect to the database
test.beforeEach(async t => (t.context.server = await getHttpServer()))

test('Check database is working', async t => {
  // Connect to database
  await connectDb()

  // Add the document
  const testData = { AUTOMATED_TEST_DB: true, TEST_DATABASE_OBJ: { msg: 'add' } }
  const doc = await DataController.add(testData)
  t.deepEqual(doc.data, testData, json(doc))

  // Find the document
  const findDoc = await DataController.find(doc.id)
  t.deepEqual(findDoc.data, testData, json(findDoc))

  // Update the document
  testData.TEST_DATABASE_OBJ.msg = 'updated'
  const updateTo = { AUTOMATED_TEST_DB: true, newObject: 'test', newProperties: { test: true } }
  const docUpdated = await DataController.update(doc.id, updateTo)
  t.deepEqual(docUpdated.data, updateTo, json(docUpdated))

  // Delete the added document
  await t.notThrowsAsync(DataController.del(doc.id))
})
