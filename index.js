const express = require('express')
const app = express()
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const PORT = 3000

var myArgs = process.argv.slice(2);
var nScreens = Number(myArgs[0]);

if (myArgs.length == 0 || isNaN(nScreens)) {
  console.log("Number of screens invalid or not informed, default number is 3.")
  nScreens = 3;
}
console.log(`Running Galaxy Paint for Liquid Galaxy with ${nScreens} screens!`);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile('index.html')
})

app.get('/controller', (req, res) => {
  res.sendFile(__dirname + '/public/controller/controller.html')
})

io.on('connect', (socket) => {
  console.log(`User connected with id: ${socket.id}`)

  socket.emit('newScreen', { nScreens }) //emit number of screens to new screen
})

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
