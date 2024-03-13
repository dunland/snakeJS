import { changeGlobalVerboseLevel, globalVerboseLevel } from "./Devtools.js";
import { raster, cursor, changeCursor, globalColor } from "./paperSnake.js";
import { sheetsGroup, sheetHelpers, scaleSheets, activeSheet, movableSheetsFrom, movableSheetsTo, setMovableSheetsFrom, setMovableSheetsTo, selectRowBySheet, toggleSheetVisibility, recreateSheets, calculateLeftovers, activeSheetIdx, getSheetAtCursorPos } from "./Platten.js";
import { showIntersections } from "./paperUtils.js";

export var drawMode = "line"; // "line", "area", "moveSheet", "measureDistance"
var measureDistance;
var measureToolState = 0;
var ptAtSmallestDist;
var tempArea;

export var splitActiveSheets = 0;

export function changeDrawMode(entering) {
    var leaving = drawMode;
    if (leaving == entering) return;

    if (globalVerboseLevel > 2)
        console.log(leaving, ">>", entering);

    // ------------------ entering mode: ------------------
    if (entering == "area")
        cursor.strokeColor = 'red';
    else if (entering == "line") {
        cursor.strokeColor = globalColor;
        document.getElementById('tooltips').classList.remove("hidden");
    }
    else if (entering == "ROI") {
        raster.roi.strokeColor = null;
        cursor.strokeColor = 'blue';
    }
    else if (entering == "moveSheet")
        cursor.visible = false;

    // ------------------- leaving mode: -------------------
    if (leaving == "line")
        document.getElementById('tooltips').classList.add("hidden");


    if (leaving == "measureDistance") {
        if (measureDistance)
            measureDistance.remove();
        measureToolState = 0;
        document.getElementById("button_measureDistance").classList.remove("active"); // force measureTool off
    }

    if (leaving == "area")
        if (!tempArea || tempArea.segments.length < 1)
            console.log("no segments in child");
        else {
            raster.area.addChild(tempArea)
            raster.area.fillColor = new paper.Color(1, 0, 0, 0.45);
            raster.area.dashArray = null;
            tempArea = new paper.Path();
            tempArea.closed = true;
        }

    if (leaving == "ROI") {
        // cursor.strokeColor = globalColor;
        if (!tempArea || tempArea.segments.length < 1)
            console.log("no segments in child");
        else {
            raster.roi.remove();
            raster.roi = tempArea.clone();
            raster.roi.strokeColor = 'blue';
            raster.roi.dashArray = null;
            tempArea.remove();
            tempArea = new paper.Path();
            tempArea.closed = true;
            // let bounds = new paper.Path.Rectangle(raster.roi.bounds);
            // bounds.strokeColor = 'red';
        }
    }

    drawMode = entering;
}

// Tastaturbefehle:
export function keyPressed(keyEvent) {
    let key = keyEvent.key;
    if (globalVerboseLevel >= 4)
        console.log(key);
    if (drawMode == "line") {
        if (key == 'R' || key == 'r') recreateSheets();
        if (key == 'W' || key == 'w') raster.replaceLastCurve("KURVE_OBEN");
        if (key == 'A' || key == 'a') raster.replaceLastCurve("KURVE_LINKS");
        if (key == 'S' || key == 's') raster.replaceLastCurve("KURVE_UNTEN");
        if (key == 'D' || key == 'd') raster.replaceLastCurve("KURVE_RECHTS");
        if (key == 'F' || key == 'f') raster.replaceLastCurve("GERADE");
        if (key == 'Q' || key == 'q') raster.replaceLastCurve; ("KURVE_OBENLINKS_" + raster.getPathDirection());
        if (key == 'E' || key == 'e')
            raster.replaceLastCurve("KURVE_OBENRECHTS_" + raster.getPathDirection());
        if (key == 'Y' || key == 'y')
            raster.replaceLastCurve("KURVE_UNTENLINKS_" + raster.getPathDirection());
        if (key == 'X' || key == 'x')
            raster.replaceLastCurve("KURVE_UNTENRECHTS_" + raster.getPathDirection());
        if (key == ' ') changeDrawMode("moveSheet");
        if (key == '+') changeGlobalVerboseLevel(key);
        if (key == '-') changeGlobalVerboseLevel(key);
        if (key == 'd') changeDrawMode("measureDistance");
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
            for (let i = 0; i < sheetHelpers.length; i++)
                sheetHelpers[i].gridDots.selected = false;
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
            for (let i = 0; i < sheetHelpers.length; i++)
                sheetHelpers[i].gridDots.selected = false;

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
            for (let i = 0; i < sheetHelpers.length; i++)
                sheetHelpers[i].gridDots.selected = false;
        }
    }
}

export function keyReleased(keyEvent) {
    let key = keyEvent.key;
    if (key == ' ') { // leave mode
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
            sheetHelpers.forEach(sheet => {
                sheet.hideGridPoints();
            });
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
                    measureDistance = new paper.Path.Line({
                        from: [event.x, event.y],
                        to: [event.x, event.y],
                        strokeColor: 'yellow',
                        strokeWidth: 2
                    });

                    measureToolState += 1;
                    break;

                case 1:
                    measureDistance.segments[1] = [event.x, event.y];
                    measureToolState += 1;
                    let userInput = prompt(`${Math.floor(measureDistance.length)} pixel gemessen. Wie viel mm?`);
                    raster.pxPerMM = userInput == null ? raster.pxPerMM : measureDistance.length / userInput;
                    raster.gridGapX = raster.realSheetMargin * raster.pxPerMM;

                    changeCursor(raster.gridGapX * raster.pxPerMM / 2);
                    scaleSheets(sheetsGroup, raster.pxPerMM);
                    // recreateSheets();

                    document.getElementById("rasterPxPerMM").textContent = raster.pxPerMM.toFixed(3);
                    changeDrawMode("line");
                    break;

                case 2:
                    measureDistance.remove();
                    measureToolState = 0;
                    break;

                default:
                    break;
            }
            console.log("distance measured in px:", measureDistance.length);
            break;

    }
}

function drawArea() {
    if (!tempArea || tempArea.segments.length < 1) {
        tempArea = new paper.Path();
        tempArea.strokeColor = new paper.Color(1, 0, 0, 0.45);
        tempArea.dashArray = [4, 4];
        tempArea.closed = true;
    }
    tempArea.add(new paper.Point(cursor.position.x, cursor.position.y));
}

function drawROI() {
    if (!tempArea || tempArea.segments.length < 1) {
        tempArea = new paper.Path();
        tempArea.strokeColor = new paper.Color(0, 0, 1);
        tempArea.dashArray = [4, 4];
        tempArea.closed = true;
    }
    tempArea.add(new paper.Point(cursor.position.x, cursor.position.y));
}