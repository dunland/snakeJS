import { setRadius } from "./paperUtils.js";
import { cursor, pxPerMM, raster, imageArea } from "./paperSnake.js";
import { changeDrawMode, drawMode } from "./UserInteraction.js";
import { sheetsGroup, toggleSheetVisibility } from "./Platten.js";
import { downloadSVG, downloadProjectSVG, extractPathFromSheets } from "./lineExport.js";
import { exportProject } from "./ProjectManager.js";

document.getElementById("buttonUndo").onclick = function () {
    if (raster.gridPoints.length < 1) return;

    raster.gridPoints[raster.gridPoints.length - 1].selected = false;
    setRadius(raster.gridPoints[raster.gridPoints.length - 1], 1.5); // size
    raster.gridPoints.pop();

    if (raster.line.segments.length < 1) return;
    raster.line.lastSegment.remove();
    raster.lineSegmentsTypeHistory.pop();
}

let buttonDrawTool = document.getElementById("buttonDrawTool");
buttonDrawTool.onmouseenter = () => {
    if (drawMode == "line") {
        buttonDrawTool.textContent = ("draw area");
    }
    else if (drawMode == "area") {
        buttonDrawTool.textContent = ("draw line");
    }
}
buttonDrawTool.onmouseleave = () => {
    if (drawMode == "line") {
        buttonDrawTool.textContent = ("draw line");
    }
    else if (drawMode == "area") {
        buttonDrawTool.textContent = ("draw area");
    }
}

buttonDrawTool.onclick = function () {
    // toggle modes:
    document.getElementById("buttonMeasureDistance").classList.remove("active"); // force measureTool off
    this.classList.toggle("active");

    if (drawMode == "line") {
        changeDrawMode("area");
        cursor.strokeColor = 'red';
    }
    else if (drawMode == "area") {
        changeDrawMode("line");
        cursor.strokeColor = 'white';
    }
}

document.getElementById("buttonShowPath").onclick = function (event) {
    this.classList.toggle("active");
    raster.line.visible = !raster.line.visible;
};

document.getElementById("buttonShowSheets").onclick = toggleSheetVisibility;

let buttonMeasureDistance = document.getElementById("buttonMeasureDistance");
document.getElementById("rasterScaleX").textContent = pxPerMM.toFixed(3);

buttonMeasureDistance.onclick = function (event) {
    // toggle modes:
    Array.prototype.forEach.call(document.getElementsByClassName("tool"), (element) => {
        console.log(element);
        element.classList.remove("active");
    });
    this.classList.toggle("active");

    changeDrawMode("measureDistance");
}

document.getElementById("buttonGetLeftovers").onclick = function (event) {
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
}

// document.getElementById("buttonSaveProjectJSON").onclick = {paper.project.exportJSON()};
document.getElementById("buttonSaveProject").onclick = exportProject;
document.getElementById("buttonLoadProject").onclick = () => {
    // paper.project.importJSON("../file.json");
    
};
document.getElementById("buttonExportEntirePath").onclick = () => downloadSVG(raster.line);
document.getElementById("buttonExportEntireProject").onclick = downloadProjectSVG;
document.getElementById("buttonExportPathPerSheet").onclick = extractPathFromSheets;