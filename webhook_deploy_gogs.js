/**
 * A server that listens on a port for Gogs's webhooks.
 * It will check for a push event on the master branch, then deploy the project on the machine.
 * The webhook's secret is check to ensure no malicious request from unknown sources.
 *
 * Usage :
 * Set the "WEBHOOK_SECRET" environment variable with the webhook's secret.
 *
 * @see https://gogs.io/docs/features/webhook
 *
 *
 * @author Antoine Sauvage <contact@asauvage.fr>
 * @license MIT 2019 - https://opensource.org/licenses/MIT
 * @see https://gist.github.com/rigwild/4238a13cb3501c6e85065b403a71b475
 */

'use strict'

const fs = require('fs')
const http = require('http')
const path = require('path')
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)

// The port which this script will listen on
const port = 12345

// The path to the project directory
const projectPath = path.resolve('.')

// The webhook secret to check the origin of the webhook event
// Check the "WEBHOOK_SECRET" environment variable is set
if (!process.env.WEBHOOK_SECRET && process.env.WEBHOOK_SECRET !== '') {
  console.error(`${new Date().toLocaleString()} - The "WEBHOOK_SECRET" environment variable is not set.`)
  process.exit(1)
}
const webhookSecret = process.env.WEBHOOK_SECRET

// Check whether the project path exists and script has read access
console.log(`${new Date().toLocaleString()} - Configured project path : ${projectPath}\n`)
try {
  fs.accessSync(projectPath, fs.constants.W_OK)
  console.log(`${new Date().toLocaleString()} - The project's directory exists and script has write permission.`)
}
catch (err) {
  console.error(`${new Date().toLocaleString()} - The project's directory does not exist or script has not write permission.`, err)
  process.exit(1)
}


// Check the "PORT" environment variable is set to a valid integer
if (!process.env.PORT || !parseInt(process.env.PORT, 10)) {
  console.error(`${new Date().toLocaleString()} - The "PORT" environment variable is not set or is not an integer.`)
  process.exit(1)
}

// Check the "SERVE_CLIENT" environment variable is set to 'true' or 'false'
if (!process.env.SERVE_CLIENT || !['true', 'false'].some(x => x === process.env.SERVE_CLIENT)) {
  console.error(`${new Date().toLocaleString()} - The "SERVE_CLIENT" environment variable is not set or is not 'true' or 'false'`)
  process.exit(1)
}

const env = {
  PORT: parseInt(process.env.PORT, 10),
  SERVE_CLIENT: process.env.SERVE_CLIENT,
  IMAGES_PATH: process.env.IMAGES_PATH
}
// Recap used environment variables
Object.keys(env).forEach(x => console.log(`${x}=${env[x]}`))

// The script that will be executed by the machine
const deployScript = `cd ${projectPath}` +
  ' && git reset --hard HEAD' +
  ' && git pull origin master' +
  ' && docker-compose down' +
  ' && docker-compose build' +
  ' && docker-compose up -d'

console.log('\nConfiguration is valid. Starting the webhook-listener server ...')

const deploy = async () => {
  try {
    console.log(`${new Date().toLocaleString()} - Deploying project ...`)
    const startTime = process.hrtime()
    const { stdout, stderr } = await exec(
      deployScript,
      {
        cwd: projectPath,
        env
      }
    )
    const endTime = process.hrtime(startTime)

    // Logs received from the deploy script are sent in stdout :
    // git fetch and docker-compose build/up are writing their success logs in stderr...
    // A deploy fail will be printed in stderr (in the catch)
    console.log('stdout :\n', stdout)
    console.log('stderr :\n', stderr)
    console.log(`\n${new Date().toLocaleString()} - Project successfully deployed with Docker.`)
    console.log(`Total deploy time : ${endTime[0]}s and ${endTime[1] / 1000000}ms.`)
  }
  catch (err) {
    console.error(`\n${new Date().toLocaleString()} - Error deploying project.\n`, err)
  }
}

// Configuration is fine, start the server
http.createServer((req, res) => {
  // Check the method is POST
  if (req.method !== 'POST') {
    res.statusCode = 400
    res.write('Wrong HTTP method.')
    res.end()
    return
  }

  // Check the event is a push
  if (req.headers['x-gogs-event'] !== 'push') {
    res.statusCode = 200
    res.write('OK. Not a push event.')
    res.end()
    return
  }

  // Answer OK and close the connection
  res.statusCode = 200
  res.write('OK')
  res.end()

  let body = []
  req.on('data', chunk => body.push(chunk))
  req.on('end', () => {
    try {
      body = JSON.parse(Buffer.concat(body).toString())
      // Check if the event was on master
      if (!body.ref || body.ref !== 'refs/heads/master') return

      // Check if secret matches
      if (!body.secret || body.secret !== webhookSecret) return

      console.log(`${new Date()} - Valid webhook event. Push on master was sent. Deployement process starts.`)
      deploy()
    }
    catch (err) {
      console.error(`${new Date()} - Invalid JSON was received`)
    }
  })
}).listen(port)
console.log(`${new Date().toLocaleString()} - Server is listening on http://localhost:${port}/`)
