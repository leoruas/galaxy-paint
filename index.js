const express = require('express')
const app = express()
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const PORT = 3000

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile('index.html')
})

app.get('/controller', (req, res) => {
  res.sendFile(__dirname + '/public/controller/controller.html')
})

io.on('connect', (socket) => {
  console.log(`User connected with id: ${socket.id}`)
})

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
