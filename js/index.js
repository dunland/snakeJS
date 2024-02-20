import { setRadius } from "./paperUtils.js";
import { cursor, raster } from "./paperSnake.js";
import { changeDrawMode, drawMode } from "./UserInteraction.js";

let buttonTool = document.getElementById("buttonTool");
buttonTool.onclick = function () {
    // toggle modes:
    Array.prototype.forEach.call(document.getElementsByClassName("tool"), (element) => {
        console.log(element);
        document.getElementById("buttonMeasureDistance").classList.remove("active");
    });
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
    raster.gridDots.forEach((gridPoint) => {
        // gridPoint.active = !gridPoint.active;
        // let scaling = gridPoint.active ? raster.rasterMass / 3 : 1;
        // setRadius(gridPoint, scaling);
    });

};

let buttonShowGrid = document.getElementById("buttonShowGrid");
buttonShowGrid.onclick = function (event) {
    raster.gridDots.forEach((dot) => {
        dot.visible = !dot.visible;
    });
    this.classList.toggle("active");
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