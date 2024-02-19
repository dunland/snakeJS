import imageSettings from "../settings.json" assert { type: 'json' };
import { keyPressed, keyReleased, onMouseDown, onMouseMove } from "./UserInteraction.js";
import { Raster } from "./Raster.js";

export var cursor;
export var image;
export var raster = new Raster();
export var plattenMass = 65; // cm
export var platten;

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

    // platten erstellen:
    platten = new paper.Group();
    var size = 0;
    for (var y = 0; y < image.height; y += plattenMass)
        for (var x = 0; x < image.width; x += plattenMass * 2) {
            platten.addChild(new paper.Path.Rectangle({
                point: new paper.Point(x, y),
                size: new paper.Size(plattenMass * 2, plattenMass),
                strokeColor: 'red',
                strokeWidth: 2
            }));
            if (y % 2 == 0)
                platten.lastChild.position.x -= plattenMass / 2;
            size += (platten.lastChild.bounds.size.width * platten.lastChild.bounds.size.width)
        }
    platten.strokeColor = 'grey';

    // Gitterpunkte erstellen:
    raster.createPoints(Math.min(canvas.clientWidth, imageDimensions[0]), Math.min(canvas.clientHeight, imageDimensions[1]));

    for (var x = 0; x < raster.gitterpunkte.length; x++) {
        const pt = new paper.Point(raster.gitterpunkte[x].x, raster.gitterpunkte[x].y);

        raster.gridDots[x] = new paper.Path.Circle({
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