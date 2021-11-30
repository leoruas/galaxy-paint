var socket = io();
var nScreens; //number of screens
const canvas = document.getElementById('canvas') //canvas reference
const ctx = canvas.getContext('2d')
const screenBreakpoints = []; //array with breakpoints based on canvas width and number of screens

//mouse position arrays
var clickX;
var clickY;
var clickDrag;
var paint;

//brush variables
var brushColor = 'black';
var brushWidth = 5;
var brushOptions;

/**
 * On new screen method -> responsible for setting variables for screen on connection and calling init function
 * @param {Object} payload object variable containing the necessary information
 */
function onNewScreen(payload) {
    nScreens = payload.nScreens
    clickX = payload.clickX
    clickY = payload.clickY
    clickDrag = payload.clickDrag
    brushOptions = payload.brushOptions

    init()
}
socket.on('newScreen', onNewScreen)

/**
 * On new screen method -> responsible for setting variables for screen on connection and calling init function
 * @param {Object} payload object variable containing the necessary information
 */
function onAddClick(payload) {
    if (payload.id !== socket.id) {
        clickX = payload.clickX
        clickY = payload.clickY
        clickDrag = payload.clickDrag
        brushOptions = payload.brushOptions

        redraw()
    }
}
socket.on('addClick', onAddClick)

/**
 * Init method -> responsible for setting up the canvas and adding events for drawing
 */
function init() {
    //canvas setup
    canvas.style = 'border: 1px solid black'
    canvas.width = window.innerWidth * 0.8
    canvas.height = window.innerHeight * 0.6


    //Setting canvas event listeners
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseup);
    canvas.addEventListener('mouseleave', onMouseleave);

    canvas.addEventListener('touchstart', onTouchStart);
    canvas.addEventListener('touchmove', onTouchMove);
    canvas.addEventListener('touchend', onMouseup);

    redraw()
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
 * On touch start method -> responsible for adding mouse positions on array when touch action starts in canvas
 * @param {Object} e MouseEvent object containing mouse position info
 */
function onTouchStart(e) {
    console.log(e)
    paint = true;
    addClick(e.touches[0].clientX - this.offsetLeft, e.touches[0].clientY - this.offsetTop);
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
 * On touch move method -> responsible for adding mouse positions on array when touch moves in canvas
 * @param {Object} e MouseEvent object containing mouse position info
 */
 function onTouchMove(e) {
    if (paint) {
        addClick(e.touches[0].clientX - this.offsetLeft, e.touches[0].clientY - this.offsetTop, true);
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
    brushOptions.push({
        color: brushColor,
        width: brushWidth
    })
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);

    socket.emit('addClick', { x, y, dragging, brushColor, brushWidth })
}

/**
 * Redraw method -> responsible for drawing points in canvas based on the arrays with positions
 */
function redraw() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clears the canvas

    ctx.lineJoin = "round";

    const auxClickX = []
    const auxClickY = []
    for (var i = 0; i < clickX.length; i++) {
        ctx.lineWidth = brushOptions[i].width
        ctx.strokeStyle = brushOptions[i].color;
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

    drawBorders()

    socket.emit('redraw', { clickX: auxClickX, clickY: auxClickY, clickDrag, brushOptions })
}

function drawBorders() {
    const width = canvas.width

    for (let i = 1; i < nScreens; i++) {
        ctx.fillRect(i * (width / nScreens), 0, 1, canvas.height)
    }
}

function setColor(color) {
    brushColor = color
}

function setWidth(width) {
    brushWidth = width
}