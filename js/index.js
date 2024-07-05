// JavaScript for the page html setup

import { image, setImageFile, loadImage, raster, updateGlobalColors } from "./paperSnake.js";
import { changeDrawMode } from "./Modes.js";
import { calculateLeftovers, recreateSheets, scaleSheets, sheetHelpers, toggleSheetVisibility } from "./Platten.js";
import { downloadProjectSVG, extractPathFromSheets } from "./lineExport.js";
import { exportProject, importProject } from "./ProjectManager.js";
import { toggleSupportLines } from "./UserInteraction.js";
import { changeCursor } from "./paperSnake.js";

document.title = 'Wandwurm.fun';

// undo line:
document.getElementById("buttonUndo").onclick = function () {
    console.log(raster.line.segments.length);
    if (raster.line.segments.length < 1) return;
    raster.line.selected = false;
    raster.line.lastSegment.remove();
    raster.lineSegmentsTypeHistory.pop();

    for (let index = 0; index < sheetHelpers.length; index++) {
        const sheet = sheetHelpers[index];
        sheet.gridDots.selected = false;
    }

    raster.updatePathLength();
}

// stepwise scaling:
document.getElementById("button_scaleStepUp").onclick = () => {
    raster.pxPerMM += 0.001;
    scaleSheets();
}
document.getElementById("button_scaleStepDown").onclick = () => {
    raster.pxPerMM -= 0.001;
    scaleSheets();
}

// undo area:
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
            console.log("button inactive! ROI defined?", raster.roi);
        }
    });
});

// measuring tool:
document.getElementById('button_measureDiagonal').onclick = function (event) {
    let snakeCanvas = document.getElementById("snakeCanvas");
    let diagonalDistance = new paper.Path.Line({
        from: [0, Math.min(snakeCanvas.clientHeight, image.height)],
        to: [Math.min(snakeCanvas.clientWidth, image.width), 0],
        strokeColor: 'yellow'
    }).removeOnMove();
    // new paper.PointText([snakeCanvas.clientHeight / 2, snakeCanvas.clientHeight / 2], diagonalDistance.length);
    let userInput = prompt(`${Math.floor(diagonalDistance.length)} pixel gemessen. Wie viel mm?`);
    raster.pxPerMM = userInput == null ? raster.pxPerMM : diagonalDistance.length / userInput;
    raster.recalculateGridGap();
    document.getElementById("rasterPxPerMM").textContent = raster.pxPerMM.toFixed(3);
    console.log("diagonal distance in px:", diagonalDistance.length);
    changeCursor(raster.gridGapX * raster.pxPerMM / 2);
    scaleSheets();
    changeDrawMode('line');
}

// toggle visibility:
document.getElementById("buttonShowPath").onclick = function (event) {
    this.classList.toggle("active");
    raster.line.visible = !raster.line.visible;
};

document.getElementById("buttonShowSupportLines").onclick = toggleSupportLines;

document.getElementById("buttonShowSheets").onclick = toggleSheetVisibility;

document.getElementById("buttonGetLeftovers").onclick = calculateLeftovers;
document.getElementById("buttonRecreateSheets").onclick = recreateSheets;

document.getElementById("colorPicker").onchange = () => {

    let color = document.getElementById("colorPicker").value;
    updateGlobalColors(color);
}

document.getElementById("buttonSaveProject").onclick = exportProject;
document.getElementById("buttonExportEntirePath").onclick = () => {
    // FIXME: svgs haben keinen <svg> header. Für gimp muss die struktur wie folgt sein:
    /* <svg>
        <path d="M0 0 L50 50" stroke="black" stroke-width="1" fill="none" />
    </svg> */
    // Außerdem wird nie der gesamte Pfad exportiert!
    // downloadSVG(raster.line);
    alert("Dieser Button muss noch gefixt werden!")
};
document.getElementById("buttonExportEntireProject").onclick = downloadProjectSVG;
document.getElementById("buttonExportPathPerSheet").onclick = extractPathFromSheets;

// upload image file:
document.querySelector("#input_imageFile").addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const fileReader = new FileReader();
        fileReader.onload = function (e) {
            const uploadedImage = new Image();
            uploadedImage.onload = function () {
                const canvasElement = document.getElementById('snakeCanvas');
                canvasElement.style.backgroundImage = `url(${uploadedImage})`;
                console.log(`url(${uploadedImage})`);
            };
            uploadedImage.src = e.target.result;
            console.log(e.target.result);
            setImageFile(e.target.result);
            loadImage();
        }
        fileReader.readAsDataURL(file);
    }
});

// upload project json:
document.querySelector("#input_projectFile").addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const jsonData = JSON.parse(e.target.result);
                console.log(jsonData);
                importProject(jsonData);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                alert('Invalid JSON file');
            }
        };
        reader.readAsText(file);
    }
});

// submit input:
const inputVariables = ["realSheetH", "realSheetV", "realSheetMargin"];
inputVariables.forEach(name => {
    document.getElementById(`button_${name}`).onclick = () => {
        const value = document.getElementById(`input_${name}`).value;
        if (value) {
            document.getElementById(`text_${name}`).textContent = value;
            if (name == 'realSheetH') {
                raster.realSheetDimHorizontal = parseInt(value);
                raster.recalculateGridGap();
                recreateSheets();
            }
            if (name == 'realSheetV') {
                raster.realSheetDimVertical = parseInt(value);
                raster.recalculateGridGap();
                recreateSheets();
            }
            if (name == 'realSheetMargin') {
                raster.realSheetMarginMin = value;
                raster.recalculateGridGap();
                recreateSheets();
            }
        }
        document.querySelector('#snakeCanvas').focus();
    };
});

document.getElementById("rasterPxPerMM").textContent = raster.pxPerMM.toFixed(3);