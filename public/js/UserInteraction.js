import { changeGlobalVerboseLevel, globalVerboseLevel } from "./Devtools.js";
import { raster, cursorCircle, changeCursor, globalColor } from "./paperSnake.js";
import { sheetsGroup, sheetHelpers, scaleSheets, activeSheet, movableSheetsFrom, movableSheetsTo, selectRowBySheet, toggleSheetVisibility, recreateSheets, calculateLeftovers, activeSheetIdx, getSheetAtCursorPos } from "./Platten.js";
import { showIntersections } from "./paperUtils.js";
import { drawMode, changeDrawMode, measureDistance, measureToolState, setMeasureDist, setMeasureState } from "./Modes.js";

var ptAtSmallestDist;
var keyInput = true;

/** -1 or 1 if splitting row from beginning (-1) or until end (1), default: 0*/
export var splitActiveSheets = 0; 

export var showSupportLines = true;
export function toggleSupportLines() {
    document.getElementById("buttonShowSupportLines").classList.toggle("active");
    showSupportLines = !showSupportLines;
};

// Tastaturbefehle:
export function keyPressed(keyEvent) {
    
    if (keyInput == false) return;
    
    let key = keyEvent.key;
    if (key == ' ') keyEvent.preventDefault();
    if (globalVerboseLevel >= 1)
        console.log(key);
    if (key == 'b') changeDrawMode("ROI");
    if (key == '+') changeGlobalVerboseLevel(key);
    if (key == '-') changeGlobalVerboseLevel(key);
    if (key == 'm') changeDrawMode("measureDistance");
    if (key == 'R' || key == 'r') recreateSheets();

    if (drawMode == "line") {
        // Press SPACE -> move sheet
        if (key == ' ') {
            changeDrawMode("moveSheet");
        }

        if ('qfweasdyx'.includes(key)) {
            document.querySelectorAll('span.key').forEach(element => {
                if (element.textContent.toLowerCase() === key){
                    element.style.fontWeight = 'bold';
                    element.style.border = '1px solid black';
                }
                else {
                    element.style.fontWeight = 'normal';
                    element.style.border = '';
                }
            })
        }
        switch (key) {
            case 'w':
                raster.projectedLine.type = "KURVE_OBEN";
                raster.indicateNextLine(cursorCircle.position);
                break;

            case 'a':
                raster.projectedLine.type = "KURVE_LINKS";
                raster.indicateNextLine(cursorCircle.position);

                break;

            case 's':
                raster.projectedLine.type = "KURVE_UNTEN";
                raster.indicateNextLine(cursorCircle.position);

                break;

            case 'd':
                raster.projectedLine.type = "KURVE_RECHTS";
                raster.indicateNextLine(cursorCircle.position);

                break;

            case 'f':
                raster.projectedLine.type = "GERADE";
                raster.indicateNextLine(cursorCircle.position);

                break;

            case 'q':
                raster.projectedLine.type = "KURVE_OBENLINKS";
                raster.projectedLine.updatePathDirection();
                raster.indicateNextLine(cursorCircle.position);

                break;

            case 'e':
                raster.projectedLine.type = "KURVE_OBENRECHTS";
                raster.projectedLine.updatePathDirection();
                raster.indicateNextLine(cursorCircle.position);

                break;

            case 'y':
                raster.projectedLine.type = "KURVE_UNTENLINKS";
                raster.projectedLine.updatePathDirection();
                raster.indicateNextLine(cursorCircle.position);

                break;

            case 'x':
                raster.projectedLine.type = "KURVE_UNTENRECHTS";
                raster.projectedLine.updatePathDirection();
                raster.indicateNextLine(cursorCircle.position);

                break;


            default:
                break;
        }

        if (key == 'l' || key == 'L') {
            document.getElementById("buttonShowPath").classList.toggle("active");
            raster.line.visible = !raster.line.visible;
        }
        if (key == 'p') toggleSheetVisibility();
        if (key == 'h') toggleSupportLines();
        if (key == 'Shift') {
            splitActiveSheets = -1;
            getSheetAtCursorPos(cursorCircle.position);
            selectRowBySheet(activeSheetIdx);
        }
        if (key == 'Control') {
            splitActiveSheets = 1;
            getSheetAtCursorPos(cursorCircle.position);
            selectRowBySheet(activeSheetIdx);
        }

        if (keyEvent.keyCode >= 37 && keyEvent.keyCode <= 40) { // Arrow Keys
            if (keyEvent.keyCode == 37) { // left

                // vertical layout: move all
                if (raster.realSheetDimHorizontal < raster.realSheetDimVertical) {
                    for (var i = 0; i < sheetsGroup.children.length; i++) {
                        sheetsGroup.children[i].position.x -= sheetHelpers[0].gridGapX;
                        sheetHelpers[i].gridDots.position.x -= sheetHelpers[0].gridGapX;
                        sheetHelpers[i].label.position.x -= sheetHelpers[0].gridGapX;
                    }
                }
                else { // horizontal layout: move selected
                    for (var i = movableSheetsFrom; i < movableSheetsTo; i++) {
                        sheetsGroup.children[i].position.x -= sheetHelpers[0].gridGapX;
                        sheetHelpers[i].gridDots.position.x -= sheetHelpers[0].gridGapX;
                        sheetHelpers[i].label.position.x -= sheetHelpers[0].gridGapX;
                    }
                }
            }

            if (keyEvent.keyCode == 39) { // right

                // vertical layout: move all
                if (raster.realSheetDimHorizontal < raster.realSheetDimVertical) {
                    for (var i = 0; i < sheetsGroup.children.length; i++) {
                        sheetsGroup.children[i].position.x += sheetHelpers[0].gridGapX;
                        sheetHelpers[i].gridDots.position.x += sheetHelpers[0].gridGapX;
                        sheetHelpers[i].label.position.x += sheetHelpers[0].gridGapX;
                    }
                }
                else { // horizontal layout: move selected
                    for (var i = movableSheetsFrom; i < movableSheetsTo; i++) {
                        sheetsGroup.children[i].position.x += sheetHelpers[0].gridGapX;
                        sheetHelpers[i].gridDots.position.x += sheetHelpers[0].gridGapX;
                        sheetHelpers[i].label.position.x += sheetHelpers[0].gridGapX;
                    }
                }
            }
            if (keyEvent.keyCode == 38) { // up:
                // vertical layout: move selected
                if (raster.realSheetDimHorizontal < raster.realSheetDimVertical) {

                    for (var i = movableSheetsFrom; i < movableSheetsTo; i++) {
                        sheetsGroup.children[i].position.y -= sheetHelpers[0].gridGapY;
                        sheetHelpers[i].gridDots.position.y -= sheetHelpers[0].gridGapY;
                        sheetHelpers[i].label.position.y -= sheetHelpers[0].gridGapY;
                    }
                }
                else { // horizontal layout: move all
                    for (var i = 0; i < sheetsGroup.children.length; i++) {
                        sheetsGroup.children[i].position.y -= sheetHelpers[0].gridGapY;
                        sheetHelpers[i].gridDots.position.y -= sheetHelpers[0].gridGapY;
                        sheetHelpers[i].label.position.y -= sheetHelpers[0].gridGapY;
                    }

                }
            }
            if (keyEvent.keyCode == 40) { // down:

                // vertical layout: move selected
                if (raster.realSheetDimHorizontal < raster.realSheetDimVertical) {

                    for (var i = movableSheetsFrom; i < movableSheetsTo; i++) {
                        sheetsGroup.children[i].position.y += sheetHelpers[0].gridGapY;
                        sheetHelpers[i].gridDots.position.y += sheetHelpers[0].gridGapY;
                        sheetHelpers[i].label.position.y += sheetHelpers[0].gridGapY;
                    }
                // horizontal layout: move all
                } else {
                    for (var i = 0; i < sheetsGroup.children.length; i++) {
                        sheetsGroup.children[i].position.y += sheetHelpers[0].gridGapY;
                        sheetHelpers[i].gridDots.position.y += sheetHelpers[0].gridGapY;
                        sheetHelpers[i].label.position.y += sheetHelpers[0].gridGapY;
                    }
                }
            }
            // show intersections:
            for (var i = 0; i < sheetsGroup.children.length; i++) {
                showIntersections(sheetsGroup.children[i], raster.line);

                if (globalVerboseLevel > 1)
                    sheetsGroup.children[i].fillColor = (!raster.roi.bounds.intersects(sheetsGroup.children[i].bounds)) ? 'red' : null;
            }
            // deselect all gridDots:
            for (let i = 0; i < sheetHelpers.length; i++) {
                sheetHelpers[i].gridDots.selected = false;
                sheetHelpers[i].hideGridPoints();
                sheetHelpers[i].showGridPoints();
            }

        }
    }

    else if (drawMode == "ROI" || drawMode == "measureDistance" || drawMode == "area") {
        if (key == "Enter") {
            changeDrawMode('line'); // leave Mode
        }
        if (key == "Escape") {
            if (raster.tempArea) {
                raster.tempArea.remove();
                raster.tempArea = new paper.Path();
                raster.tempArea.closed = true;
            }
            if (measureDistance) {
                measureToolState = 0;
                measureDistance.remove()
            }
        }
    }
}

export function keyReleased(keyEvent) {
    let key = keyEvent.key;
    if (key == ' ' && drawMode == 'moveSheet') { // leave mode
        calculateLeftovers();
        changeDrawMode("line");
        cursorCircle.visible = true;
    }
    if (key == 'Shift' || key == 'Control') {
        splitActiveSheets = 0;
    }
}

export function onMouseMove(event) {

    let mousePos = new paper.Point(event.point.x, event.point.y);
    window.mousePos = mousePos;

    switch (drawMode) {
        case "line":

            if (!raster.roi.contains(mousePos)) break;
            // show/hide gridPoints:
            getSheetAtCursorPos([mousePos.x, mousePos.y]);
            // move cursor:
            if (!activeSheet) break;

            // get shortest distance to active gridPoints:
            var smallestDist = Infinity;
            for (var i = 0; i < activeSheet.gridDots.children.length; i++) {
                var distToCursor = activeSheet.gridDots.children[i].position.getDistance([mousePos.x, mousePos.y]);
                if (distToCursor < smallestDist) {
                    smallestDist = distToCursor;
                    ptAtSmallestDist = activeSheet.gridDots.children[i];
                }
            }
            cursorCircle.position = ptAtSmallestDist.position;


            if (raster.line.segments.length) {

                // support lines:
                let distX = Math.abs(cursorCircle.position.x - raster.line.lastSegment.point.x);
                let distY = Math.abs(cursorCircle.position.y - raster.line.lastSegment.point.y);

                if (showSupportLines) {
                    // x line:
                    new paper.Path.Line({
                        from: raster.line.lastSegment.point,
                        to: [cursorCircle.position.x, raster.line.lastSegment.point.y],
                        strokeColor: globalColor,
                        dashArray: [4, 8],
                        strokeWidth: Math.round(distX / sheetHelpers[0].gridGapX) == Math.round(distY / sheetHelpers[0].gridGapY) ? 3 : 1
                    }).removeOnMove();

                    new paper.Path.Line({
                        from: raster.line.lastSegment.point,
                        to: [raster.line.lastSegment.point.x, cursorCircle.position.y],
                        strokeColor: globalColor,
                        dashArray: [4, 8],
                        strokeWidth: Math.round(distX / sheetHelpers[0].gridGapX) == Math.round(distY / sheetHelpers[0].gridGapY) ? 3 : 1
                    }).removeOnMove();
                }

                // display distance info:
                document.getElementById("cursorDistX").textContent = Math.round(distX / raster.pxPerMM);
                document.getElementById("cursorDistY").textContent = Math.round(distY / raster.pxPerMM);
                if (Math.round(distX / sheetHelpers[0].gridGapX) == Math.round(distY / sheetHelpers[0].gridGapY)) {
                    document.getElementsByClassName("mousePos")[0].style.fontWeight = "bold";
                } else {
                    document.getElementsByClassName("mousePos")[0].style.fontWeight = "normal";
                }
                // predict next line:
                raster.indicateNextLine(cursorCircle.position);
            }

            break;

        case "area":
            cursorCircle.position = [event.point.x, event.point.y];
            break;

        case "ROI":
            cursorCircle.position = [event.point.x, event.point.y];
            break;

        case "moveSheet":
            sheetsGroup.translate(event.delta);
            raster.line.translate(event.delta);
            for (var i = 0; i < sheetHelpers.length; i++) {
                sheetHelpers[i].gridDots.translate(event.delta);
                sheetHelpers[i].label.translate(event.delta);
            }

            for (var i = 0; i < sheetsGroup.children.length; i++) {

                // show leftovers:
                if (globalVerboseLevel > 1)
                    sheetsGroup.children[i].fillColor = (!raster.roi.bounds.intersects(sheetsGroup.children[i].bounds)) ? 'red' : null;
            }

            break;

        case "measureDistance":
            cursorCircle.position = [event.point.x, event.point.y];
            cursorCircle.strokeColor = 'yellow';

            if (measureToolState == 1) {
                measureDistance.segments[1].point = [event.point.x, event.point.y];
            }

            break;

        default:
            break;
    }
}

export function onMouseDown(event) {

    if (event.target.nodeName == 'INPUT') {
        keyInput = false;
        console.log(event.target.nodeName, keyInput);
    }
    if (event.target.nodeName == 'CANVAS') {
        keyInput = true;
        if (globalVerboseLevel > 3)
            console.log("click on", event.target.nodeName, keyInput);
    }

    let canvasElement = document.getElementById('snakeCanvas');


    if (globalVerboseLevel > 2)
        console.log("click!", event.x, event.y, "=>", cursorCircle.position.x, cursorCircle.position.y, 2);

    if (event.x >= canvasElement.clientWidth || event.y >= canvasElement.clientHeight) {
        if (globalVerboseLevel > 2)
            console.log("cannot draw here! (not in canvas)");
        return;
    }


    const hitOptions = {
        segments: true,
        fill: true,
        visible: true
    };

    switch (drawMode) {

        case "line":
            if (!raster.roi.contains(cursorCircle.position)) {
                console.log("cannot draw here! (not in roi)");
                return;
            }

            if (raster.area.contains(new paper.Point(cursorCircle.position.x, cursorCircle.position.y))) { // TODO: also check crossing
                console.log("cannot draw here! (area blocked)");
                break;
            }

            if (raster.line.segments.length > 0)
                for (let i = 0; i < raster.line.segments.length; i++) {
                    const seg = raster.line.segments[i];
                    if (cursorCircle.bounds.contains(seg.point))
                        console.log("match", seg);
                }

            /* HIT TEST: 
                if hit: get segment
                else: addLine
             */
            raster.addLine(ptAtSmallestDist);

            break;

        case "area":

            var pt = new paper.Point(event.x, event.y);
            var hitObject = paper.project.hitTest(pt, hitOptions);
            if (globalVerboseLevel > 2)
                console.log("you hit a", hitObject);
            if (!hitObject)
                drawArea();
            break;

        case "ROI":

            drawROI();
            break;

        case "measureDistance":

            // first-time object initialization
            switch (measureToolState) {
                case 0: // begin line where clicked
                    setMeasureDist(new paper.Path.Line({
                        from: [event.x, event.y],
                        to: [event.x, event.y],
                        strokeColor: 'yellow',
                        strokeWidth: 2,
                        dashArray: [4, 4]
                    }));

                    setMeasureState(measureToolState + 1);
                    break;

                case 1:
                    measureDistance.segments[1] = [event.x, event.y];
                    setMeasureState(measureToolState + 1);
                    let userInput = prompt(`${Math.floor(measureDistance.length)} pixel gemessen. Wie viel mm?`);
                    raster.pxPerMM = userInput == null ? raster.pxPerMM : measureDistance.length / userInput;
                    raster.recalculateGridGap();

                    changeCursor(raster.gridGapX * raster.pxPerMM / 2);
                    scaleSheets();
                    // recreateSheets();

                    changeDrawMode("line");
                    break;

                case 2:
                    measureDistance.remove();
                    setMeasureState(0);
                    break;

                default:
                    break;
            }
            console.log("distance measured in px:", measureDistance.length);
            break;

    }
}

function drawArea() {
    if (!raster.tempArea || raster.tempArea.segments.length < 1) {
        raster.tempArea = new paper.Path();
        raster.tempArea.strokeColor = new paper.Color(1, 0, 0, 0.45);
        raster.tempArea.dashArray = [4, 4];
        raster.tempArea.closed = true;
    }
    raster.tempArea.add(new paper.Point(cursorCircle.position.x, cursorCircle.position.y));
}

function drawROI() {
    if (!raster.tempArea || raster.tempArea.segments.length < 1) {
        raster.tempArea = new paper.Path();
        raster.tempArea.strokeColor = new paper.Color(0, 0, 1);
        raster.tempArea.dashArray = [4, 4];
        raster.tempArea.closed = true;
    }
    raster.tempArea.add(new paper.Point(cursorCircle.position.x, cursorCircle.position.y));
}