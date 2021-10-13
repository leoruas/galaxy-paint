const express = require('express')
const app = express()
const PORT = 3000

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile('index.html')
})

app.get('/controller', (req, res) => {
  res.sendFile(__dirname + '/public/controller/controller.html')
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
