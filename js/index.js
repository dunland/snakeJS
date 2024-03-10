import { imageFile, importImageFile, raster, updateGlobalColors } from "./paperSnake.js";
import { changeDrawMode } from "./UserInteraction.js";
import { calculateLeftovers, recreateSheets, sheetHelpers, sheetsGroup, toggleSheetVisibility } from "./Platten.js";
import { downloadSVG, downloadProjectSVG, extractPathFromSheets } from "./lineExport.js";
import { exportProject } from "./ProjectManager.js";

document.getElementById("buttonUndo").onclick = function () {

    if (raster.line.segments.length < 1) return;
    raster.line.selected = false;
    raster.line.lastSegment.remove();
    raster.lineSegmentsTypeHistory.pop();

    for (let index = 0; index < sheetHelpers.length; index++) {
        const sheet = sheetHelpers[index];
        sheet.gridDots.selected = false;
        // for (let d = 0; d < sheet.gridDots.children.length; d++) {
        //     const dot = sheet.gridDots.children[d];
        //     dot.selected = false;
        // console.log(dot);
        // for (let s = 0; s < raster.line.segments.length; s++) {
        //     const seg = raster.line.segments[s];
        //     console.log(seg.point, dot.point);
        //     if (seg.point.equals(dot.point)){
        //         dot.selected = true;
        //     }
        // }
        // }
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
            element.classList.remove("active"); // deactivate all
        })
        this.classList.add('active'); // activate only this
        let mode = this.id.slice(7);
        changeDrawMode(mode);
    });
});

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

const inputVariables = ["imageFile", "realSheetLength", "realSheetWidth", "realSheetMargin"];
inputVariables.forEach(name => {
    document.getElementById(`button_${name}`).onclick = () => {
        const value = document.getElementById(`input_${name}`).value;
        if (value){
            document.getElementById(`text_${name}`).textContent = value;
            if (name == 'imageFile') importImageFile(value);
            if (name == 'realSheetLength') raster.realSheetLength = value;
            if (name == 'realSheetWidth') raster.realSheetWidth = value;
            if (name == 'realSheetMargin') raster.realSheetMargin = value;
        }
    };
});