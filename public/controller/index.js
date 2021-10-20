var socket = io();
var nScreens; //number of screens
const canvas = document.getElementById('canvas') //canvas reference
const ctx = canvas.getContext('2d')

/**
 * On new screen method -> responsible for setting variables for screen on connection and calling init function
 * @param {Object} payload object variable containing the necessary information
 */
function onNewScreen(payload) {
    nScreens = payload.nScreens

    init()
}
socket.on('newScreen', onNewScreen)

function init() {
    //canvas setup
    canvas.style = 'border: 1px solid black'
    const canvasH = window.innerHeight * 0.6
    const canvasW = canvasH * 9 / 16
    canvas.width = canvasW * nScreens
    canvas.height = canvasH

    //brush variables
    var radius = 5;
    var start = 0;
    var end = Math.PI * 2;
    var dragging = false;
    ctx.lineWidth = radius * 2;

    function putPoint(e) {
        console.log(e.offsetX)
        if (dragging) {
            ctx.fillStyle = 'black';
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(e.offsetX, e.offsetY, radius, start, end);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        }
    }

    function engage(e) {
        dragging = true;
        putPoint(e);
    }

    function disengage() {
        dragging = false;
        ctx.beginPath();
    }

    canvas.addEventListener('mousedown', engage);
    canvas.addEventListener('mousemove', putPoint);
    canvas.addEventListener('mouseup', disengage);
    canvas.addEventListener('mouseleave', disengage);
}