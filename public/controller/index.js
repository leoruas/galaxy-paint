var socket = io();
var nScreens; //number of screens

/**
 * On new screen method -> responsible for setting variables for screen on connection and calling init function
 * @param {Object} payload object variable containing the necessary information
 */
function onNewScreen(payload) {
    nScreens = payload.nScreens
    console.log('nscre', nScreens)

    init()
}
socket.on('newScreen', onNewScreen)

function init() {
    const screensContainer = document.getElementById('screensContainer')

    const canvas = document.createElement('canvas')
    canvas.style = 'border: 1px solid black'
    const canvasW = (window.innerWidth * 0.9) / nScreens
    const canvasH = canvasW * 16 / 9
    canvas.width = canvasW * nScreens
    canvas.height = canvasH

    for (let index = 0; index < nScreens; index++) {
        canvas.id = `screen${index}`
        screensContainer.appendChild(canvas.cloneNode())
    }

}