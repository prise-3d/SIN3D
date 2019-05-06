'use strict'

import test from 'ava'
import WebSocket from 'ws'
import { json, getHttpServer, getWebSocketServer, connectDb } from './_test_functions'
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

test('Check WebSocket server is working', async t => {
  // Connect to database
  await connectDb()

  // Start the server and get its ephemeral port
  const server = t.context.server.listen(0)
  const { port } = server.address()

  // Start the WebSocket server
  getWebSocketServer(server)

  t.timeout(15000)
  t.plan(11)

  // Start the WebSocket client
  const ws = new WebSocket(`ws://localhost:${port}`)
  await new Promise((resolve, reject) => {
    let sent = 0
    let received = 0
    ws.on('open', async () => {
      // Send data on connect
      ws.send(JSON.stringify({ AUTOMATED_TEST_WS: true, TEST_OBJECT: { msg: 'open' } }))
      t.pass()
      sent++
    })
    ws.on('message', async receivedData => {
      received++
      if (sent === 1) {
        // Send data on receive
        t.is('{"message":"ok"}', receivedData, json(receivedData))
        ws.send(JSON.stringify({ AUTOMATED_TEST_WS: true, TEST_OBJECT: { msg: 'message' } }))
        t.pass()
        sent++
      }
      else if (sent === 2) {
        // Send invalid JSON data
        t.is('{"message":"ok"}', receivedData, json(receivedData))
        ws.send('Not a valid JSON string')
        t.pass()
        sent++
      }
      else if (sent === 3) {
        // Received error from server, check it is valid JSON
        let obj = null
        t.notThrows(() => {
          try {
            obj = JSON.parse(receivedData)
          }
          catch (err) {
            throw new Error('Not valid JSON')
          }
        })
        t.truthy(obj, json(receivedData))
        t.is(obj.log.error, 'Invalid JSON data.', json(obj))
        t.truthy(obj.log.stack, json(obj))
        t.is(sent, received)
        resolve()
      }
    })
    ws.on('error', async err => {
      // Unknown WebSocket error
      t.fail(json(err.message))
      reject(err)
    })
  })

  // Delete every collected data during test
  const db = DataController.Model
  const found = await db.deleteMany({ 'data.AUTOMATED_TEST_WS': true })
  t.true(found.deletedCount >= 2)
})
