import { Raster } from "./Raster.js";
import { imageArea, raster, globalSheetLength, globalSheetWidth, globalGridSize } from "./paperSnake.js";

export var sheetHelpers = [];
class SheetHelper {

    constructor(rectangleObject) {
        this.gridSize = raster.gridSize;
        this.rectangleObject = rectangleObject;
        this.gridDots = new paper.Group();
        // this.raster = new Raster(rasterMass, scaleBy);
    }

    createGridPoints(sheetLength, sheetWidth) {

        // TODO: change when rotate
        // var sheetWidth = this.rectangleObject.bounds.height;
        // var sheetLength = this.rectangleObject.bounds.width;

        for (let x = this.rectangleObject.position.x + this.gridSize; x < this.rectangleObject.position.x + sheetLength - this.gridSize; x += this.gridSize) {
            for (let y = this.rectangleObject.position.y + this.gridSize; y < this.rectangleObject.position.y + sheetWidth - this.gridSize; y += this.gridSize) {
                const pt = new paper.Point(x - sheetLength / 2, y - sheetWidth / 2);
                this.gridDots.addChild(new paper.Path.Circle({
                    center: pt,
                    radius: 1,
                    fillColor: 'white',
                    visible: false
                }));
            }
        }
        console.log(`${this.gridDots.children.length} gridDots erstellt mit gridSize, ${this.gridSize}`);
    }

    showGridPoints(){
        this.gridDots.children.forEach(dot => {
            dot.visible = true;
        });
    }

    hideGridPoints(){
        this.gridDots.children.forEach(dot => {
            dot.visible = false;
        });
    }
}

export function createSheets(maxH, maxW, scaleBy) {

    var sheetLength = globalSheetLength * scaleBy;
    var sheetWidth = globalSheetWidth * scaleBy;

    var sheetsGroup = new paper.Group();
    for (var y = -1; y < (maxH+sheetWidth) / sheetWidth; y++)
        for (var x = -1; x < (maxW+sheetLength) / sheetLength; x++) {
            sheetsGroup.addChild(new paper.Path.Rectangle({
                point: new paper.Point(x * sheetLength, y * sheetWidth),
                size: new paper.Size(sheetLength, sheetWidth),
                strokeColor: 'red',
                strokeWidth: 2
            }));
            if (y % 2 == 0) {
                sheetsGroup.lastChild.position.x -= sheetLength / 2;
            }
            sheetHelpers.push(new SheetHelper(sheetsGroup.lastChild));
            sheetHelpers[sheetHelpers.length - 1].createGridPoints(sheetLength, sheetWidth);
        }
    sheetsGroup.strokeColor = 'grey';

    console.log(sheetsGroup.children.length, "sheets created with gridSize", sheetHelpers[sheetHelpers.length - 1].gridSize, "and size", sheetsGroup.lastChild.bounds.size);

    return sheetsGroup
}

// scale sheets, but do not remove or replace:
export function scaleSheets(sheetsGroup, scaleBy) {
    for (var i = 0; i < sheetsGroup.children.length; i++) {
        var child = sheetsGroup.children[i];

        child.scale(scaleBy, child.bounds.topLeft);
        child.position.x = child.position.x * scaleBy;
        child.position.y = child.position.y * scaleBy;

        if (!imageArea.bounds.intersects(sheetsGroup.children[i].bounds)) {
            sheetsGroup.children[i].fillColor = 'red';
        }
    }
    console.log("scaled sheets. new size:", sheetsGroup.lastChild.bounds.size);
}