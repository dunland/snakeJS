import imageSettings from "../settings.json" assert { type: 'json' };
import { sheetsGroup, createSheetHelpers, importSheets } from "./Platten.js";
import { raster, realSheetLength, realSheetWidth, image } from "./paperSnake.js";

export var projectName;
export function setProjectName(newPath) {projectName = newPath};

export function exportProject(event, fileName) {

    if (!fileName)
        fileName = imageSettings.imageName.split('.')[0] + '.json';

    var projectExport = {
        raster: {
            gridPoints: raster.gridPoints, // TODO: this is a list if point objects!
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

export function importProject(projectDataFile) {
    console.log("import from", projectDataFile);

    fetch(projectDataFile)
        .then(response => response.json())
        // .then(console.log(response))
        .then(projectData => {
            raster.gridPoints = projectData.raster.gridPoints;
            raster.lineSegmentsTypeHistory = projectData.raster.lineSegmentsTypeHistory;
            raster.gridGapX = projectData.raster.gridGapX;
            raster.line = new paper.Path().importJSON(projectData.raster.line);
            raster.area = new paper.Path().importJSON(projectData.raster.area);
            raster.scaleX = projectData.raster.scaleX;

            importSheets(projectData.sheetsGroup);
            createSheetHelpers(
                realSheetLength * raster.scaleX,
                realSheetWidth * raster.scaleX,
                image.height, image.width
            );
            })

}