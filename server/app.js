const express = require('express')
const path = require('path')
const app = express()
const port = 3000

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express!' })
})

app.use(express.static(path.join(__dirname, '../client/dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'))
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

