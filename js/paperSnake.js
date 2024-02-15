import imageSettings from "../settings.json" assert { type: 'json' };
import { Liniensegment } from "./Liniensegmente.js";
import { keyPressed } from "./UserInteraction.js";
import { setRadius } from "./paperUtils.js";
import { Raster } from "./Raster.js";

var cursor, mouseGridX, mouseGridY;
var image;
export var raster = new Raster();
export var gridDots = [];
export var liniensegmente = []; // TODO: use raster.liniensegmente ?

// Only executed our code once the DOM is ready.
window.onload = function () {

    // Get a reference to the canvas object
    var canvas = document.getElementById('snakeCanvas');
    // Create an empty project and a view for the canvas:

    const imageDimensions = loadImage(imageSettings.imageName);

    paper.setup(canvas);
    raster.path = new paper.CompoundPath();
    raster.path.strokeColor = 'red';
    raster.path.strokeWidth = 2;
    
    // Gitterpunkte erstellen:
    raster.createPoints(Math.min(canvas.clientWidth, imageDimensions[0]), Math.min(canvas.clientHeight, imageDimensions[1]));
    
    for (var i = 0; i < raster.gitterpunkte.length; i++) {
        const pt = new paper.Point(raster.gitterpunkte[i].x, raster.gitterpunkte[i].y);
        
        gridDots[i] = new paper.Path.Circle({
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
    cursorTool.onMouseMove = mouseMoved;

    addEventListener("mousedown", mousePressed);
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

function mouseMoved(event) {

    let maxW = image.width;
    let maxH = image.height;

    mouseGridX = clamp(step(event.point.x, raster.rasterMass), raster.rasterMass, Math.min(maxW, window.width) - raster.rasterMass);
    mouseGridY = clamp(step(event.point.y, raster.rasterMass), raster.rasterMass, Math.min(maxH, window.height) - raster.rasterMass);

    cursor.position = [mouseGridX, mouseGridY];
}

function clamp(v, min, max) { return v < min ? min : v > max ? max : v }
function step(v, s) { return Math.round(v / s) * s }

function mousePressed() {

    console.log("click!", mouseGridX, mouseGridY);

    const gpIdx = raster.gitterpunkte.findIndex((el) => (el.x == mouseGridX && el.y == mouseGridY));
    const gp = gridDots[gpIdx];

    if (!gp) return;

    raster.gitterpunkte[gpIdx].active = !raster.gitterpunkte[gpIdx].active;
    let scaling = raster.gitterpunkte[gpIdx].active ? raster.rasterMass / 3 : 1;
    setRadius(gp, scaling);

    if (raster.gitterpunkte[gpIdx].active) {
        raster.activeGridPoints.push(gp);

        // neues Liniensegment:
        if (raster.activeGridPoints.length > 1) {
            var gp_vorher =
                raster.activeGridPoints.at(raster.activeGridPoints.length - 2);
            // raster.liniensegmente.push(
            //     new Liniensegment(gp, gp_vorher, raster, liniensegmente));
            // TODO : gp.linie = zuletzt erstelle Linie
            var ls = new Liniensegment(gp, gp_vorher, raster, liniensegmente);

            raster.path.addChild(liniensegmente[liniensegmente.length - 1]);
            console.log(raster.path);
        }
    } else {
        // entferne Liniensegment:
        liniensegmente[liniensegmente.length - 1].remove();
        raster.gitterpunkte[gpIdx].active = false;
        // raster.activeGridPoints.remove(gp);
        // TODO : alle aktiven gps müssen zugeordnete linie haben → entferne
        // diese linie
    }

    if (raster.scaling_mode_is_on) {
        if (raster.choose_point_index < 1)
            raster.set_scaling_point(mouseX, mouseY);
        else
            raster.set_scaling_point(mouseX, int(raster.scale_line[0].y));
    }
}