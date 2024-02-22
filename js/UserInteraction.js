import { globalVerboseLevel } from "./Devtools.js";
import { raster, sheetsGroup, image, cursor, changeCursor, imageArea } from "./paperSnake.js";
import { exportLines } from "./lineExport.js"
import imageSettings from "../settings.json" assert { type: 'json' };
import { sheetHelpers, scaleSheets } from "./Platten.js";

var mouseGridX, mouseGridY;
export var drawMode = "line"; // "line", "area", "moveSheet", "measureDistance"
var distance;
var measureToolState = 0;

export function changeDrawMode(newMode) {
    var oldMode = drawMode;
    if (oldMode == newMode) return;

    if (oldMode == "measureDistance") {
        if (distance)
            distance.remove();
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
    if (key == 'n' || key == 'N') {
        raster.enable_scaling_mode();
    }
    if (key == 'g' || key == 'G') {
        let buttonShowGrid = document.getElementById("buttonShowGrid");
        raster.gridCirclePaths.forEach((dot) => {
            dot.visible = !dot.visible;
        });
        buttonShowGrid.classList.toggle("active");
    }
}

export function keyReleased(keyEvent) {
    let key = keyEvent.key;
    if (key == ' ') { // leave mode
        changeDrawMode("line");
        cursor.visible = true;
    }
}

function clamp(v, min, max) { return v < min ? min : v > max ? max : v }
function step(v, s) { return Math.round(v / s) * s }

export function onMouseMove(event) {

    let maxW = image.width;
    let maxH = image.height;
    mouseGridX = clamp(step(event.point.x, raster.rasterMass), raster.rasterMass, Math.min(maxW, window.width) - raster.rasterMass);
    mouseGridY = clamp(step(event.point.y, raster.rasterMass), raster.rasterMass, Math.min(maxH, window.height) - raster.rasterMass);

    switch (drawMode) {
        case "line":

        // move cursor:
        cursor.position = [mouseGridX, mouseGridY];

        // show/hide gridPoints:
            sheetHelpers.forEach(sheet => {
                sheet.hideGridPoints();
            });            
            for (var i = 0; i < sheetsGroup.children.length; i++) {
                if (sheetsGroup.children[i].contains([mouseGridX, mouseGridY])) {

                    var idx = sheetHelpers.findIndex((el) => el.rectangleObject.id == sheetsGroup.children[i].id);

                    console.log(sheetHelpers[idx].gridDots,
                        sheetHelpers[idx].rectangleObject.id,
                        sheetsGroup.children[idx].id);

                    var sh = sheetHelpers[idx];
                    sh.showGridPoints();

                    break;
                }
            }
            break;

        case "area":
            cursor.position = [event.point.x, event.point.y];
            break;

        case "moveSheet":
            sheetsGroup.translate(event.delta);

            for (var i = 0; i < sheetsGroup.children.length; i++) {
                showIntersections(sheetsGroup.children[i], raster.line);
            }
            break;

        case "measureDistance":
            if (measureToolState == 1) {
                distance.segments[1].point = [event.point.x, event.point.y];
                console.log(distance.length);
            }

            break;

        default:
            break;
    }
}

export function onMouseDown(event) {

    console.log("click!", event.x, event.y, "=>", mouseGridX, mouseGridY);
    if (event.x >= image.width || event.y >= image.height) return;

    const hitOptions = {
        segments: true,
        fill: true,
        visible: true
    };

    switch (drawMode) {


        case "line":
            if (raster.area.contains(new paper.Point(mouseGridX, mouseGridY))) // TODO: also check crossing
                break;

            raster.addLine(mouseGridX, mouseGridY);
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
                    distance = new paper.Path.Line({
                        from: [event.x, event.y],
                        to: [event.x, event.y],
                        strokeColor: 'yellow',
                        strokeWidth: 2
                    });

                    measureToolState += 1;
                    break;

                case 1:
                    distance.segments[1] = [event.x, event.y];
                    measureToolState += 1;
                    let userInput = prompt(`${Math.floor(distance.length)} pixel gemessen. Wie viel cm?`);
                    raster.scaleX = userInput == null ? raster.scaleX : distance.length / userInput;
                    raster.rasterMass = raster.rasterMass * raster.scaleX;
                    console.log(raster.scaleX);

                    raster.removeGridPoints();
                    raster.createPoints(image.width, image.height);

                    changeCursor(raster.rasterMass * raster.scaleX / 2);
                    scaleSheets(sheetsGroup, raster.scaleX);

                    document.getElementById("rasterScaleX").textContent = raster.scaleX.toFixed(3);
                    changeDrawMode("line");
                    break;

                case 2:
                    distance.remove();
                    measureToolState = 0;
                    break;

                default:
                    break;
            }
            console.log(distance, measureToolState);
            break;

    }
}

function drawArea() {
    raster.area.add(new paper.Point(mouseGridX, mouseGridY));
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