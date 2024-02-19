import imageSettings from "../settings.json" assert { type: 'json' };
import { Liniensegment } from "./Liniensegmente.js";
import { keyPressed, onMouseDown, onMouseMove } from "./UserInteraction.js";
import { Raster } from "./Raster.js";

export var cursor;
export var image;
export var raster = new Raster();

// Only executed our code once the DOM is ready.
window.onload = function () {

    // Get a reference to the canvas object
    var canvas = document.getElementById('snakeCanvas');
    // Create an empty project and a view for the canvas:

    const imageDimensions = loadImage(imageSettings.imageName);

    paper.setup(canvas);
    raster.line = new paper.CompoundPath();
    raster.line.strokeColor = 'white';
    raster.line.strokeWidth = 2;

    raster.area = new paper.Path();
    raster.area.fillColor = new paper.Color(1, 0, 0, 0.45);
    raster.area.closed = true;
    
    // Gitterpunkte erstellen:
    raster.createPoints(Math.min(canvas.clientWidth, imageDimensions[0]), Math.min(canvas.clientHeight, imageDimensions[1]));
    
    for (var i = 0; i < raster.gitterpunkte.length; i++) {
        const pt = new paper.Point(raster.gitterpunkte[i].x, raster.gitterpunkte[i].y);
        
        raster.gridDots[i] = new paper.Path.Circle({
            center: pt,
            radius: 1,
            fillColor: 'white',
            visible: false
        });
    }
    
    // mouse cursor:
    cursor = new paper.Path.Circle({
        center: new paper.Point(0, 0),
        radius: raster.rasterMass / 2,
        strokeColor: 'white'
    });
    
    // addEventListener("mousemove", mouseMoved);
    var cursorTool = new paper.Tool();
    cursorTool.onMouseMove = onMouseMove;

    addEventListener("mousedown", onMouseDown);
    addEventListener("keydown", keyPressed);

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
