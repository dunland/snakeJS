import { Raster } from "./Raster.js";
import { imageArea, raster, globalSheetLength, globalSheetWidth, globalGridSize } from "./paperSnake.js";

export var sheetHelpers = [];
export var activeSheet;
export function setActiveSheet(newSheet) { activeSheet = newSheet }
class SheetHelper {

    constructor(rectangleObject) {
        this.gridGapX = raster.gridSize;
        this.gridGapY = globalSheetWidth / Math.floor(globalSheetWidth / globalGridSize) * raster.scaleX;
        console.log(this.gridGapY);
        this.rectangleObject = rectangleObject;
        this.gridDots = new paper.Group();
        
    }

    createGridPoints(sheetLength, sheetWidth) {

        // TODO: change when rotate
        // var sheetWidth = this.rectangleObject.bounds.height;
        // var sheetLength = this.rectangleObject.bounds.width;

        for (let x = this.rectangleObject.position.x + this.gridGapX; x < this.rectangleObject.position.x + sheetLength; x += this.gridGapX) {
            for (let y = this.rectangleObject.position.y + this.gridGapY; y < this.rectangleObject.position.y + sheetWidth - this.gridGapY; y += this.gridGapY) {
                const pt = new paper.Point(x - sheetLength / 2, y - sheetWidth / 2);
                this.gridDots.addChild(new paper.Path.Circle({
                    center: pt,
                    radius: 1,
                    fillColor: 'white',
                    visible: false
                }));
            }
        }
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

    sheetsGroup = new paper.Group();
    for (var y = -1; y < (maxH + sheetWidth) / sheetWidth; y++)
        for (var x = -1; x < (maxW + sheetLength) / sheetLength; x++) {
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

    console.log(sheetsGroup.children.length, "sheets created with size", sheetsGroup.lastChild.bounds.size);
    console.log(sheetHelpers[sheetHelpers.length - 1].gridDots.children.length * sheetsGroup.children.length,  "gridDots erstellt mit gridSize", sheetHelpers[sheetHelpers.length - 1].gridGapX, sheetHelpers[sheetHelpers.length - 1].gridGapY);


    return sheetsGroup
}

// scale sheets, but do not remove or replace:
export function scaleSheets(sheetsGroup) {

    let previousSheetLength = sheetsGroup.children[0].bounds.width;
    console.log(previousSheetLength);
    var newSheetLength = globalSheetLength * raster.scaleX;
    var scaleBy = newSheetLength / previousSheetLength;
    console.log(scaleBy);

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