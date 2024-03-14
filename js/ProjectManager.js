import { sheetsGroup, createSheetsHorizontal, createSheetsVertical, importSheets, calculateLeftovers } from "./Platten.js";
import { changeDrawMode } from "./UserInteraction.js";
import { raster, loadImage, imageFile, importImageFile, updateGlobalColors, globalColor } from "./paperSnake.js";

export var projectPath = "Example";
export function setProjectPath(newPath) { projectPath = newPath };

export function exportProject(event, fileName) {

    fileName = 'project.json'

    var projectExport = {
        globalColor: globalColor,
        imageFile: document.getElementById("text_imageFile").textContent,
        raster: {
            roi: raster.roi.exportJSON(),
            realSheetMargin: raster.realSheetMargin,
            realSheetV: raster.realSheetV,
            realSheetH: raster.realSheetH,
            lineSegmentsTypeHistory: raster.lineSegmentsTypeHistory,
            gridGapX: raster.gridGapX,
            line: raster.line.exportJSON(),
            area: raster.area.exportJSON(),
            pxPerMM: raster.pxPerMM,
        },

        // sheetHelpers are dynamically created from sheetsGroup!
        sheetsGroup: sheetsGroup.exportJSON()
    }

    projectExport = JSON.stringify(projectExport);
    const blob = new Blob([projectExport], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
}

export async function importProject(projectDataFile) {
    let newProject = false;
    console.log(`loading project from ${projectDataFile}`);

    const response = await fetch(projectDataFile)
        .then(response => response.json())
        .then(projectData => {

            importImageFile(projectData.imageFile);
            raster.realSheetH = projectData.raster.realSheetH;
            raster.realSheetV = projectData.raster.realSheetV;
            raster.realSheetMargin = projectData.raster.realSheetMargin;

            raster.roi = new paper.Path().importJSON(projectData.raster.roi),
                raster.lineSegmentsTypeHistory = projectData.raster.lineSegmentsTypeHistory
            raster.gridGapX = projectData.raster.gridGapX;
            raster.line = new paper.Path().importJSON(projectData.raster.line);
            raster.area = new paper.Group().importJSON(projectData.raster.area);
            raster.pxPerMM = projectData.raster.pxPerMM;

            loadImage(); // TODO: this will overwrite the roi!
            raster.initialize(); // initialize line and area if not defined

            importSheets(projectData.sheetsGroup);
            // platten erstellen:
            if (raster.realSheetH > raster.realSheetV)
                createSheetsHorizontal(
                    raster.realSheetH * raster.pxPerMM,
                    raster.realSheetV * raster.pxPerMM,
                    raster.roi.bounds.height, raster.roi.bounds.width
                );
            else {
                createSheetsVertical(
                    raster.realSheetH * raster.pxPerMM,
                    raster.realSheetV * raster.pxPerMM,
                    raster.roi.bounds.height, raster.roi.bounds.width
                );
            }
            updateGlobalColors(projectData.globalColor);
            calculateLeftovers();

            // update input fields:
            document.getElementById("text_imageFile").textContent = imageFile;
            document.getElementById("text_realSheetH").textContent = raster.realSheetH;
            document.getElementById("text_realSheetV").textContent = raster.realSheetV;

            let pathLength = raster.line.length / raster.pxPerMM / 1000;
            document.getElementById("pathLength").textContent = pathLength.toFixed(3);

        }).catch(error => {
            console.error("Error fetching project data:", error);
        })
    return false;
}

export function initializeNewProject() {
    console.log("initialzing new project..");

    raster.initialize();

    if (raster.roi){

        // platten erstellen:
        if (raster.realSheetH > raster.realSheetV)
        createSheetsHorizontal(
    raster.realSheetH * raster.pxPerMM,
    raster.realSheetV * raster.pxPerMM,
    raster.roi.bounds.height, raster.roi.bounds.width
    );
    else {
        createSheetsVertical(
            raster.realSheetH * raster.pxPerMM,
            raster.realSheetV * raster.pxPerMM,
            raster.roi.bounds.height, raster.roi.bounds.width
            );
        }
    }
    else {
        console.log("no ROI initialized. create one now!");
        changeDrawMode("ROI")
    }
}