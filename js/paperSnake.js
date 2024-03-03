import imageSettings from "../settings.json" assert { type: 'json' };
import { keyPressed, keyReleased, onMouseDown, onMouseMove } from "./UserInteraction.js";
import { Raster } from "./Raster.js";
import { createSheetHelpers, createSheets } from "./Platten.js";
import { importProject, projectName, setProjectName } from "./ProjectManager.js";

export var cursor;
export function changeCursor(newRadius) { cursor.radius = newRadius; }
export var image;
export const realSheetLength = 1861, // [mm]
    realSheetWidth = 591, // [mm]
    realGridSize = 55, // Mindestabstand zu Rand und zwischen Pfaden [mm]
    pxPerMM = 0.29;
export var raster = new Raster(pxPerMM);
export var imageArea;

// Only executed our code once the DOM is ready.
window.onload = function () {

    // Get a reference to the canvas object
    var canvas = document.getElementById('snakeCanvas');

    // Create an empty project and a view for the canvas:
    paper.setup(canvas);
    const imageDimensions = loadImage(imageSettings.imageName);

    const urlInput = new URLSearchParams(window.location.search).get('project');
    if (urlInput) {
        setProjectName(`./Projects/${urlInput}`);
        // setProjectName(urlInput);
        console.log("loading project from URL");
        importProject(`${projectName}/save.json`);
    }
    else {
        console.log(projectName);
        raster.initialize();
        // platten erstellen:
        createSheets(
            realSheetLength * pxPerMM,
            realSheetWidth * pxPerMM,
            image.height, image.width
        );
        createSheetHelpers(
            realSheetLength * pxPerMM,
            realSheetWidth * pxPerMM,
            image.height, image.width
        );
    }


    // region of interest:
    imageArea = new paper.Path.Rectangle({
        point: new paper.Point(0, 0),
        size: new paper.Size(imageDimensions[0], imageDimensions[1]),
    })

    // mouse cursor:
    cursor = new paper.Path.Circle({
        center: new paper.Point(0, 0),
        radius: raster.gridGapX / 2,
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