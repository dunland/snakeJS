import { setRadius } from "./paperUtils.js";
import { cursor, pxPerMM, raster, imageArea, sheetsGroup } from "./paperSnake.js";
import { changeDrawMode } from "./UserInteraction.js";

document.getElementById("buttonUndo").onclick = function () {
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

    raster.lineSegments.forEach((ls) => {
        ls.segment.visible = !ls.segment.visible;
    });

};

let buttonMeasureDistance = document.getElementById("buttonMeasureDistance");
document.getElementById("rasterScaleX").textContent = pxPerMM.toFixed(3);

buttonMeasureDistance.onclick = function (event) {
    // toggle modes:
    Array.prototype.forEach.call(document.getElementsByClassName("tool"), (element) => {
        console.log(element);
        element.classList.remove("active");
    });
    this.classList.toggle("active");

    changeDrawMode("measureDistance");
}

document.getElementById("buttonGetLeftovers").onclick = function (event) {
    let leftovers = 0;
    let sheets = 0;
    for (var i = 0; i < sheetsGroup.children.length; i++) {
        let child = sheetsGroup.children[i];
        if (imageArea.bounds.intersects(child.bounds)) {
            let tempObj = imageArea.exclude(sheetsGroup.children[i]).subtract(imageArea).removeOnMove();
            tempObj.fillColor = 'red';
            leftovers += tempObj.bounds.width * tempObj.bounds.height;
            sheets++;
        }
    }
    leftovers = leftovers * Math.pow(10, -6); // mm² to m²
    document.getElementById("leftovers").textContent = leftovers.toFixed(3)
    document.getElementById("sheets").textContent = sheets;
}