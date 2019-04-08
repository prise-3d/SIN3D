import express from 'express'

const app = express()
const port = 8080

app.listen(port, () => {
  console.log('The server was started on http://localhost:' + port)
})

app.get('/', (req, res) => {
  res.send('it works')
})
