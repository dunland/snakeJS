import { setRadius } from "./paperUtils.js";
import { raster } from "./paperSnake.js";

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