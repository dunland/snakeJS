import imageSettings from "../settings.json" assert { type: 'json' };
import { keyPressed, keyReleased, onMouseDown, onMouseMove } from "./UserInteraction.js";
import { Raster } from "./Raster.js";
import { createSheets } from "./Platten.js";

export var cursor;
export function changeCursor(newRadius) { cursor.radius = newRadius; }
export var image;
export var raster = new Raster(15, 2.41);
const sheetLength = 186.1,
    sheetWidth = 59.1; // cm
export var platten;

// Only executed our code once the DOM is ready.
window.onload = function () {

    // Get a reference to the canvas object
    var canvas = document.getElementById('snakeCanvas');
    // Create an empty project and a view for the canvas:

    const imageDimensions = loadImage(imageSettings.imageName);

    paper.setup(canvas);

    raster.initialize();
    // Gitterpunkte erstellen:
    raster.createPoints(Math.min(canvas.clientWidth, imageDimensions[0]), Math.min(canvas.clientHeight, imageDimensions[1]));
        
    // platten erstellen:
    platten = createSheets(image.height, image.width, sheetLength, sheetWidth);

    // mouse cursor:
    cursor = new paper.Path.Circle({
        center: new paper.Point(0, 0),
        radius: raster.rasterMass / 2,
        strokeColor: 'white'
    });

    var cursorTool = new paper.Tool();
    cursorTool.onMouseMove = onMouseMove;

    addEventListener("mousedown", onMouseDown);
    addEventListener("keydown", keyPressed);
    addEventListener("keyup", keyReleased);

    // Draw the view now:
    paper.view.draw();
}

function loadImage(imageName) {

    image = new Image();
    image.src = "../" + imageName;
    console.log(`Loaded image ${imageName} with dimensions`, image.width, image.height);

    // set canvas background image:
    const canvasElement = document.getElementById('snakeCanvas');
    canvasElement.style.backgroundImage = `url(${imageName})`;

    // TODO: set canvas size:
    // canvasElement.width = image.width + 'px';
    // canvasElement.height = image.height + "px";
    console.log("canvas dimensions:", canvasElement.clientWidth, canvasElement.offsetHeight)

    return [image.width, image.height];
}