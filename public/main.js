var socket = io();
const canvas = document.getElementById('canvas') //canvas reference
const ctx = canvas.getContext('2d')
var nScreens;

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

    for (var i = 0; i < clickX.length; i++) {
        ctx.beginPath();
        if (clickDrag[i] && i) {
            ctx.moveTo(clickX[i - 1] * canvas.width, clickY[i - 1] * canvas.height);
        } else {
            ctx.moveTo((clickX[i] * canvas.width) - 1, clickY[i] * canvas.height);
        }
        ctx.lineTo(clickX[i] * canvas.width, clickY[i] * canvas.height);
        ctx.closePath();
        ctx.stroke();
    }
}

socket.on('redraw', onRedraw)