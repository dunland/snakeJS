import { globalVerboseLevel } from "./Devtools.js";
import { raster, image, cursor, changeCursor, imageArea, realGridSize } from "./paperSnake.js";
import { extractPathFromSheets } from "./lineExport.js"
import { sheetsGroup, sheetHelpers, scaleSheets, activeSheet, setActiveSheet, movableSheetsFrom, movableSheetsTo, selectNextRow, selectRowBySheet, toggleSheetVisibility } from "./Platten.js";

export var drawMode = "line"; // "line", "area", "moveSheet", "measureDistance"
var measureDistance;
var measureToolState = 0;
var ptAtSmallestDist;

export function changeDrawMode(newMode) {
    var oldMode = drawMode;
    if (oldMode == newMode) return;

    if (oldMode == "measureDistance") {
        if (measureDistance)
            measureDistance.remove();
        cursor.strokeColor = 'white';
        measureToolState = 0;
        document.getElementById("buttonMeasureDistance").classList.remove("active"); // force measureTool off
    }

    drawMode = newMode;
}

// Tastaturbefehle:
export function keyPressed(keyEvent) {
    let key = keyEvent.key;
    console.log(key);
    // exportiere DXF mit Taste 'r':
    if (key == 'R' || key == 'r') {
        console.log("begin file export");
        // downloadSVG(raster.line, "rasterLinieSkaliert.svg");
        extractPathFromSheets();
    }
    if (key == 'W' || key == 'w')
        raster.replaceLastCurve("KURVE_OBEN");
    if (key == 'A' || key == 'a')
        raster.replaceLastCurve("KURVE_LINKS");
    if (key == 'S' || key == 's')
        raster.replaceLastCurve("KURVE_UNTEN");
    if (key == 'D' || key == 'd')
        raster.replaceLastCurve("KURVE_RECHTS");
    if (key == 'F' || key == 'f')
        raster.replaceLastCurve("GERADE");
    if (key == 'Q' || key == 'q')
        raster.replaceLastCurve("KURVE_OBENLINKS_" + raster.getPathDirection());
    if (key == 'E' || key == 'e')
        raster.replaceLastCurve("KURVE_OBENRECHTS_" + raster.getPathDirection());
    if (key == 'Y' || key == 'y')
        raster.replaceLastCurve("KURVE_UNTENLINKS_" + raster.getPathDirection());
    if (key == 'X' || key == 'x')
        raster.replaceLastCurve("KURVE_UNTENRECHTS_" + raster.getPathDirection());
    if (key == ' ') {
        changeDrawMode("moveSheet");
        cursor.visible = false;
    }
    if (key == '+' || key == 'ȉ') {
        globalVerboseLevel++;
        console.log("globalVerboseLevel = ", globalVerboseLevel);
    }
    if (key == '-') {
        globalVerboseLevel--;
        console.log("globalVerboseLevel = ", globalVerboseLevel);
    }
    if (key == 'm' || key == 'M') {
        changeDrawMode("measureDistance");
    }
    if (key == 'l' || key == 'L') {
        document.getElementById("buttonShowPath").classList.toggle("active");
        raster.line.visible = !raster.line.visible;
    }
    if (key == 'p') toggleSheetVisibility();
    if (keyEvent.keyCode == 37) { // left
        for (var i = movableSheetsFrom; i < movableSheetsTo; i++) {
            sheetsGroup.children[i].position.x -= sheetHelpers[0].gridGapX;
            sheetHelpers[i].gridDots.position.x -= sheetHelpers[0].gridGapX;
        }
        for (var i = 0; i < sheetsGroup.children.length; i++) {
            showIntersections(sheetsGroup.children[i], raster.line);

            if (globalVerboseLevel > 1)
                sheetsGroup.children[i].fillColor = (!imageArea.bounds.intersects(sheetsGroup.children[i].bounds)) ? 'red' : null;
        }

    }
    if (keyEvent.keyCode == 39) { // right
        for (var i = movableSheetsFrom; i < movableSheetsTo; i++) {
            sheetsGroup.children[i].position.x += sheetHelpers[0].gridGapX;
            sheetHelpers[i].gridDots.position.x += sheetHelpers[0].gridGapX;
        }
        for (var i = 0; i < sheetsGroup.children.length; i++) {
            showIntersections(sheetsGroup.children[i], raster.line);

            if (globalVerboseLevel > 1)
                sheetsGroup.children[i].fillColor = (!imageArea.bounds.intersects(sheetsGroup.children[i].bounds)) ? 'red' : null;
        }

    }
    if (keyEvent.keyCode == 38) { // up:
        for (var i = 0; i < sheetsGroup.children.length; i++) {
            sheetsGroup.children[i].position.y -= sheetHelpers[0].gridGapY;
            sheetHelpers[i].gridDots.position.y -= sheetHelpers[0].gridGapY;
        }
        for (var i = 0; i < sheetsGroup.children.length; i++) {
            showIntersections(sheetsGroup.children[i], raster.line);

            if (globalVerboseLevel > 1)
                sheetsGroup.children[i].fillColor = (!imageArea.bounds.intersects(sheetsGroup.children[i].bounds)) ? 'red' : null;
        }
    }
    if (keyEvent.keyCode == 40) { // down:
        for (var i = 0; i < sheetsGroup.children.length; i++) {
            sheetsGroup.children[i].position.y += sheetHelpers[0].gridGapY;
            sheetHelpers[i].gridDots.position.y += sheetHelpers[0].gridGapY;
        }
        for (var i = 0; i < sheetsGroup.children.length; i++) {
            showIntersections(sheetsGroup.children[i], raster.line);

            if (globalVerboseLevel > 1)
                sheetsGroup.children[i].fillColor = (!imageArea.bounds.intersects(sheetsGroup.children[i].bounds)) ? 'red' : null;
        }
    }
}

export function keyReleased(keyEvent) {
    let key = keyEvent.key;
    if (key == ' ') { // leave mode
        let leftovers = 0;
        let sheets = 0;

        for (var i = 0; i < sheetsGroup.children.length; i++) {
            let child = sheetsGroup.children[i];
            if (imageArea.bounds.intersects(child.bounds)) {
                let tempObj = imageArea.exclude(sheetsGroup.children[i]).subtract(imageArea).removeOnMove();
                if (globalVerboseLevel > 2)
                    tempObj.fillColor = 'red';
                leftovers += tempObj.bounds.width * tempObj.bounds.height;
                sheets++;
            }
        }

        leftovers = leftovers * Math.pow(10, -6); // mm² to m²
        document.getElementById("leftovers").textContent = leftovers.toFixed(3)
        document.getElementById("sheets").textContent = sheets;
        changeDrawMode("line");
        cursor.visible = true;
    }
}

export function onMouseMove(event) {

    switch (drawMode) {
        case "line":

            // show/hide gridPoints:
            sheetHelpers.forEach(sheet => {
                sheet.hideGridPoints();
            });
            for (var i = 0; i < sheetsGroup.children.length; i++) {
                if (sheetsGroup.children[i].contains([event.point.x, event.point.y])) {
                    setActiveSheet(sheetHelpers[i]);
                    sheetHelpers[i].showGridPoints();
                    selectRowBySheet(i);
                    break;
                }
            }

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

        case "moveSheet":
            sheetsGroup.translate(event.delta);
            raster.line.translate(event.delta);
            for (var i = 0; i < sheetHelpers.length; i++) {
                sheetHelpers[i].gridDots.translate(event.delta);
                sheetHelpers[i].label.translate(event.delta);
            }

            for (var i = 0; i < sheetsGroup.children.length; i++) {
                showIntersections(sheetsGroup.children[i], raster.line);

                if (globalVerboseLevel > 1)
                    sheetsGroup.children[i].fillColor = (!imageArea.bounds.intersects(sheetsGroup.children[i].bounds)) ? 'red' : null;
            }

            break;

        case "measureDistance":
            cursor.position = [event.point.x, event.point.y];
            cursor.strokeColor = 'yellow';

            if (measureToolState == 1) {
                measureDistance.segments[1].point = [event.point.x, event.point.y];
                console.log(measureDistance.length);
            }

            break;

        default:
            break;
    }
}

export function onMouseDown(event) {

    console.log("click!", event.x, event.y, "=>", cursor.position.x, cursor.position.y);
    if (event.x >= image.width || event.y >= image.height) return;

    const hitOptions = {
        segments: true,
        fill: true,
        visible: true
    };

    switch (drawMode) {


        case "line":
            if (raster.area.contains(new paper.Point(cursor.position.x, cursor.position.y))) // TODO: also check crossing
                break;

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
                    raster.scaleX = userInput == null ? raster.scaleX : measureDistance.length / userInput;
                    raster.gridGapX = realGridSize * raster.scaleX;

                    changeCursor(raster.gridGapX * raster.scaleX / 2);
                    scaleSheets(sheetsGroup, raster.scaleX);

                    document.getElementById("rasterScaleX").textContent = raster.scaleX.toFixed(3);
                    changeDrawMode("line");
                    break;

                case 2:
                    measureDistance.remove();
                    measureToolState = 0;
                    break;

                default:
                    break;
            }
            console.log(measureDistance, measureToolState);
            break;

    }
}

function drawArea() {
    raster.area.add(new paper.Point(cursor.position.x, cursor.position.y));
}

export function showIntersections(path1, path2) {
    var intersections = path1.getIntersections(path2);
    for (var i = 0; i < intersections.length; i++) {
        new paper.Path.Circle({
            center: intersections[i].point,
            radius: 5,
            fillColor: '#009dec'
        }).removeOnMove();
    }
}