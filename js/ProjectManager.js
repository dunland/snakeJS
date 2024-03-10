import { sheetsGroup, createSheets, createSheetHelpers, importSheets, calculateLeftovers } from "./Platten.js";
import { raster, loadImage, imageFile, importImageFile, updateGlobalColors, globalColor } from "./paperSnake.js";

export var projectPath = "Example";
export function setProjectPath(newPath) { projectPath = newPath };

export function exportProject(event, fileName) {

    fileName = 'project.json'

    var projectExport = {
        globalColor: globalColor,
        imageFile: imageFile,
        raster: {
            roi: raster.roi.exportJSON(),
            realSheetMargin: raster.realSheetMargin,
            realSheetWidth: raster.realSheetWidth,
            realSheetLength: raster.realSheetLength,
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
            raster.realSheetLength = projectData.raster.realSheetLength;
            raster.realSheetWidth = projectData.raster.realSheetWidth;
            raster.realSheetMargin = projectData.raster.realSheetMargin;
            
            raster.roi = new paper.Path().importJSON(projectData.raster.roi),
            raster.lineSegmentsTypeHistory = projectData.raster.lineSegmentsTypeHistory
            raster.gridGapX = projectData.raster.gridGapX;
            raster.line = new paper.Path().importJSON(projectData.raster.line);
            raster.area = new paper.Group().importJSON(projectData.raster.area);
            raster.pxPerMM = projectData.raster.pxPerMM;
            
            raster.roi.remove()
            loadImage(); // TODO: this will overwrite the roi!
            raster.initialize(); // initialize line and area if not defined

            importSheets(projectData.sheetsGroup);
            createSheetHelpers(
                raster.realSheetLength * raster.pxPerMM,
                raster.realSheetWidth * raster.pxPerMM,
                raster.roi.bounds.height, raster.roi.bounds.width
            );
            updateGlobalColors(projectData.globalColor);
            calculateLeftovers();

            // update input fields:
            document.getElementById("text_imageFile").textContent = imageFile;
            document.getElementById("text_realSheetLength").textContent = raster.realSheetLength;
            document.getElementById("text_realSheetWidth").textContent = raster.realSheetWidth;

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

    // platten erstellen:
    createSheets(
        raster.realSheetLength * raster.pxPerMM,
        raster.realSheetWidth * raster.pxPerMM,
        raster.roi.bounds.height, raster.roi.bounds.width
    );
    createSheetHelpers(
        raster.realSheetLength * raster.pxPerMM,
        raster.realSheetWidth * raster.pxPerMM,
        raster.roi.bounds.height, raster.roi.bounds.width
    );
}