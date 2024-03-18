import { globalVerboseLevel } from "./Devtools.js";
import { raster, cursor, globalColor } from "./paperSnake.js";
import { createSheetsHorizontal, createSheetsVertical } from "./Platten.js";

export var drawMode = ""; // "line", "area", "ROI", "moveSheet", "measureDistance"


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
        if (raster.roi) raster.roi.strokeColor = null;
        cursor.strokeColor = 'blue';
    }
    else if (entering == "moveSheet")
        cursor.visible = false;

    // ------------------- leaving mode: -------------------
    if (leaving == "measureDistance") {
        if (measureDistance)
            measureDistance.remove();
        measureToolState = 0;
    }

    if (leaving == "area")
        if (!raster.tempArea || raster.tempArea.segments.length < 1)
            console.log("no segments in child");
        else {
            raster.area.addChild(raster.tempArea)
            raster.area.fillColor = new paper.Color(1, 0, 0, 0.45);
            raster.area.dashArray = null;
            raster.tempArea = new paper.Path();
            raster.tempArea.closed = true;
        }

    if (leaving == "ROI") {
        // cursor.strokeColor = globalColor;
        if (!raster.tempArea || raster.tempArea.segments.length < 1)
            console.log("no segments in child");
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
            }            // let bounds = new paper.Path.Rectangle(raster.roi.bounds);
            // bounds.strokeColor = 'red';
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