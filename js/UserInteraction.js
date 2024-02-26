import { globalVerboseLevel } from "./Devtools.js";
import { raster, sheetsGroup, image, cursor, changeCursor, imageArea, globalGridSize } from "./paperSnake.js";
import { exportLines } from "./lineExport.js"
import imageSettings from "../settings.json" assert { type: 'json' };
import { sheetHelpers, scaleSheets, activeSheet, setActiveSheet, movableSheetsFrom, movableSheetsTo, selectNextRow, selectRowBySheet } from "./Platten.js";

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
        measureToolState = 0;
        document.getElementById("buttonMeasureDistance").classList.remove("active"); // force measureTool off
    }

    drawMode = newMode;
}

// Tastaturbefehle:
export function keyPressed(keyEvent) {
    let key = keyEvent.key;
    console.log(key);
    let imageName = imageSettings.imageName;
    // exportiere DXF mit Taste 'r':
    if (key == 'R' || key == 'r') {
        console.log("begin dxf export");

        const exportedModel = exportLines();
        console.log(exportedModel);

        const dataToSend = { fileName: `export/${imageName}.dxf`, fileContent: JSON.stringify(exportedModel) };
        console.log(dataToSend);

        fetch('http://localhost:3000/api/sendData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        })
            .then(response => response.text())
            .then(message => {
                console.log('Antwort vom Server:', message);
            })
            .catch(error => {
                console.error('Fehler beim Senden der Daten:', error);
            });
    }
    if (key == 'W' || key == 'w')
        raster.replaceCurve("KURVE_OBEN");
    if (key == 'A' || key == 'a')
        raster.lineSegments.at(raster.lineSegments.length - 1).typ = "KURVE_LINKS";
    if (key == 'S' || key == 's')
        raster.replaceCurve("KURVE_UNTEN");
    if (key == 'D' || key == 'd')
        raster.lineSegments.at(raster.lineSegments.length - 1).typ = "KURVE_RECHTS";
    if (key == 'Q' || key == 'q')
        raster.replaceCurve("KURVE_OBENLINKS_" + raster.getPathDirection());
    if (key == 'E' || key == 'e')
        raster.replaceCurve("KURVE_OBENRECHTS_" + raster.getPathDirection());
    if (key == 'Y' || key == 'y')
        raster.replaceCurve("KURVE_UNTENLINKS_" + raster.getPathDirection());
    if (key == 'X' || key == 'x')
        raster.replaceCurve("KURVE_UNTENRECHTS_" + raster.getPathDirection());
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
    if (key == 'p' || key == 'P') {
        document.getElementById("buttonShowPath").classList.toggle("active");
        raster.lineSegments.forEach((ls) => {
            ls.segment.visible = !ls.segment.visible;
        });
    }
    if (keyEvent.keyCode == 37) { // left
        for (var i = movableSheetsFrom; i < movableSheetsTo; i++){
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
        for (var i = movableSheetsFrom; i < movableSheetsTo; i++){
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
        for (var i = 0; i < sheetsGroup.children.length; i++){
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
        for (var i = 0; i < sheetsGroup.children.length; i++){
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
            for (var i = 0; i < sheetHelpers.length; i++)
                sheetHelpers[i].gridDots.translate(event.delta);

            for (var i = 0; i < sheetsGroup.children.length; i++) {
                showIntersections(sheetsGroup.children[i], raster.line);

                if (globalVerboseLevel > 1)
                    sheetsGroup.children[i].fillColor = (!imageArea.bounds.intersects(sheetsGroup.children[i].bounds)) ? 'red' : null;
            }

            break;

        case "measureDistance":
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
                    raster.gridGap = globalGridSize * raster.scaleX;

                    changeCursor(raster.gridGap * raster.scaleX / 2);
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

function showIntersections(path1, path2) {
    var intersections = path1.getIntersections(path2);
    for (var i = 0; i < intersections.length; i++) {
        new paper.Path.Circle({
            center: intersections[i].point,
            radius: 5,
            fillColor: '#009dec'
        }).removeOnMove();
    }
}