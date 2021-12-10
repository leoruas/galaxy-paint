var socket = io();
const canvas = document.getElementById('canvas') //canvas reference
const ctx = canvas.getContext('2d')
var nScreens;
var screenNumber = Number(location.pathname.slice(1))

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
    const { clickX, clickY, clickDrag, brushOptions } = payload

    ctx.lineJoin = "round";
    ctx.lineWidth = 5;

    const width = canvas.width * nScreens
    const height = canvas.height

    const isRightScreen = screenNumber <= (Math.ceil(nScreens / 2));
    const screenOffsetIndex = isRightScreen ? screenNumber - 1 : ((nScreens + 1) - screenNumber) * -1; //offset index based on screenNumber
    const baseOffset = Math.floor(nScreens / 2) * window.innerWidth //base offset (same for all screens) calculated with total number of screens
    const screenOffset = screenOffsetIndex * window.innerWidth + baseOffset

    for (var i = 0; i < clickX.length; i++) {
        ctx.lineWidth = brushOptions[i].width
        ctx.strokeStyle = brushOptions[i].color;
        const prevX = clickX[i - 1] * width - screenOffset //previous x
        const prevY = clickY[i - 1] * height // previous y

        const x = clickX[i] * width - screenOffset //curent x
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