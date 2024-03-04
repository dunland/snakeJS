import { keyPressed, keyReleased, onMouseDown, onMouseMove } from "./UserInteraction.js";
import { Raster } from "./Raster.js";
import { createSheetHelpers, createSheets } from "./Platten.js";
import { importProject, projectPath, setProjectPath } from "./ProjectManager.js";

export var cursor;
export function changeCursor(newRadius) { cursor.radius = newRadius; }
export var imageFile = "../beispielbild.jpeg", image;
export var realSheetLength = 1861; // [mm]
export var realSheetWidth = 591; // [mm]
export var realGridSize = 55; // Mindestabstand zu Rand und zwischen Pfaden [mm]
export var pxPerMM = 0.29;
export function importSheetLength(newVar) { realSheetLength = newVar; }
export function importSheetWidth(newVar) { realSheetWidth = newVar; }
export function importGridSize(newVar) { realGridSize = newVar; }
export function importImageFile(newVar) { imageFile = `../${projectPath}/${newVar}`; }
export var raster = new Raster(pxPerMM);
export var imageArea;

// Only executed our code once the DOM is ready.
window.onload = function () {

    // Get a reference to the canvas object
    var canvas = document.getElementById('snakeCanvas');

    // Create an empty project and a view for the canvas:
    paper.setup(canvas);
    loadImage();
    console.log(image);

    const urlInput = new URLSearchParams(window.location.search).get('project');
    if (urlInput) {
        setProjectPath(`Projects/${urlInput}`);
        // setProjectName(urlInput);
        console.log("loading project from URL");

        importProject(`${projectPath}/project.json`);
    }
    else { // emptyProject
        console.log("creating new project");

        realSheetLength = 1861; // [mm]
        realSheetWidth = 591; // [mm]
        realGridSize = 55; // Mindestabstand zu Rand und zwischen Pfaden [mm]
        pxPerMM = 0.29;

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
        size: new paper.Size(image.width, image.height),
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

export function loadImage() {

    image = new Image();
    image.src = imageFile;
    console.log(`Loaded image ${imageFile} with dimensions`, image.width, image.height);

    // set canvas background image:
    const canvasElement = document.getElementById('snakeCanvas');
    canvasElement.style.backgroundImage = `url(${imageFile})`;

    // TODO: set canvas size:
    // canvasElement.width = image.width + 'px';
    // canvasElement.height = image.height + "px";
    console.log("canvas dimensions:", canvasElement.clientWidth, canvasElement.offsetHeight)
}