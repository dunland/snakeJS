import { globalVerboseLevel } from "./Devtools.js";
import { raster, cursor, globalColor } from "./paperSnake.js";
import { createSheetsHorizontal, createSheetsVertical, recreateSheets, sheetsGroup } from "./Platten.js";
import { showSupportLines } from "./UserInteraction.js";

export var drawMode = ""; // "line", "area", "ROI", "moveSheet", "measureDistance"
export var measureDistance;
export var measureToolState = 0;
export function setMeasureState(value) { measureToolState = value; }
export function setMeasureDist(value) { measureDistance = value; }

export function changeDrawMode(entering) {
    var leaving = drawMode;
    if (leaving == entering) return;

    if (globalVerboseLevel > 2)
        console.log(leaving, ">>", entering);

    // ------------------ entering mode: ------------------
    if (entering == "area")
        cursor.strokeColor = 'red';
    else if (entering == "line") {
        cursor.strokeColor = globalColor;
    }
    else if (entering == "ROI") {
        if (raster.roi) raster.roi.visible = false;
        cursor.strokeColor = 'blue';
    }
    else if (entering == "moveSheet"){
        cursor.visible = false;
        raster.nextLine.segment.visible = false;
    }

    // ------------------- leaving mode: -------------------
    if (leaving == "measureDistance") {
        if (measureDistance)
            measureDistance.remove();
        measureToolState = 0;
    }

    else if (leaving == "moveSheet"){
        raster.nextLine.segment.visible = showSupportLines;
    }

    else if (leaving == "area")
        if (!raster.tempArea || raster.tempArea.segments.length < 1)
            console.log("no segments in child");
        else {
            raster.area.addChild(raster.tempArea)
            raster.area.fillColor = new paper.Color(1, 0, 0, 0.45);
            raster.area.dashArray = null;
            raster.tempArea = new paper.Path();
            raster.tempArea.closed = true;
        }

    else if (leaving == "ROI") {
        // after abort:
        if (!raster.tempArea || raster.tempArea.segments.length < 1){
            console.log("no segments in child");
            raster.roi.visible = true;
        }
        else {
            if (raster.roi) {
                console.log(raster.roi.remove());
            }
            raster.roi = raster.tempArea.clone();
            raster.roi.strokeColor = 'blue';
            raster.roi.dashArray = null;
            raster.tempArea.remove();
            raster.tempArea = new paper.Path();
            raster.tempArea.closed = true;
            document.getElementById('button_line').classList.remove('inactive');

            if (sheetsGroup)
                recreateSheets();
            else {
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

        }
    }

    if (document.getElementById(`button_${entering}`))
        document.getElementById(`button_${entering}`).classList.add('active'); // activate only this
    if (document.getElementById(`button_${leaving}`))
        document.getElementById(`button_${leaving}`).classList.remove('active'); // activate only this
    if (document.getElementsByClassName(`tooltips ${leaving}`)[0]) {
        document.getElementsByClassName(`tooltips ${leaving}`)[0].classList.add('hidden');
    }
    if (document.getElementsByClassName(`tooltips ${entering}`)[0]) {
        document.getElementsByClassName(`tooltips ${entering}`)[0].classList.remove('hidden');
    }
    drawMode = entering;
}