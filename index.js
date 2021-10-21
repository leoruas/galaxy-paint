//Server configuration
const express = require('express')
const app = express()
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const PORT = 3000

//Get arguments when running server
var myArgs = process.argv.slice(2);
var nScreens = Number(myArgs[0]);

//Set default number of screens to 3
if (myArgs.length == 0 || isNaN(nScreens)) {
  console.log("Number of screens invalid or not informed, default number is 3.")
  nScreens = 3;
}
console.log(`Running Galaxy Paint for Liquid Galaxy with ${nScreens} screens!`);

//Server routes and static files
app.use(express.static('public'));

app.get('/:id', (req, res) => {
  if (req.params.id === "controller") {
    res.sendFile(__dirname + '/public/controller/controller.html')
  } else if (!isNaN(req.params.id)) {
    res.sendFile(__dirname + '/public/index.html')
  }

})

//Socket configuration/event listeners
io.on('connect', (socket) => {
  console.log(`User connected with id: ${socket.id}`)

  //emit number of screens to new screen
  socket.emit('newScreen', { nScreens })

  /**
 * On redraw method -> responsible for emitting points to be drawn to all clients
 * @param {Object} payload object variable containing the points to bew drawn arrays
 */
  function onRedraw(payload) {
    io.emit('redraw', payload)
  }
  socket.on('redraw', onRedraw)
})

//Server listener
http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
