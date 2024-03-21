import { changeGlobalVerboseLevel, globalVerboseLevel } from "./Devtools.js";
import { raster, cursor, changeCursor } from "./paperSnake.js";
import { sheetsGroup, sheetHelpers, scaleSheets, activeSheet, movableSheetsFrom, movableSheetsTo, selectRowBySheet, toggleSheetVisibility, recreateSheets, calculateLeftovers, activeSheetIdx, getSheetAtCursorPos } from "./Platten.js";
import { showIntersections } from "./paperUtils.js";
import { drawMode, changeDrawMode, measureDistance, measureToolState, setMeasureDist, setMeasureState } from "./Modes.js";

var ptAtSmallestDist;
var keyInput = true;

export var splitActiveSheets = 0;

// Tastaturbefehle:
export function keyPressed(keyEvent) {

    if (keyInput == false) return;

    let key = keyEvent.key;
    if (globalVerboseLevel >= 1)
        console.log(key);
    if (key == 'b') changeDrawMode("ROI");
    if (key == '+') changeGlobalVerboseLevel(key);
    if (key == '-') changeGlobalVerboseLevel(key);
    if (key == 'd') changeDrawMode("measureDistance");
    
    if (drawMode == "line") {
        if (key == ' ') changeDrawMode("moveSheet");
        if (key == 'R' || key == 'r') recreateSheets();
        if (key == 'W' || key == 'w') raster.replaceLastCurve("KURVE_OBEN");
        if (key == 'A' || key == 'a') raster.replaceLastCurve("KURVE_LINKS");
        if (key == 'S' || key == 's') raster.replaceLastCurve("KURVE_UNTEN");
        if (key == 'D' || key == 'd') raster.replaceLastCurve("KURVE_RECHTS");
        if (key == 'F' || key == 'f') raster.replaceLastCurve("GERADE");
        if (key == 'Q' || key == 'q') raster.replaceLastCurve("KURVE_OBENLINKS_" + raster.getPathDirection());
        if (key == 'E' || key == 'e')
            raster.replaceLastCurve("KURVE_OBENRECHTS_" + raster.getPathDirection());
        if (key == 'Y' || key == 'y')
            raster.replaceLastCurve("KURVE_UNTENLINKS_" + raster.getPathDirection());
        if (key == 'X' || key == 'x')
            raster.replaceLastCurve("KURVE_UNTENRECHTS_" + raster.getPathDirection());
        if (key == 'l' || key == 'L') {
            document.getElementById("buttonShowPath").classList.toggle("active");
            raster.line.visible = !raster.line.visible;
        }
        if (key == 'p') toggleSheetVisibility();
        if (key == 'Shift') {
            splitActiveSheets = -1;
            getSheetAtCursorPos(cursor.position);
            selectRowBySheet(activeSheetIdx);
        }
        if (key == 'Control') {
            splitActiveSheets = 1;
            getSheetAtCursorPos(cursor.position);
            selectRowBySheet(activeSheetIdx);
        }
        if (keyEvent.keyCode == 37) { // left

            // vertical layout: move all
            if (raster.realSheetH < raster.realSheetV) {
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

            // show intersections:
            for (var i = 0; i < sheetsGroup.children.length; i++) {
                showIntersections(sheetsGroup.children[i], raster.line);

                if (globalVerboseLevel > 1)
                    sheetsGroup.children[i].fillColor = (!raster.roi.bounds.intersects(sheetsGroup.children[i].bounds)) ? 'red' : null;
            }
            // deselect all gridDots:
            for (let i = 0; i < sheetHelpers.length; i++){
                sheetHelpers[i].gridDots.selected = false;
                sheetHelpers[i].hideGridPoints();
                sheetHelpers[i].showGridPoints();
            }
            
        }

        if (keyEvent.keyCode == 39) { // right

            // vertical layout: move all
            if (raster.realSheetH < raster.realSheetV) {
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
            for (var i = 0; i < sheetsGroup.children.length; i++) {
                showIntersections(sheetsGroup.children[i], raster.line);

                if (globalVerboseLevel > 1)
                    sheetsGroup.children[i].fillColor = (!raster.roi.bounds.intersects(sheetsGroup.children[i].bounds)) ? 'red' : null;
            }
            for (let i = 0; i < sheetHelpers.length; i++){
                sheetHelpers[i].gridDots.selected = false;
                sheetHelpers[i].hideGridPoints();
                sheetHelpers[i].showGridPoints();
            }

        }
        if (keyEvent.keyCode == 38) { // up:
            // vertical layout: move selected
            if (raster.realSheetH < raster.realSheetV) {

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
            for (var i = 0; i < sheetsGroup.children.length; i++) {
                showIntersections(sheetsGroup.children[i], raster.line);

                if (globalVerboseLevel > 1)
                    sheetsGroup.children[i].fillColor = (!raster.roi.bounds.intersects(sheetsGroup.children[i].bounds)) ? 'red' : null;
            }

            // each sheet:
            for (let i = 0; i < sheetHelpers.length; i++) {
                const sheet = sheetHelpers[i];
                sheet.gridDots.selected = false;
                sheet.hideGridPoints();
                sheet.showGridPoints();
            }
        }
        if (keyEvent.keyCode == 40) { // down:

            // vertical layout: move selected
            if (raster.realSheetH < raster.realSheetV) {

                for (var i = movableSheetsFrom; i < movableSheetsTo; i++) {
                    sheetsGroup.children[i].position.y += sheetHelpers[0].gridGapY;
                    sheetHelpers[i].gridDots.position.y += sheetHelpers[0].gridGapY;
                    sheetHelpers[i].label.position.y += sheetHelpers[0].gridGapY;
                }

            } else {
                for (var i = 0; i < sheetsGroup.children.length; i++) {
                    sheetsGroup.children[i].position.y += sheetHelpers[0].gridGapY;
                    sheetHelpers[i].gridDots.position.y += sheetHelpers[0].gridGapY;
                    sheetHelpers[i].label.position.y += sheetHelpers[0].gridGapY;
                }

            }
            for (var i = 0; i < sheetsGroup.children.length; i++) {
                showIntersections(sheetsGroup.children[i], raster.line);

                if (globalVerboseLevel > 1)
                    sheetsGroup.children[i].fillColor = (!raster.roi.bounds.intersects(sheetsGroup.children[i].bounds)) ? 'red' : null;
            }
            for (let i = 0; i < sheetHelpers.length; i++){
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
        cursor.visible = true;
    }
    if (key == 'Shift' || key == 'Control') {
        splitActiveSheets = 0;
    }
}

export function onMouseMove(event) {

    switch (drawMode) {
        case "line":

            // show/hide gridPoints:
            getSheetAtCursorPos([event.point.x, event.point.y]);
            // move cursor:
            if (!activeSheet) break;

            // get shortest distance to active gridPoints:
            var smallestDist = Infinity;
            for (var i = 0; i < activeSheet.gridDots.children.length; i++) {
                var distToCursor = activeSheet.gridDots.children[i].position.getDistance([event.point.x, event.point.y]);
                if (distToCursor < smallestDist) {
                    smallestDist = distToCursor;
                    ptAtSmallestDist = activeSheet.gridDots.children[i];
                }
            }
            cursor.position = ptAtSmallestDist.position;

            break;

        case "area":
            cursor.position = [event.point.x, event.point.y];
            break;

        case "ROI":
            cursor.position = [event.point.x, event.point.y];
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
            cursor.position = [event.point.x, event.point.y];
            cursor.strokeColor = 'yellow';

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
        console.log("click!", event.x, event.y, "=>", cursor.position.x, cursor.position.y, 2);

    if (event.x >= canvasElement.clientWidth || event.y >= canvasElement.clientHeight) {
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
            if (!raster.roi.contains(cursor.position)) {
                console.log("cannot draw here! (not in roi)");
                return;
            }

            if (raster.area.contains(new paper.Point(cursor.position.x, cursor.position.y))) { // TODO: also check crossing
                console.log("cannot draw here! (area blocked)");
                break;
            }

            if (raster.line.segments.length > 0)
                for (let i = 0; i < raster.line.segments.length; i++) {
                    const seg = raster.line.segments[i];
                    if (cursor.bounds.contains(seg.point))
                        console.log("match", seg);
                }
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

            var pt = new paper.Point(event.x, event.y);
            var hitObject = paper.project.hitTest(pt, hitOptions);
            if (globalVerboseLevel > 2)
                console.log("you hit a", hitObject);
            if (!hitObject)
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
                    raster.gridGapX = raster.realSheetMargin * raster.pxPerMM;

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
    raster.tempArea.add(new paper.Point(cursor.position.x, cursor.position.y));
}

function drawROI() {
    if (!raster.tempArea || raster.tempArea.segments.length < 1) {
        raster.tempArea = new paper.Path();
        raster.tempArea.strokeColor = new paper.Color(0, 0, 1);
        raster.tempArea.dashArray = [4, 4];
        raster.tempArea.closed = true;
    }
    raster.tempArea.add(new paper.Point(cursor.position.x, cursor.position.y));
}