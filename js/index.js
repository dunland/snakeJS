import { imageFile, importImageFile, loadImage, raster, updateGlobalColors } from "./paperSnake.js";
import { changeDrawMode } from "./UserInteraction.js";
import { calculateLeftovers, recreateSheets, sheetHelpers, sheetsGroup, toggleSheetVisibility } from "./Platten.js";
import { downloadSVG, downloadProjectSVG, extractPathFromSheets } from "./lineExport.js";
import { exportProject } from "./ProjectManager.js";

// undo line:
document.getElementById("buttonUndo").onclick = function () {

    if (raster.line.segments.length < 1) return;
    raster.line.selected = false;
    raster.line.lastSegment.remove();
    raster.lineSegmentsTypeHistory.pop();

    for (let index = 0; index < sheetHelpers.length; index++) {
        const sheet = sheetHelpers[index];
        sheet.gridDots.selected = false;
    }
}

document.getElementById("buttonUndoArea").onclick = function () {
    if (raster.area.children.length < 1) return;

    raster.area.lastChild.remove();
}

// toggle modes via tool buttons:
let buttons = document.querySelectorAll(".tool");
buttons.forEach(button => {
    button.addEventListener("click", function () { // onclick
        buttons.forEach(element => {
            if (!element.classList.contains('inactive'))
                element.classList.remove("active"); // deactivate all
        })
        if (!this.classList.contains('inactive')) {
            let mode = this.id.slice(7);
            changeDrawMode(mode);
        }
        else {
            console.log("button inactive! ROI defined?");
        }
    });
});

document.getElementById('button_measureDiagonal').onclick = function (event) {
    let snakeCanvas = document.getElementById("snakeCanvas");
    let diagonalDistance = new paper.Path.Line({
        from: [0, snakeCanvas.clientHeight],
        to: [snakeCanvas.clientWidth, 0],
        strokeColor: 'yellow'
    }).removeOnMove();
    // new paper.PointText([snakeCanvas.clientHeight / 2, snakeCanvas.clientHeight / 2], diagonalDistance.length);
    raster.pxPerMM = diagonalDistance.length / Math.sqrt(Math.pow(snakeCanvas.clientWidth, 2), Math.pow(snakeCanvas.clientHeight, 2));
    raster.gridGapX = raster.realSheetMargin * raster.pxPerMM;
    document.getElementById("rasterPxPerMM").textContent = raster.pxPerMM.toFixed(3);
    console.log("diagonal distance in px:", diagonalDistance.length);

}

document.getElementById("buttonShowPath").onclick = function (event) {
    this.classList.toggle("active");
    raster.line.visible = !raster.line.visible;
};

document.getElementById("buttonShowSheets").onclick = toggleSheetVisibility;

document.getElementById("rasterPxPerMM").textContent = raster.pxPerMM.toFixed(3);

document.getElementById("buttonGetLeftovers").onclick = calculateLeftovers;
document.getElementById("buttonRecreateSheets").onclick = recreateSheets;

document.getElementById("colorPicker").onchange = () => {

    let color = document.getElementById("colorPicker").value;
    updateGlobalColors(color);
}

document.getElementById("buttonSaveProject").onclick = exportProject;
document.getElementById("buttonExportEntirePath").onclick = () => downloadSVG(raster.line);
document.getElementById("buttonExportEntireProject").onclick = downloadProjectSVG;
document.getElementById("buttonExportPathPerSheet").onclick = extractPathFromSheets;

const inputVariables = ["imageFile", "realSheetH", "realSheetV", "realSheetMargin"];
inputVariables.forEach(name => {
    document.getElementById(`button_${name}`).onclick = () => {
        const value = document.getElementById(`input_${name}`).value;
        if (value) {
            document.getElementById(`text_${name}`).textContent = value;
            if (name == 'imageFile') {
                importImageFile(value);
                loadImage();
            }
            if (name == 'realSheetH') {
                raster.realSheetH = value;
                recreateSheets();
            }
            if (name == 'realSheetV') {
                raster.realSheetV = value;
                recreateSheets();
            }
            if (name == 'realSheetMargin') raster.realSheetMargin = value;
        }
    };
});