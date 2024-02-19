import { globalVerboseLevel } from "./Devtools.js";
import { Liniensegment } from "./Liniensegmente.js";
import { raster, image, cursor } from "./paperSnake.js";
import { setRadius } from "./paperUtils.js";

var mouseGridX, mouseGridY;
export var drawMode = "line"; // draw "line" or "area"
export function changeDrawMode(newMode) { drawMode = newMode; }
// export var MODE = "SETUP"; // can be "RUNNING" or "SETUP"
// function changeMode(newMode) { MODE = newMode; }

// Tastaturbefehle:
export function keyPressed(keyEvent) {
    let key = keyEvent.key;
    console.log(key);
    // exportiere DXF mit Taste 'r':
    if (key == 'R' || key == 'r') {
        changeMode("DXF_EXPORT");
    }
    if (key == 'W' || key == 'w')
        raster.replaceCurve("KURVE_OBEN");
    if (key == 'A' || key == 'a')
        raster.liniensegmente.at(raster.liniensegmente.length - 1).typ = "KURVE_LINKS";
    if (key == 'S' || key == 's')
        raster.replaceCurve("KURVE_UNTEN");
    if (key == 'D' || key == 'd')
        raster.liniensegmente.at(raster.liniensegmente.length - 1).typ = "KURVE_RECHTS";
    if (key == 'Q' || key == 'q')
        raster.replaceCurve("KURVE_OBENLINKS_" + raster.gridPointHistory[raster.gridPointHistory.length - 1].direction);
    if (key == 'E' || key == 'e')
        raster.replaceCurve("KURVE_OBENRECHTS_" + raster.gridPointHistory[raster.gridPointHistory.length - 1].direction);
    if (key == 'Y' || key == 'y')
        raster.replaceCurve("KURVE_UNTENLINKS_" + raster.gridPointHistory[raster.gridPointHistory.length - 1].direction);
    if (key == 'X' || key == 'x')
        raster.replaceCurve("KURVE_UNTENRECHTS_" + raster.gridPointHistory[raster.gridPointHistory.length - 1].direction);
    if (key == ' ') {
        if (raster.liniensegmente[raster.liniensegmente.length - 1].typ == "HORIZONTALE")
            raster.liniensegmente[raster.liniensegmente.length - 1].typ = "VERTIKALE";
        else if (raster.liniensegmente[raster.liniensegmente.length - 1].typ == "VERTIKALE")
            raster.liniensegmente[raster.liniensegmente.length - 1].typ = "HORIZONTALE";
        else
            raster.liniensegmente[raster.liniensegmente.length - 1].typ = "HORIZONTALE";
    }
    if (key == '+' || key == 'ȉ') {
        globalVerboseLevel++;
        console.log("globalVerboseLevel = ", globalVerboseLevel);
    }
    if (key == '-') {
        globalVerboseLevel--;
        console.log("globalVerboseLevel = ", globalVerboseLevel);
    }
    if (key == 'n' || key == 'N') {
        raster.enable_scaling_mode();
    }
    if (key == 'g' || key == 'G') {
        let buttonShowGrid = document.getElementById("buttonShowGrid");
        raster.gridDots.forEach((dot) => {
            dot.visible = !dot.visible;
        });
        buttonShowGrid.classList.toggle("active");
    }
}

function clamp(v, min, max) { return v < min ? min : v > max ? max : v }
function step(v, s) { return Math.round(v / s) * s }

export function onMouseMove(event) {

    let maxW = image.width;
    let maxH = image.height;

    mouseGridX = clamp(step(event.point.x, raster.rasterMass), raster.rasterMass, Math.min(maxW, window.width) - raster.rasterMass);
    mouseGridY = clamp(step(event.point.y, raster.rasterMass), raster.rasterMass, Math.min(maxH, window.height) - raster.rasterMass);

    cursor.position = [mouseGridX, mouseGridY];
}

export function onMouseDown(event) {

    console.log("click!", event.x, event.y, "=>", mouseGridX, mouseGridY);

    const hitOptions = {
        segments: true,
        fill: true
    };


    switch (drawMode) {

        case "line":
            if (!paper.project.hitTest(new paper.Point(mouseGridX, mouseGridY))){
                drawLine();
            }

            break;

        case "area":

            if (event.x >= image.width || event.y >= image.height) return;

            var pt = new paper.Point(event.x, event.y);
            var hitObject = paper.project.hitTest(pt, hitOptions);
            console.log("you hit a", hitObject);
            if (!hitObject)
                drawArea();
            break;
    }
}

function drawLine() {
    const gpIdx = raster.gitterpunkte.findIndex((el) => (el.x == mouseGridX && el.y == mouseGridY));
    const gp = raster.gridDots[gpIdx];

    if (!gp) return;

    // toggle gridPoint:
    raster.gitterpunkte[gpIdx].active = !raster.gitterpunkte[gpIdx].active; // helper
    let scaling = raster.gitterpunkte[gpIdx].active ? raster.rasterMass / 3 : 1;
    setRadius(gp, scaling); // size

    // add or remove gp:
    if (raster.gitterpunkte[gpIdx].active) { // add
        raster.activeGridPoints.push(gp);
        raster.gridPointHistory.push(raster.gitterpunkte[gpIdx]);

        // neues Liniensegment:
        if (raster.activeGridPoints.length > 1) {
            var gp_vorher =
                raster.activeGridPoints.at(raster.activeGridPoints.length - 2);
            raster.gitterpunkte[gpIdx].updateDirection(gp_vorher);
            var ls = new Liniensegment(gp, gp_vorher, raster);
            raster.liniensegmente.push(ls);
            raster.line.addChild(ls.segment);
        }
    } else { // remove
        // TODO: To remove a segment from a path, we use the path. removeSegment(index) function and pass it the index of the segment we want to remove. // TODO: associate gridPoints with line segments id
        // TODO: remove the specific linesegment helper
        // TODO: remove specific gp from active list
    }
}


function onMouseDrag(event) {
    if (segment) {
        segment.point += event.delta;
        path.smooth();
    } else if (path) {
        path.position += event.delta;
    }
}

function drawArea() {
    raster.area.add(new paper.Point(mouseGridX, mouseGridY));
}