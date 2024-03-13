import { globalVerboseLevel } from "./Devtools.js";
import { splitActiveSheets } from "./UserInteraction.js";
import { raster, globalColor } from "./paperSnake.js";

export var sheetsGroup;
export var sheetHelpers = [];
export var activeSheet,
    activeSheetIdx = 0,
    movableSheetsFrom = 0,
    movableSheetsTo,
    sheetsPerRow;
export var gridGapX, gridGapY;
class SheetHelper {

    constructor(rectangleObject) {
        this.gridGapX = raster.gridGapX;
        this.gridGapY = raster.realSheetV / Math.floor(raster.realSheetV / raster.realSheetMargin) * raster.pxPerMM;
        this.rectangleObject = rectangleObject;
        this.gridDots = new paper.Group();
    }

    createGridPoints() {

        // TODO: change when rotate
        var sheetWidth = this.rectangleObject.bounds.height;
        var sheetLength = this.rectangleObject.bounds.width;

        let a = true; // alternating each point
        for (let x = this.rectangleObject.position.x; x < this.rectangleObject.position.x + sheetLength + this.gridGapX; x += this.gridGapX) {
            for (let y = this.rectangleObject.position.y; y < this.rectangleObject.position.y + sheetWidth + this.gridGapY; y += this.gridGapY) {
                const pt = new paper.Point(x - sheetLength / 2, y - sheetWidth / 2);
                this.gridDots.addChild(new paper.Path.Circle({
                    center: pt,
                    radius: 1,
                    fillColor: globalColor,
                    visible: false,
                    opacity: 0.5 + (a * 0.5)
                    // strokeColor: a ? 'grey' : null
                }));
                a = !a;
            }
        }
        if (globalVerboseLevel > 2)
            console.log(this.gridDots.children.length, "gridDots erstellt.");
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
    if (globalVerboseLevel > 2)
        console.log(`imported ${sheetsGroup.children.length} sheets`);

    let sheetLength = raster.realSheetH * raster.pxPerMM;
    let sheetWidth = raster.realSheetV * raster.pxPerMM
    let maxH = raster.roi.bounds.height;
    let maxW = raster.roi.bounds.width;

    movableSheetsFrom = 0;
    movableSheetsTo = Math.floor((maxW + sheetLength) / sheetLength);
    sheetsPerRow = Math.floor((maxH + sheetWidth) / sheetWidth) - 1;
}

export function createSheetsHorizontal(sheetLength, sheetWidth, maxH, maxW) {
    console.log('creating sheets:');

    var sheets = new paper.Group();
    let _sheetsPerRow = 0;
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
            _sheetsPerRow = (x > _sheetsPerRow) ? x : _sheetsPerRow;

            // create sheets:
            sheetHelpers.push(new SheetHelper(sheets.lastChild));
            sheetHelpers[sheetHelpers.length - 1].createGridPoints();
            sheetHelpers[sheetHelpers.length - 1].label = new paper.PointText([sheets.lastChild.bounds.topLeft.x + sheetHelpers[sheetHelpers.length - 1].gridGapX, sheets.lastChild.bounds.topLeft.y + sheetHelpers[sheetHelpers.length - 1].gridGapY * 2]);
            sheetHelpers[sheetHelpers.length - 1].label.content = `${y + 2
                }.${x + 2} `;
            sheetHelpers[sheetHelpers.length - 1].label.strokeColor = globalColor;
        }

    movableSheetsTo = Math.floor((maxW + sheetLength) / sheetLength) + 2;
    sheetsPerRow = _sheetsPerRow + 2;

    console.log(`${sheetsPerRow} sheets per row.`);

    // style active rows:
    for (var i = movableSheetsFrom; i < movableSheetsTo; i++) {
        sheets.children[i].strokeWidth = 4;
    }

    console.log(sheets.children.length, "sheets created with size", sheets.lastChild.bounds.size);

    sheetsGroup = sheets;
}

export function createSheetsVertical(sheetLength, sheetWidth, maxH, maxW) {
    console.log('creating sheets:');

    let _sheetsPerRow = 0;
    var sheets = new paper.Group();
    for (var x = -1; x < (maxW + sheetWidth) / sheetWidth; x++)
        for (var y = -1; y < (maxH + sheetLength) / sheetLength; y++) {
            sheets.addChild(new paper.Path.Rectangle({
                point: new paper.Point(x * sheetWidth, y * sheetLength),
                size: new paper.Size(sheetWidth, sheetLength),
                strokeColor: globalColor,
                strokeWidth: 1
            }));
            if (x % 2 == 0) {
                sheets.lastChild.position.y -= Math.floor(sheetLength / raster.gridGapX);
            }
            _sheetsPerRow = (y > _sheetsPerRow) ? y : _sheetsPerRow;

            // create sheets:
            sheetHelpers.push(new SheetHelper(sheets.lastChild));
            sheetHelpers[sheetHelpers.length - 1].createGridPoints();
            sheetHelpers[sheetHelpers.length - 1].label = new paper.PointText([sheets.lastChild.bounds.topLeft.x + sheetHelpers[sheetHelpers.length - 1].gridGapX, sheets.lastChild.bounds.topLeft.y + sheetHelpers[sheetHelpers.length - 1].gridGapY * 2]);
            sheetHelpers[sheetHelpers.length - 1].label.content = `${y + 2
                }.${x + 2} `;
            sheetHelpers[sheetHelpers.length - 1].label.strokeColor = globalColor;
        }

    movableSheetsTo = Math.floor((maxW + sheetLength) / sheetLength) + 2;
    // sheetsPerRow = Math.floor((maxW + sheetLength) / sheetLength) + 2;
    sheetsPerRow = _sheetsPerRow + 2;
    console.log(`${sheetsPerRow} sheets per row.`);

    // style active rows:
    for (var i = movableSheetsFrom; i < movableSheetsTo; i++) {
        sheets.children[i].strokeWidth = 4;
    }

    console.log(sheets.children.length, "sheets created with size", sheets.lastChild.bounds.size);

    sheetsGroup = sheets;
}
export function createSheetHelpersVertical(sheetLength, sheetWidth, maxH, maxW) {

    let index = 0;
    for (var a = -1; a < (maxW + sheetWidth) / sheetWidth; a++)
        for (var b = -1; b < (maxH + sheetLength) / sheetLength; b++) {
            sheetHelpers.push(new SheetHelper(sheetsGroup.children[index]));
            sheetHelpers[sheetHelpers.length - 1].createGridPoints();
            sheetHelpers[sheetHelpers.length - 1].label = new paper.PointText([sheetsGroup.children[index].bounds.topLeft.x + sheetHelpers[sheetHelpers.length - 1].gridGapX, sheetsGroup.children[index].bounds.topLeft.y + sheetHelpers[sheetHelpers.length - 1].gridGapY * 2]);
            sheetHelpers[sheetHelpers.length - 1].label.content = `${b + 2
                }.${a + 2} `;
            sheetHelpers[sheetHelpers.length - 1].label.strokeColor = globalColor;
            if (index < sheetsGroup.children.length - 1) index++;
        }
    if (globalVerboseLevel > 2)
        console.log(sheetHelpers.length, "sheetHelpers erstellt.",);
    console.log(sheetHelpers[sheetHelpers.length - 1].gridDots.children.length * sheetsGroup.children.length, "gridDots erstellt mit gridSize", sheetHelpers[sheetHelpers.length - 1].gridGapX, sheetHelpers[sheetHelpers.length - 1].gridGapY);

    document.getElementById("text_gridGapX").textContent = Math.round(sheetHelpers[0].gridGapX / raster.pxPerMM);
    document.getElementById("text_gridGapY").textContent = Math.round(sheetHelpers[0].gridGapY / raster.pxPerMM);
}

// scale sheets and recreate dots:
export function scaleSheets(sheetsGroup) {

    let previousSheetLength = sheetsGroup.children[0].bounds.width;
    var newSheetLength = raster.realSheetH * raster.pxPerMM;
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
        sheetHelpers[i].gridGapY = raster.realSheetV / Math.floor(raster.realSheetV / raster.realSheetMargin) * raster.pxPerMM;

        sheetHelpers[i].gridDots.removeChildren(); // TODO: funktioniert das?
        sheetHelpers[i].gridDots = new paper.Group();
        sheetHelpers[i].createGridPoints(raster.realSheetH * raster.pxPerMM, raster.realSheetV * raster.pxPerMM);

        console.log(sheetHelpers[sheetHelpers.length - 1].gridDots.children.length * sheetsGroup.children.length, "gridDots erstellt mit gridSize", sheetHelpers[sheetHelpers.length - 1].gridGapX, sheetHelpers[sheetHelpers.length - 1].gridGapY);

    }
    console.log("scaled sheets. new size:", sheetsGroup.lastChild.bounds.size);
}

export function rotateSheets() {
    sheetsGroup.rotate(90);
}

export function getSheetAtCursorPos(pt) {
    for (var i = 0; i < sheetsGroup.children.length; i++) {
        if (sheetsGroup.children[i].contains(pt)) {
            activeSheet = sheetHelpers[i];
            activeSheetIdx = i;
            sheetHelpers[i].showGridPoints();
            selectRowBySheet(i);
            break;
        }
    }
}

export function selectRowBySheet(index) {

    // split row at idx?
    if (splitActiveSheets < 0) {
        movableSheetsFrom = Math.floor(index / sheetsPerRow) * sheetsPerRow;
        movableSheetsTo = activeSheetIdx + 1;
    }
    else if (splitActiveSheets > 0) {
        movableSheetsFrom = activeSheetIdx;
        movableSheetsTo = Math.floor(index / sheetsPerRow) * sheetsPerRow + sheetsPerRow;
    }
    else {
        movableSheetsFrom = Math.floor(index / sheetsPerRow) * sheetsPerRow;
        movableSheetsTo = Math.floor(index / sheetsPerRow) * sheetsPerRow + sheetsPerRow;
    }

    if (globalVerboseLevel > 2)
        console.log(movableSheetsFrom, movableSheetsTo, sheetsPerRow);

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
    for (let index = 0; index < sheetHelpers.length; index++) {
        sheetHelpers[index].label.visible = !sheetHelpers[index].label.visible;
    }
}

export function recreateSheets() {
    sheetsGroup.remove();
    for (let index = 0; index < sheetHelpers.length; index++) {
        const sheetHelper = sheetHelpers[index];
        sheetHelper.gridDots.remove();
        sheetHelper.label.remove();
    }

    sheetHelpers = [];

    // platten erstellen:
    if (raster.realSheetH > raster.realSheetV)
        createSheetsHorizontal(
            raster.realSheetH * raster.pxPerMM,
            raster.realSheetV * raster.pxPerMM,
            raster.roi.bounds.height, raster.roi.bounds.width
        );
    else {
        createSheetsVertical(
            raster.realSheetH * raster.pxPerMM,
            raster.realSheetV * raster.pxPerMM,
            raster.roi.bounds.height, raster.roi.bounds.width
        );
    }
    calculateLeftovers();
}

export function calculateLeftovers() {
    let leftovers = 0;
    let sheetsUsed = 0;
    raster.roi.strokeColor = null;
    for (var i = 0; i < sheetsGroup.children.length; i++) {
        let child = sheetsGroup.children[i].clone();
        if (raster.roi.bounds.intersects(child.bounds)) {
            let tempObj = raster.roi.exclude(sheetsGroup.children[i]).subtract(raster.roi);

            // remove blocked areas:
            tempObj.fillColor = 'red';
            leftovers += tempObj.area / (raster.pxPerMM * raster.pxPerMM);
            tempObj.removeOnMove();
            sheetsUsed++;
        }

        // add intersected area to 
        if (raster.area.children.length) {
            if (child.intersects(raster.area)) {
                let numAreas = raster.area.children.length;
                for (let index = 0; index < numAreas; index++) {
                    const areaChild = raster.area.children[index].clone();
                    console.log(raster.area.children.length);

                    let someObj = areaChild.intersect(child);
                    console.log(index, `${sheetHelpers[i].label.content} intersects raster.area`);

                    // remove blocked areas:
                    someObj.fillColor = 'red';
                    leftovers += someObj.area / (raster.pxPerMM * raster.pxPerMM);
                    areaChild.remove();
                    someObj.removeOnMove();
                }
            }
        }
        child.remove();
    }

    leftovers = leftovers * Math.pow(10, -6); // mm² to m²
    document.getElementById("leftovers").textContent = leftovers.toFixed(3)
    document.getElementById("sheets").textContent = sheetsUsed;
    raster.roi.strokeColor = 'blue';
}