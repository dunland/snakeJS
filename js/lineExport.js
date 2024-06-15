import imageSettings from "../settings.json" assert { type: 'json' };
import { sheetsGroup, sheetHelpers } from "./Platten.js";
import { raster } from "./paperSnake.js";

// line example:
var line = {
    type: 'line',
    origin: [0, 0],
    end: [50, 50]
};

// dxf example:
// var points = [[0, 100], [0, 0], [100, 0]];
// var curve1 = new makerjs.models.BezierCurve(points);
// curve1.origin = [20, 20];
// more accurate
// var curve2 = new makerjs.models.BezierCurve(points, 0.01);

// var model = {
//     models: {
//       c1: curve1, c2: curve2
//     }
//   };

// json output example:

var model = {
    models: {
        c1: {
            points: [[0, 100], [0, 0], [100, 0]], // ctrl, ctrl, end??
            origin: [20, 20]
        }, // x1, y1
        c2: {
            points: [[0, 100], [0, 0], [100, 0]],
            origin: [40, 40]
        },
        l1: {
            type: 'line',
            origin: [0, 0],
            end: [50, 50]
        }
    }
};


export function createDemoLines() {

    const ls = raster.lineSegmentsTypeHistory[0];
    const model = {
        models: {
            c1: {
                points: [
                    [ls.x1, ls.y1],
                    [ls.ctrl1.x, ls.ctrl1.y],
                    [ls.ctrl2.x, ls.ctrl2.y],
                    [ls.x2, ls.y2]], // start, ctrl, [ctrl,...] end
                origin: [ls.x1, ls.y1]
            }, // x1, y1
            c2: {
                points: [[0, 100], [0, 0], [100, 0]],
                origin: [40, 40]
            },
            l1: {
                type: 'line',
                origin: [0, 0],
                end: [50, 50]
            }
        }
    };

    return model;

}

// send dxf data to server to write file
export function writeFile(exportedModel, fileName) {

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

// create SVG file and prepare for download:
export function downloadSVG(object, fileName) {

    object.scale(1 / raster.pxPerMM);
    if (!fileName)
        fileName = "snakeJS_export.svg" // TODO rename to project name

    var url = "data:image/svg+xml;utf8," + encodeURIComponent(object.exportSVG(
        {
            asString: true
        }
    ));

    var link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.click();

    object.scale(raster.pxPerMM);
}

// create SVG file of entire project and prepare for download:
export function downloadProjectSVG(event, fileName) {

    alert("Achtung: Gesamtprojekt (noch) nicht skalierbar!");

    if (!fileName)
        fileName = "snakeJS_export.svg"

    var url = "data:image/svg+xml;utf8," + encodeURIComponent(paper.project.exportSVG(
        {
            asString: true
        }
    ));

    var link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.click();
}

// create SVG file of entire project and prepare for download:
export function downloadProjectJSON(event, fileName) {

    if (!fileName)
        fileName = imageSettings.imageName.split('.')[0] + '.json';

    console.log(fileName);

    var url = "data:image/svg+xml;utf8," + encodeURIComponent(paper.project.exportJSON(
        {
            asString: true
        }
    ));

    var link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.click();
}

export function extractPathFromSheets() {
    for (var i = 0; i < sheetsGroup.children.length; i++) {
        if (raster.line.intersects(sheetsGroup.children[i])) {

            let newObj = raster.line.intersect(sheetsGroup.children[i], { trace: false }).removeOnMove();

            var joinedObj = new paper.CompoundPath({
                children: [
                    newObj, sheetsGroup.children[i].clone()
                ],
                strokeColor: paper.Color.random(),
                strokeWidth: 2
            }).removeOnMove();

            downloadSVG(joinedObj, `Platte_${sheetHelpers[i].label.content}.svg`)
        }
    }
}
