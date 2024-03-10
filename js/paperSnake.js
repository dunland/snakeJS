import { keyPressed, keyReleased, onMouseDown, onMouseMove } from "./UserInteraction.js";
import { Raster } from "./Raster.js";
import { createSheetHelpers, createSheets, sheetHelpers, sheetsGroup } from "./Platten.js";
import { importProject, initializeNewProject, projectPath, setProjectPath } from "./ProjectManager.js";

export var cursor;
export function changeCursor(newRadius) { cursor.radius = newRadius; }
export var imageFile = "../beispielbild.jpeg", image;
const pxPerMM = 0.29;
export function importImageFile(newVar) { imageFile = newVar; }
export var raster = new Raster(pxPerMM);
export var globalColor = "white";

// Only executed our code once the DOM is ready.
window.onload = function () {

    // Get a reference to the canvas object
    var canvas = document.getElementById('snakeCanvas');

    // Create an empty project and a view for the canvas:
    paper.setup(canvas);
    
    const urlInput = new URLSearchParams(window.location.search).get('project');
    if (urlInput) {
        setProjectPath(`Projects/${urlInput}`);
        importProject(`${projectPath}/project.json`);
    }
    else { // emptyProject
        console.log("creating new project");
        if (!image) loadImage();
        initializeNewProject();
    }

    // mouse cursor:
    cursor = new paper.Path.Circle({
        center: new paper.Point(0, 0),
        radius: raster.gridGapX / 2,
        strokeColor: globalColor
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

    // region of interest:
    raster.roi = new paper.Path.Rectangle({
        point: new paper.Point(0, 0),
        size: new paper.Size(image.width, image.height),
        strokeColor: 'blue'
    })

    console.log("canvas dimensions:", canvasElement.clientWidth, canvasElement.offsetHeight)
}

export function updateGlobalColors(newColor) {

    globalColor = newColor;

    // update colors:
    raster.line.strokeColor = newColor;
    sheetsGroup.strokeColor = newColor;
    cursor.strokeColor = newColor;
    for (let i = 0; i < sheetHelpers.length; i++) {
        sheetHelpers[i].gridDots.fillColor = newColor;
        sheetHelpers[i].label.strokeColor = newColor;
    }

}