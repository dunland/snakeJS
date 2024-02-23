import { setRadius } from "./paperUtils.js";
import { cursor, raster } from "./paperSnake.js";
import { changeDrawMode, drawMode } from "./UserInteraction.js";

document.getElementById("buttonUndo").onclick = function(){
    if (raster.gridPoints.length < 1) return;
    
    raster.gridPoints[raster.gridPoints.length - 1].selected = false;
    setRadius(raster.gridPoints[raster.gridPoints.length - 1], 1.5); // size
    raster.gridPoints.pop();
    
    if (raster.line.children.length < 1) return;
    raster.line.lastChild.remove();
    raster.lineSegments.pop();
}

let buttonTool = document.getElementById("buttonTool");
buttonTool.onclick = function () {
    // toggle modes:
    document.getElementById("buttonMeasureDistance").classList.remove("active"); // force measureTool off
    this.classList.toggle("active");

    if (buttonTool.textContent.includes("line")) {
        buttonTool.textContent = ("draw area");
        changeDrawMode("area");
        cursor.strokeColor = 'red';
    }
    else if (buttonTool.textContent.includes("area")) {
        buttonTool.textContent = ("draw line");
        changeDrawMode("line");
        cursor.strokeColor = 'white';
    }
}

let buttonShowPath = document.getElementById("buttonShowPath");

buttonShowPath.onclick = function (event) {
    this.classList.toggle("active");

    raster.liniensegmente.forEach((ls) => {
        ls.segment.visible = !ls.segment.visible;
    });
    raster.gridCirclePaths.forEach((gridPoint) => {
        // gridPoint.active = !gridPoint.active;
        // let scaling = gridPoint.active ? raster.rasterMass / 3 : 1;
        // setRadius(gridPoint, scaling);
    });

};

let buttonMeasureDistance = document.getElementById("buttonMeasureDistance");
buttonMeasureDistance.onclick = function (event) {
    // toggle modes:
    Array.prototype.forEach.call(document.getElementsByClassName("tool"), (element) => {
        console.log(element);
        element.classList.remove("active");
    });
    this.classList.toggle("active");

    changeDrawMode("measureDistance");
}