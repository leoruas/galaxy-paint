var socket = io();
const canvas = document.getElementById('canvas') //canvas reference
const ctx = canvas.getContext('2d')
var nScreens;
var screenNumber = Number(location.pathname.slice(1))

//brush variables
var start = 0;
var end = Math.PI * 2;

/**
 * On new screen method -> responsible for setting variables for screen on connection and calling init function
 * @param {Object} payload object variable containing the necessary information
 */
function onNewScreen(payload) {
    nScreens = payload.nScreens

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}
socket.on('newScreen', onNewScreen)

/**
 * On redraw method -> responsible for drawing points based on mouse positions arays from server
 * @param {Object} payload object variable containing the points to bew drawn arrays
 */
function onRedraw(payload) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clears the canvas
    const { clickX, clickY, clickDrag } = payload

    ctx.strokeStyle = "black";
    ctx.lineJoin = "round";
    ctx.lineWidth = 5;

    const width = canvas.width * nScreens
    const height = canvas.height
    const offsetX = (screenNumber - 1) * window.innerWidth
    for (var i = 0; i < clickX.length; i++) {
        const prevX = clickX[i - 1] * width - offsetX //previous x
        const prevY = clickY[i - 1] * height // previous y

        const x = clickX[i] * width - offsetX //curent x
        const y = clickY[i] * height //current y

        ctx.beginPath();
        if (clickDrag[i] && i) {
            ctx.moveTo(prevX, prevY);
        } else {
            ctx.moveTo(x - 1, y);
        }
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }
}

socket.on('redraw', onRedraw)