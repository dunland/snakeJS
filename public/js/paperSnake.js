import { keyPressed, keyReleased, onMouseDown, onMouseMove } from "./UserInteraction.js";
import { changeDrawMode } from "./Modes.js";
import { Raster } from "./Raster.js";
import { sheetHelpers, sheetsGroup } from "./Platten.js";
import { importProject, initializeNewProject, projectPath, setProjectPath } from "./ProjectManager.js";

export var cursorCircle, cursorLine;
export function changeCursor(newRadius) { cursorCircle.radius = newRadius; }
export var imageFile = "../beispielbild.jpeg", image;
const pxPerMM = 0.29;
export function setImageFile(newVar) { imageFile = newVar; } // TODO: loadImage() must be called manually after changing this
export var raster = new Raster(pxPerMM);
export var globalColor = "#555555";

// console.stdlog = console.log.bind(console);
// console.logs = [];
// console.log = function(){
//     console.logs.push(Array.from(arguments));
//     console.stdlog.apply(console, arguments);
// }

// Only executed our code once the DOM is ready.
window.onload = function () {

    // Check if we are running in Google Chrome
    if (!window.chrome) {
        alert("Achtung! This app works best in Google Chrome!");
    }

    // Get a reference to the canvas object
    var canvas = document.getElementById('snakeCanvas');

    // Create an empty project and a view for the canvas:
    paper.setup(canvas);

    // mouse cursor:
    cursorCircle = new paper.Path.Circle({
        center: new paper.Point(0, 0),
        radius: raster.gridGapX / 2,
        strokeColor: globalColor
    });

    var cursorTool = new paper.Tool();
    cursorTool.onMouseMove = onMouseMove;

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

    addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", keyPressed);
    addEventListener("keyup", keyReleased);

    changeDrawMode("ROI");

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

    // TODO: image is bigger than canvas:
    // if (canvasElement.clientWidth < image.width){
    //     let w = canvasElement.clientWidth;
    //     let h = canvasElement.clientHeight;
    //     let r = w/h;
    //     canvasElement.style.backgroundSize = `${w}px ${h*r}px`;
    // }
    // else if (canvasElement.clientHeight < image.height){
    //     let w = canvasElement.clientWidth;
    //     let h = canvasElement.clientHeight;
    //     let r = w/h;
    //     canvasElement.style.backgroundSize = `${w/r}px ${h}px`;
    // }
    // else {
    //     // TODO: set canvas size:
    //     canvasElement.width = image.width;
    //     canvasElement.height = image.height;
    // }


    // region of interest:
    // let w = Math.min(image.width, canvasElement.clientWidth);
    // let h = Math.min(image.height, canvasElement.clientHeight);
    // raster.roi = new paper.Path.Rectangle({
    //     point: new paper.Point(0, 0),
    //     size: new paper.Size(w, h),
    //     strokeColor: 'blue' // ATTENTION: Do not set color here! Else it will be present whenever moving entire view
    // })

    console.log("canvas dimensions:", canvasElement.clientWidth, canvasElement.offsetHeight)
}

export function updateGlobalColors(newColor) {

    globalColor = newColor;

    // update colors:
    raster.line.strokeColor = newColor;
    sheetsGroup.strokeColor = newColor;
    cursorCircle.strokeColor = newColor;
    for (let i = 0; i < sheetHelpers.length; i++) {
        sheetHelpers[i].gridDots.fillColor = newColor;
        sheetHelpers[i].label.strokeColor = newColor;
    }
    console.log(`colors updated to ${globalColor}`);
}