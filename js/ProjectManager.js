import { sheetsGroup, createSheets, createSheetHelpers, importSheets } from "./Platten.js";
import { raster, realSheetLength, realSheetWidth, image, loadImage, realGridSize, imageFile, importSheetLength, importSheetWidth, importGridSize, importImageFile, pxPerMM } from "./paperSnake.js";

export var projectPath = "Example";
export function setProjectPath(newPath) { projectPath = newPath };

export function exportProject(event, fileName) {

    fileName = 'project.json'

    var projectExport = {
        roi: roi.exportJSON(),
        globalColor: globalColor,
        realSheetLength: realSheetLength,
        realSheetWidth: realSheetWidth,
        realGridSize: realGridSize,
        imageFile: imageFile,
        raster: {
            lineSegmentsTypeHistory: raster.lineSegmentsTypeHistory,
            gridGapX: raster.gridGapX,
            line: raster.line.exportJSON(),
            area: raster.area.exportJSON(),
            scaleX: raster.scaleX,
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
            importSheetLength(projectData.realSheetLength);
            importSheetWidth(projectData.realSheetWidth);
            importGridSize(projectData.realGridSize);
            loadImage();

            if (projectData.newProject) {
                newProject = true;
                initializeNewProject();
                return true;
            }

            console.log(`importing project from ${projectDataFile}`);
            updateGlobalColors(projectData.globalColor);

            roi = projectData.roi,
            raster.lineSegmentsTypeHistory = projectData.raster.lineSegmentsTypeHistory;
            raster.gridGapX = projectData.raster.gridGapX;
            raster.line = new paper.Path().importJSON(projectData.raster.line);
            raster.area = new paper.Group().importJSON(projectData.raster.area);
            raster.scaleX = projectData.raster.scaleX;

            importSheets(projectData.sheetsGroup);
            createSheetHelpers(
                realSheetLength * raster.scaleX,
                realSheetWidth * raster.scaleX,
                image.height, image.width
            );
        }).catch(error => {
            console.error("Error fetching project data:", error);
        })
    return false;
}

export function initializeNewProject() {
    console.log("initialzing new project..");

    raster.initialize();

    // platten erstellen:
    createSheets(
        realSheetLength * pxPerMM,
        realSheetWidth * pxPerMM,
        image.height, image.width
    );
    createSheetHelpers(
        realSheetLength * pxPerMM,
        realSheetWidth * pxPerMM,
        image.height, image.width
    );
}