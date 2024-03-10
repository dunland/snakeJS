import { raster, realSheetLength, realSheetWidth, realGridSize, image, globalColor } from "./paperSnake.js";

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
                    fillColor: globalColor,
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

export function importSheets(JSONdata) {
    sheetsGroup = new paper.Group().importJSON(JSONdata);
    console.log(`imported ${sheetsGroup.children.length} sheets`);

    let sheetLength = realSheetLength * raster.scaleX;
    let sheetWidth = realSheetWidth * raster.scaleX
    let maxH = raster.roi.bounds.height;
    let maxW = raster.roi.bounds.width;

    movableSheetsFrom = 0;
    movableSheetsTo = Math.floor((maxW + sheetLength) / sheetLength);
    sheetsPerRow = Math.floor((maxH + sheetWidth) / sheetWidth);
}

export function createSheets(sheetLength, sheetWidth, maxH, maxW) {
    console.log('creating sheets:');

    var sheets = new paper.Group();
    for (var y = -1; y < (maxH + sheetWidth) / sheetWidth; y++)
        for (var x = -1; x < (maxW + sheetLength) / sheetLength; x++) {
            sheets.addChild(new paper.Path.Rectangle({
                point: new paper.Point(x * sheetLength, y * sheetWidth),
                size: new paper.Size(sheetLength, sheetWidth),
                strokeColor: globalColor,
                strokeWidth: 1
            }));
            if (y % 2 == 0) {
                sheets.lastChild.position.x -= Math.floor(sheetLength / raster.gridGapX);
            }
        }

    movableSheetsTo = Math.floor((maxW + sheetLength) / sheetLength) + 2;
    sheetsPerRow = Math.floor((maxH + sheetWidth) / sheetWidth);

    // style active rows:
    for (var i = movableSheetsFrom; i < movableSheetsTo; i++) {
        sheets.children[i].strokeWidth = 4;
    }

    console.log(sheets.children.length, "sheets created with size", sheets.lastChild.bounds.size);

    sheetsGroup = sheets;
}

export function createSheetHelpers(sheetLength, sheetWidth, maxH, maxW) {

    let index = 0;
    for (var y = -1; y < (maxH + sheetWidth) / sheetWidth; y++)
        for (var x = -1; x < (maxW + sheetLength) / sheetLength; x++) {
            sheetHelpers.push(new SheetHelper(sheetsGroup.children[index]));
            sheetHelpers[sheetHelpers.length - 1].createGridPoints();
            sheetHelpers[sheetHelpers.length - 1].label = new paper.PointText([sheetsGroup.children[index].bounds.topLeft.x + sheetHelpers[sheetHelpers.length - 1].gridGapX, sheetsGroup.children[index].bounds.topLeft.y + sheetHelpers[sheetHelpers.length - 1].gridGapY * 2]);
            sheetHelpers[sheetHelpers.length - 1].label.content = `${y + 2
                }.${x + 2} `;
            sheetHelpers[sheetHelpers.length - 1].label.strokeColor = globalColor;
            if (index < sheetsGroup.children.length - 1) index++;
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

        if (!raster.roi.bounds.intersects(sheetsGroup.children[i].bounds)) {
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
    sheetsGroup.strokeColor = globalColor;
    for (var i = movableSheetsFrom; i < movableSheetsTo; i++) {
        sheetsGroup.children[i].strokeWidth = 4;
    }
}

export function selectRowBySheet(index) {
    movableSheetsFrom = Math.floor(index / sheetsPerRow) * sheetsPerRow;
    movableSheetsTo = Math.floor(index / sheetsPerRow) * sheetsPerRow + sheetsPerRow;

    // style:
    sheetsGroup.strokeWidth = 1;
    sheetsGroup.strokeColor = globalColor;
    for (var i = movableSheetsFrom; i < movableSheetsTo; i++) {
        sheetsGroup.children[i].strokeWidth = 4;
    }

}

export function toggleSheetVisibility() {
    document.getElementById("buttonShowSheets").classList.toggle("active");
    sheetsGroup.visible = !sheetsGroup.visible;
}

export function recreateSheets() {
    sheetsGroup.remove();
    for (let index = 0; index < sheetHelpers.length; index++) {
        const sheetHelper = sheetHelpers[index];
        sheetHelper.gridDots.remove();
        sheetHelper.label.remove();
    }

    sheetHelpers = [];

    createSheets(
        realSheetLength * raster.scaleX,
        realSheetWidth * raster.scaleX,
        raster.roi.bounds.height, raster.roi.bounds.width
    );
    createSheetHelpers(
        realSheetLength * raster.scaleX,
        realSheetWidth * raster.scaleX,
        raster.roi.bounds.height, raster.roi.bounds.width
    );
    calculateLeftovers();
}

export function calculateLeftovers() {
    let leftovers = 0;
    let sheets = 0;
    for (var i = 0; i < sheetsGroup.children.length; i++) {
        let child = sheetsGroup.children[i];
        if (raster.roi.bounds.intersects(child.bounds)) {
            let tempObj = raster.roi.exclude(sheetsGroup.children[i]).subtract(raster.roi).removeOnMove();
            tempObj.fillColor = 'red';
            leftovers += tempObj.bounds.width * tempObj.bounds.height;
            sheets++;
        }
    }
    leftovers = leftovers * Math.pow(10, -6); // mm² to m²
    document.getElementById("leftovers").textContent = leftovers.toFixed(3)
    document.getElementById("sheets").textContent = sheets;
}