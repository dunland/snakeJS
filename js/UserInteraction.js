import { globalVerboseLevel } from "./Devtools.js";
import { Liniensegment } from "./Liniensegmente.js";
import { raster, platten, image, cursor } from "./paperSnake.js";
import { exportLines } from "./lineExport.js"
import imageSettings from "../settings.json" assert { type: 'json' };

var mouseGridX, mouseGridY;
export var drawMode = "line"; // draw "line" or "area"
export function changeDrawMode(newMode) { drawMode = newMode; }
var distance;
var distanceToolClicks = 0;

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
        raster.gridDots.forEach((dot) => {
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
            cursor.position = [mouseGridX, mouseGridY];
            break;

        case "area":
            cursor.position = [event.point.x, event.point.y];
            break;

        case "moveSheet":
            platten.translate(event.delta);

            for (var i = 0; i < platten.children.length; i++) {
                showIntersections(platten.children[i], raster.line);
            }
            break;

        case "measureDistance":
            if (distanceToolClicks == 1) {
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

            if (event.x >= image.width || event.y >= image.height) return;

            var pt = new paper.Point(event.x, event.y);
            var hitObject = paper.project.hitTest(pt, hitOptions);
            console.log("you hit a", hitObject);
            if (!hitObject)
                drawArea();
            break;

        case "measureDistance":

            // first-time object initialization
            switch (distanceToolClicks) {
                case 0: // begin line where clicked
                    distance = new paper.Path.Line({
                        from: [event.x, event.y],
                        to: [event.x, event.y],
                        strokeColor: 'yellow',
                        strokeWidth: 2
                    });

                    distanceToolClicks += 1;
                    break;

                case 1:
                    distance.segments[1] = [event.x, event.y];
                    distanceToolClicks += 1;
                    let userInput = prompt(`${Math.floor(distance.length)} pixel gemessen. Wie viel cm?`);
                    raster.scaleX = distance.length / userInput;
                    document.getElementById("rasterScaleX").textContent = raster.scaleX.toFixed(3);
                    console.log(raster.scaleX);
                    break;

                case 2:
                    distance.remove();
                    distanceToolClicks = 0;
                    break;

                default:
                    break;
            }
            console.log(distance, distanceToolClicks);
            break;

    }
}

function drawArea() {
    raster.area.add(new paper.Point(mouseGridX, mouseGridY));
}

function showIntersections(path1, path2) {
    var intersections = path1.getIntersections(path2);
    console.log(intersections.length);
    for (var i = 0; i < intersections.length; i++) {
        new paper.Path.Circle({
            center: intersections[i].point,
            radius: 5,
            fillColor: '#009dec'
        }).removeOnMove();
    }
}