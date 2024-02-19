import { setRadius } from "./paperUtils.js";
import { raster } from "./paperSnake.js";
import { changeDrawMode } from "./UserInteraction.js";

let buttonTool = document.getElementById("buttonTool");
buttonTool.onclick = function () {

    if (buttonTool.textContent.includes("line")) {
        buttonTool.textContent = ("draw area");
        changeDrawMode("area");
    }
    else if (buttonTool.textContent.includes("area")) {
        buttonTool.textContent = ("draw line");
        changeDrawMode("line");
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