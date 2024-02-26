import { imageArea, raster, globalSheetLength, globalSheetWidth, globalGridSize, pxPerMM, sheetsGroup } from "./paperSnake.js";

export var sheetHelpers = [];
export var activeSheet,
    movableSheetsFrom = 0,
    movableSheetsTo,
    sheetsPerRow;
export var gridGapX, gridGapY;
export function setActiveSheet(newSheet) { activeSheet = newSheet }
class SheetHelper {

    constructor(rectangleObject) {
        this.gridGapX = raster.gridSize;
        this.gridGapY = globalSheetWidth / Math.floor(globalSheetWidth / globalGridSize) * raster.scaleX;
        this.rectangleObject = rectangleObject;
        this.gridDots = new paper.Group();
    }

    createGridPoints(sheetLength, sheetWidth) {

        // TODO: change when rotate
        // var sheetWidth = this.rectangleObject.bounds.height;
        // var sheetLength = this.rectangleObject.bounds.width;

        for (let x = this.rectangleObject.position.x + this.gridGapX; x < this.rectangleObject.position.x + sheetLength; x += this.gridGapX) {
            for (let y = this.rectangleObject.position.y + this.gridGapY; y < this.rectangleObject.position.y + sheetWidth; y += this.gridGapY) {
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

    showGridPoints() {
        this.gridDots.children.forEach(dot => {
            dot.visible = true;
        });
    }

    hideGridPoints() {
        this.gridDots.children.forEach(dot => {
            dot.visible = false;
        });
    }
}

export function createSheets(sheetLength, sheetWidth, maxH, maxW) {

    var sheetsGroup = new paper.Group();
    for (var y = -1; y < (maxH + sheetWidth) / sheetWidth; y++)
        for (var x = -1; x < (maxW + sheetLength) / sheetLength; x++) {
            sheetsGroup.addChild(new paper.Path.Rectangle({
                point: new paper.Point(x * sheetLength, y * sheetWidth),
                size: new paper.Size(sheetLength, sheetWidth),
                strokeColor: 'grey',
                strokeWidth: 1
            }));
            if (y % 2 == 0) {
                sheetsGroup.lastChild.position.x -= Math.floor(sheetLength / raster.gridSize);
                console.log(raster.gridSize, sheetLength);
            }
            sheetHelpers.push(new SheetHelper(sheetsGroup.lastChild));
            sheetHelpers[sheetHelpers.length - 1].createGridPoints(sheetLength, sheetWidth);
        }

    movableSheetsTo = Math.floor((maxW + sheetLength) / sheetLength) + 2;
    sheetsPerRow = Math.floor((maxH + sheetWidth) / sheetWidth);
    console.log(movableSheetsTo, sheetsPerRow);

    // style active rows:
    for (var i = movableSheetsFrom; i < movableSheetsTo; i++) {
        sheetsGroup.children[i].strokeWidth = 4;
    }

    console.log(sheetsGroup.children.length, "sheets created with size", sheetsGroup.lastChild.bounds.size);
    console.log(sheetHelpers[sheetHelpers.length - 1].gridDots.children.length * sheetsGroup.children.length, "gridDots erstellt mit gridSize", sheetHelpers[sheetHelpers.length - 1].gridGapX, sheetHelpers[sheetHelpers.length - 1].gridGapY);


    return sheetsGroup
}

// scale sheets and recreate dots:
export function scaleSheets(sheetsGroup) {

    let previousSheetLength = sheetsGroup.children[0].bounds.width;
    var newSheetLength = globalSheetLength * raster.scaleX;
    var scaleBy = newSheetLength / previousSheetLength;

    for (var i = 0; i < sheetsGroup.children.length; i++) {
        var child = sheetsGroup.children[i];

        child.scale(scaleBy, child.bounds.topLeft);
        child.position.x = child.position.x * scaleBy;
        child.position.y = child.position.y * scaleBy;

        if (!imageArea.bounds.intersects(sheetsGroup.children[i].bounds)) {
            sheetsGroup.children[i].fillColor = 'red';
        }

        // recreate gridDots:
        sheetHelpers[i].gridGapX = raster.gridSize;
        sheetHelpers[i].gridGapY = globalSheetWidth / Math.floor(globalSheetWidth / globalGridSize) * raster.scaleX;

        sheetHelpers[i].gridDots.removeChildren(); // TODO: funktioniert das?
        sheetHelpers[i].gridDots = new paper.Group();
        sheetHelpers[i].createGridPoints(globalSheetLength * raster.scaleX, globalSheetWidth * raster.scaleX);

        console.log(sheetHelpers[sheetHelpers.length - 1].gridDots.children.length * sheetsGroup.children.length, "gridDots erstellt mit gridSize", sheetHelpers[sheetHelpers.length - 1].gridGapX, sheetHelpers[sheetHelpers.length - 1].gridGapY);

    }
    console.log("scaled sheets. new size:", sheetsGroup.lastChild.bounds.size);
}

export function selectNextRow(sheetsGroup, direction) {
    movableSheetsFrom = (movableSheetsFrom + (sheetsPerRow * direction));
    movableSheetsTo = movableSheetsTo + (sheetsPerRow * direction);
    if (movableSheetsFrom < 0 || movableSheetsTo > sheetsGroup.children.length) {
        movableSheetsFrom = 0;
        movableSheetsTo = sheetsPerRow;
    }
    // style:
    sheetsGroup.strokeWidth = 1;
    sheetsGroup.strokeColor = 'grey';
    for (var i = movableSheetsFrom; i < movableSheetsTo; i++) {
        sheetsGroup.children[i].strokeWidth = 4;
    }
}

export function selectRowBySheet(index) {
    movableSheetsFrom = Math.floor(index / sheetsPerRow) * sheetsPerRow;
    movableSheetsTo = Math.floor(index / sheetsPerRow) * sheetsPerRow + sheetsPerRow;

    // style:
    sheetsGroup.strokeWidth = 1;
    sheetsGroup.strokeColor = 'grey';
    for (var i = movableSheetsFrom; i < movableSheetsTo; i++) {
        sheetsGroup.children[i].strokeWidth = 4;
    }

}