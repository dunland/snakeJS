import { imageArea, raster, realSheetLength, realSheetWidth, realGridSize } from "./paperSnake.js";

export var sheetsGroup;
export var sheetHelpers = [];
export var activeSheet,
    movableSheetsFrom = 0,
    movableSheetsTo,
    sheetsPerRow;
export var gridGapX, gridGapY;
export function setActiveSheet(newSheet) { activeSheet = newSheet }
class SheetHelper {

    constructor(rectangleObject) {
        this.gridGapX = raster.gridGapX;
        this.gridGapY = realSheetWidth / Math.floor(realSheetWidth / realGridSize) * raster.scaleX;
        this.rectangleObject = rectangleObject;
        this.gridDots = new paper.Group();
    }

    createGridPoints() {

        // TODO: change when rotate
        var sheetWidth = this.rectangleObject.bounds.height;
        var sheetLength = this.rectangleObject.bounds.width;

        for (let x = this.rectangleObject.position.x; x < this.rectangleObject.position.x + sheetLength + this.gridGapX; x += this.gridGapX) {
            for (let y = this.rectangleObject.position.y; y < this.rectangleObject.position.y + sheetWidth + this.gridGapY; y += this.gridGapY) {
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

export function importSheets(JSONdata) { sheetsGroup = new paper.Group().importJSON(JSONdata); }

export function createSheets(sheetLength, sheetWidth, maxH, maxW) {

    var sheets = new paper.Group();
    for (var y = -1; y < (maxH + sheetWidth) / sheetWidth; y++)
        for (var x = -1; x < (maxW + sheetLength) / sheetLength; x++) {
            sheets.addChild(new paper.Path.Rectangle({
                point: new paper.Point(x * sheetLength, y * sheetWidth),
                size: new paper.Size(sheetLength, sheetWidth),
                strokeColor: 'grey',
                strokeWidth: 1
            }));
            if (y % 2 == 0) {
                sheets.lastChild.position.x -= Math.floor(sheetLength / raster.gridGapX);
                console.log(raster.gridGapX, sheetLength);
            }
            // sheetHelpers.push(new SheetHelper(sheetsGroup.lastChild));
            // sheetHelpers[sheetHelpers.length - 1].createGridPoints();
            // sheetHelpers[sheetHelpers.length - 1].label = new paper.PointText([sheetsGroup.lastChild.bounds.topLeft.x + 20, sheetsGroup.lastChild.bounds.topLeft.y + 20]);
            // sheetHelpers[sheetHelpers.length - 1].label.strokeColor = 'white'
            // sheetHelpers[sheetHelpers.length - 1].label.content = `${y + 2}.${x + 2}`;
        }

    movableSheetsTo = Math.floor((maxW + sheetLength) / sheetLength) + 2;
    sheetsPerRow = Math.floor((maxH + sheetWidth) / sheetWidth);
    console.log(movableSheetsTo, sheetsPerRow);

    // style active rows:
    for (var i = movableSheetsFrom; i < movableSheetsTo; i++) {
        sheets.children[i].strokeWidth = 4;
    }

    console.log(sheets.children.length, "sheets created with size", sheets.lastChild.bounds.size);

    sheetsGroup = sheets;
}

export function createSheetHelpers(sheetLength, sheetWidth, maxH, maxW) {

    console.log(sheetLength, sheetWidth, maxH, maxW);
    let index = 0;
    for (var y = -1; y < (maxH + sheetWidth) / sheetWidth; y++)
        for (var x = -1; x < (maxW + sheetLength) / sheetLength; x++) {
            sheetHelpers.push(new SheetHelper(sheetsGroup.children[index]));
            sheetHelpers[sheetHelpers.length - 1].createGridPoints();
            sheetHelpers[sheetHelpers.length - 1].label = new paper.PointText([sheetsGroup.lastChild.bounds.topLeft.x + sheetHelpers[sheetHelpers.length - 1].gridGapX, sheetsGroup.children[index].bounds.topLeft.y + sheetHelpers[sheetHelpers.length - 1].gridGapY * 2]);
            sheetHelpers[sheetHelpers.length - 1].label.content = `${y + 2
                }.${x + 2} `;
            index++;
        }
    console.log(sheetHelpers[sheetHelpers.length - 1].gridDots.children.length * sheetsGroup.children.length, "gridDots erstellt mit gridSize", sheetHelpers[sheetHelpers.length - 1].gridGapX, sheetHelpers[sheetHelpers.length - 1].gridGapY);

}

// scale sheets and recreate dots:
export function scaleSheets(sheetsGroup) {

    let previousSheetLength = sheetsGroup.children[0].bounds.width;
    var newSheetLength = realSheetLength * raster.scaleX;
    var scaleBy = newSheetLength / previousSheetLength;

    for (var i = 0; i < sheetsGroup.children.length; i++) {
        var sheet = sheetsGroup.children[i];

        sheet.scale(scaleBy, sheet.bounds.topLeft);
        sheet.position.x = sheet.position.x * scaleBy;
        sheet.position.y = sheet.position.y * scaleBy;

        if (!imageArea.bounds.intersects(sheetsGroup.children[i].bounds)) {
            sheetsGroup.children[i].fillColor = 'red';
        }

        // scale labels:
        sheetHelpers[i].label.position = [sheet.bounds.topLeft.x + sheetHelpers[i].gridGapX, sheet.bounds.topLeft.y + sheetHelpers[i].gridGapY * 2];


        // recreate gridDots:
        sheetHelpers[i].gridGapX = raster.gridGapX;
        sheetHelpers[i].gridGapY = realSheetWidth / Math.floor(realSheetWidth / realGridSize) * raster.scaleX;

        sheetHelpers[i].gridDots.removeChildren(); // TODO: funktioniert das?
        sheetHelpers[i].gridDots = new paper.Group();
        sheetHelpers[i].createGridPoints(realSheetLength * raster.scaleX, realSheetWidth * raster.scaleX);

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

export function toggleSheetVisibility() {
    document.getElementById("buttonShowSheets").classList.toggle("active");
    sheetsGroup.visible = !sheetsGroup.visible;
}