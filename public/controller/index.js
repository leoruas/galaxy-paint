var socket = io();
var nScreens; //number of screens
const canvas = document.getElementById('canvas')
const body = document.getElementById('body')

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
    canvas.style = 'border: 1px solid black'
    const canvasH = window.innerHeight * 0.6
    const canvasW = canvasH * 9 / 16
    canvas.width = canvasW * nScreens
    canvas.height = canvasH

    const ctx = canvas.getContext('2d');

    var radius = 5;
        var start = 0;
        var end = Math.PI * 2;
        var dragging = false;

        ctx.lineWidth = radius * 2;

        function putPoint(e) {
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

        body.addEventListener('mousedown', engage);
        body.addEventListener('mousemove', putPoint);
        body.addEventListener('mouseup', disengage);
}