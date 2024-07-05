import { sheetsGroup, createSheetsHorizontal, createSheetsVertical, importSheets, calculateLeftovers } from "./Platten.js";
import { changeDrawMode } from "./Modes.js";
import { raster, imageFile, updateGlobalColors, globalColor } from "./paperSnake.js";

export var projectPath = "Example";
export function setProjectPath(newPath) { projectPath = newPath };

export function exportProject(event, fileName) {

    fileName = 'project.json'

    var projectExport = {
        globalColor: globalColor,
        imageFile: imageFile,
        raster: {
            roi: raster.roi ? raster.roi.exportJSON() : null,
            realSheetMargin: raster.realSheetMarginMin,
            realSheetV: raster.realSheetDimVertical,
            realSheetH: raster.realSheetDimHorizontal,
            lineSegmentsTypeHistory: raster.lineSegmentsTypeHistory,
            gridGapX: raster.gridGapX,
            gridGapY: raster.gridGapY,
            line: raster.line ? raster.line.exportJSON() : null,
            area: raster.area ? raster.area.exportJSON() : null,
            pxPerMM: raster.pxPerMM,
        },

        // sheetHelpers are dynamically created from sheetsGroup!
        sheetsGroup: sheetsGroup ? sheetsGroup.exportJSON() : null
    }

    projectExport = JSON.stringify(projectExport);
    const blob = new Blob([projectExport], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
}

export async function importProject(projectData) {
    console.log(`loading project from uploaded file`);

    // setImageFile(projectData.imageFile); // TODO: upload to server and reuse image
    raster.realSheetDimHorizontal = projectData.raster.realSheetH;
    raster.realSheetDimVertical = projectData.raster.realSheetV;
    raster.realSheetMarginMin = projectData.raster.realSheetMargin;

    raster.roi = new paper.Path().importJSON(projectData.raster.roi);
    raster.lineSegmentsTypeHistory = projectData.raster.lineSegmentsTypeHistory;
    raster.gridGapX = projectData.raster.gridGapX;
    raster.line = new paper.Path().importJSON(projectData.raster.line);
    raster.area = new paper.Group().importJSON(projectData.raster.area);
    raster.pxPerMM = projectData.raster.pxPerMM;

    // loadImage(); // TODO: this will overwrite the roi!
    raster.initialize(); // initialize line and area if not defined

    importSheets(projectData.sheetsGroup);

    updateGlobalColors(projectData.globalColor);
    calculateLeftovers();

    document.getElementById("button_line").classList.remove("inactive");
    changeDrawMode("line");

    // update input fields:
    // document.getElementById("text_imageFile").textContent = imageFile; // TODO: upload to server and reuse image
    document.getElementById("text_realSheetH").textContent = raster.realSheetDimHorizontal;
    document.getElementById("text_realSheetV").textContent = raster.realSheetDimVertical;

    let pathLength = raster.line.length / raster.pxPerMM / 1000;
    document.getElementById("pathLength").textContent = pathLength.toFixed(3);

}

export function initializeNewProject() {
    console.log("initialzing new project..");

    raster.initialize();

    if (raster.roi) {

        // platten erstellen:
        if (raster.realSheetDimHorizontal > raster.realSheetDimVertical)
            createSheetsHorizontal(
                raster.realSheetDimHorizontal * raster.pxPerMM,
                raster.realSheetDimVertical * raster.pxPerMM,
                raster.roi.bounds.height, raster.roi.bounds.width
            );
        else {
            createSheetsVertical(
                raster.realSheetDimHorizontal * raster.pxPerMM,
                raster.realSheetDimVertical * raster.pxPerMM,
                raster.roi.bounds.height, raster.roi.bounds.width
            );
        }
    }
    else {
        console.log("no ROI initialized. create one now!");
        changeDrawMode("ROI")
    }
}