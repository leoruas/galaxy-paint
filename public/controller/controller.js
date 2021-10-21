var socket = io();
var nScreens; //number of screens
const canvas = document.getElementById('canvas') //canvas reference
const ctx = canvas.getContext('2d')
const screenBreakpoints = []; //array with breakpoints based on canvas width and number of screens

//mouse position arrays
var clickX = [];
var clickY = [];
var clickDrag = [];
var paint;

/**
 * On new screen method -> responsible for setting variables for screen on connection and calling init function
 * @param {Object} payload object variable containing the necessary information
 */
function onNewScreen(payload) {
    nScreens = payload.nScreens

    init()
}
socket.on('newScreen', onNewScreen)

/**
 * Init method -> responsible for setting up the canvas and adding events for drawing
 */
function init() {
    //canvas setup
    canvas.style = 'border: 1px solid black'
    const canvasH = window.innerHeight * 0.6 //canvas height calculation
    const screenW = canvasH * 9 / 16 //screen width calculation

    canvas.width = screenW * nScreens
    canvas.height = canvasH

    for (let i = 0; i <= nScreens; i++) screenBreakpoints.push(i * screenW)

    //Setting canvas event listeners
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseup);
    canvas.addEventListener('mouseleave', onMouseleave);
}

/**
 * On mouse down method -> responsible for adding mouse positions on array when mouse down in canvas
 * @param {Object} e MouseEvent object containing mouse position info
 */
function onMouseDown(e) {
    paint = true;
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    redraw();
}

/**
 * On mouse move method -> responsible for adding mouse positions on array when mouse moves in canvas
 * @param {Object} e MouseEvent object containing mouse position info
 */
function onMouseMove(e) {
    if (paint) {
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        redraw();
    }
}

/**
 * On mouse up method -> responsible for setting paint flag as false when mouse button up on canvas
 */
function onMouseup() {
    paint = false
}

/**
 * On mouse up method -> responsible for setting paint flag as false when mouse leaves canvas
 */
function onMouseleave() {
    paint = false
}

/**
 * On mouse move method -> responsible for adding mouse positions on array when mouse moves in canvas
 * @param {Number} x mouse X position
 * @param {Number} y mouse Y position
 * @param {Boolean} dragging flag that indicates if user is dragging
 */
function addClick(x, y, dragging) {
    console.log('add', x, y, dragging)
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
}

/**
 * Redraw method -> responsible for drawing points in canvas based on the arrays with positions
 */
function redraw() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clears the canvas

    ctx.strokeStyle = "black";
    ctx.lineJoin = "round";
    ctx.lineWidth = 5;

    const auxClickX = []
    const auxClickY = []
    for (var i = 0; i < clickX.length; i++) {
        auxClickX.push(clickX[i] / canvas.width)
        auxClickY.push(clickY[i] / canvas.height)

        ctx.beginPath();
        if (clickDrag[i] && i) {
            ctx.moveTo(clickX[i - 1], clickY[i - 1]);
        } else {
            ctx.moveTo(clickX[i] - 1, clickY[i]);
        }
        ctx.lineTo(clickX[i], clickY[i]);
        ctx.closePath();
        ctx.stroke();
    }

    socket.emit('redraw', { clickX: auxClickX, clickY: auxClickY, clickDrag })
}