import { globalVerboseLevel } from "./Devtools.js";
import { splitActiveSheets } from "./UserInteraction.js";
import { raster, globalColor } from "./paperSnake.js";

export var sheetsGroup;
export var sheetHelpers = [];
export var activeSheet,
    lastActiveSheet,
    activeSheetIdx = 0,
    movableSheetsFrom = 0,
    movableSheetsTo,
    sheetsPerRow;
export var gridGapX, gridGapY;
class SheetHelper {

    constructor(rectangleObject) {
        this.gridGapX = raster.gridGapX;
        this.gridGapY = raster.gridGapY;
        this.rectangleObject = rectangleObject;
        this.gridDots = new paper.Group();
    }

    createGridPoints() {

        // TODO: change when rotate
        var sheetWidth = this.rectangleObject.bounds.height;
        var sheetLength = this.rectangleObject.bounds.width;

        let a = true; // alternating each point
        for (let x = this.rectangleObject.position.x; x < (this.rectangleObject.position.x + sheetLength); x += this.gridGapX) {
            for (let y = this.rectangleObject.position.y; y < (this.rectangleObject.position.y + sheetWidth); y += this.gridGapY) {
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
        if (globalVerboseLevel > 3)
            console.log(this.gridDots.children.length, "gridDots erstellt.");
    }

    showGridPoints() {
        this.gridDots.children.forEach(dot => {
            if (raster.roi.contains(dot.position) && !raster.area.contains(dot.position)) {
                dot.visible = true;
            }
        });
    }

    hideGridPoints() {
        this.gridDots.children.forEach(dot => {
            dot.visible = false;
        });
    }
}

// load sheetsGroup from JSON
export function importSheets(JSONdata) {
    sheetsGroup = new paper.Group().importJSON(JSONdata);
    if (globalVerboseLevel > 2)
        console.log(`imported ${sheetsGroup.children.length} sheets`);

    let sheetLength = raster.realSheetDimHorizontal * raster.pxPerMM;
    let sheetWidth = raster.realSheetDimVertical * raster.pxPerMM
    let maxH = raster.roi.bounds.height;
    let maxW = raster.roi.bounds.width;

    movableSheetsFrom = 0;
    movableSheetsTo = Math.floor((maxW + sheetLength) / sheetLength) + 2;
    sheetsPerRow = Math.floor((maxH + sheetWidth) / sheetWidth) + 1;

    // create sheet helpers:
    for (let index = 0; index < sheetsGroup.children.length; index++) {
        var sheet = sheetsGroup.children[index];

        sheetHelpers.push(new SheetHelper(sheet));
        sheetHelpers[sheetHelpers.length - 1].createGridPoints();
        sheetHelpers[sheetHelpers.length - 1].label = new paper.PointText([sheet.bounds.topLeft.x + sheetHelpers[sheetHelpers.length - 1].gridGapX, sheet.bounds.topLeft.y + sheetHelpers[sheetHelpers.length - 1].gridGapY * 2]);
        // sheetHelpers[sheetHelpers.length - 1].label.content = `${y + 2
        // }.${x + 2} `;
        sheetHelpers[sheetHelpers.length - 1].label.strokeColor = globalColor;
    }
    console.log(`${sheetHelpers.length} sheetHelpers created.`);

}

export function createSheetsHorizontal(sheetH, sheetV, verticalExtent, horizontalExtent) {
    console.log('creating sheets:');

    let _sheetsPerRow = 0;
    var sheets = new paper.Group();

    // horizontal sheets:
    for (var posY = -1; posY < (verticalExtent + sheetV) / sheetV; posY++)
        for (var posX = -1; posX < (horizontalExtent + sheetH) / sheetH; posX++) {
            sheets.addChild(new paper.Path.Rectangle({
                point: new paper.Point(posX * sheetH, posY * sheetV),
                size: new paper.Size(sheetH, sheetV),
                strokeColor: globalColor,
                strokeWidth: 1
            }));

            // displace every other sheet:
            if (posY % 2 == 0) {
                sheets.lastChild.position.x -= raster.gridGapX;
            }
            _sheetsPerRow = (posX > _sheetsPerRow) ? posX : _sheetsPerRow;

            // create sheet helpers:
            sheetHelpers.push(new SheetHelper(sheets.lastChild));
            sheetHelpers[sheetHelpers.length - 1].createGridPoints();
            sheetHelpers[sheetHelpers.length - 1].label = new paper.PointText([sheets.lastChild.bounds.topLeft.x + sheetHelpers[sheetHelpers.length - 1].gridGapX, sheets.lastChild.bounds.topLeft.y + sheetHelpers[sheetHelpers.length - 1].gridGapY * 2]);
            sheetHelpers[sheetHelpers.length - 1].label.content = `${posY + 2
                }.${posX + 2} `;
            sheetHelpers[sheetHelpers.length - 1].label.strokeColor = globalColor;
        }

    movableSheetsTo = Math.floor((horizontalExtent + sheetH) / sheetH) + 2;
    sheetsPerRow = _sheetsPerRow + 2;

    console.log(`${sheetsPerRow} sheets per row.`);

    // style active rows:
    for (var i = movableSheetsFrom; i < movableSheetsTo; i++) {
        sheets.children[i].strokeWidth = 4;
    }

    console.log(sheets.children.length, "horizontal sheets created with size", sheets.lastChild.bounds.size);
    document.getElementById("text_gridGapX").textContent = Math.round(sheetHelpers[0].gridGapX / raster.pxPerMM);
    document.getElementById("text_gridGapY").textContent = Math.round(sheetHelpers[0].gridGapY / raster.pxPerMM);

    sheetsGroup = sheets;
}

export function createSheetsVertical(sheetDimH, sheetDimV, verticalExtent, horizontalExtent) {
    console.log('creating sheets:');

    let _sheetsPerRow = 0;
    var sheets = new paper.Group();
    for (var posX = -1; posX < ((horizontalExtent + sheetDimH) / sheetDimH); posX++)
        for (var posY = -1; posY < ((verticalExtent + sheetDimV) / sheetDimV); posY++) {
            sheets.addChild(new paper.Path.Rectangle({
                point: new paper.Point(posX * sheetDimH, posY * sheetDimV),
                size: new paper.Size(sheetDimH, sheetDimV),
                strokeColor: globalColor,
                strokeWidth: 1
            }));
            console.log(sheets.lastChild.gridGapY);

            // displace every other sheet:
            if (posX % 2 == 0) {
                sheets.lastChild.position.y -= raster.realSheetDimVertical / Math.floor(raster.realSheetDimVertical / raster.realSheetMarginMin) * raster.pxPerMM;
            }
            _sheetsPerRow = (posY > _sheetsPerRow) ? posY : _sheetsPerRow;

            // create sheet helpers:
            sheetHelpers.push(new SheetHelper(sheets.lastChild));
            sheetHelpers[sheetHelpers.length - 1].createGridPoints();
            sheetHelpers[sheetHelpers.length - 1].label = new paper.PointText([sheets.lastChild.bounds.topLeft.x + sheetHelpers[sheetHelpers.length - 1].gridGapX, sheets.lastChild.bounds.topLeft.y + sheetHelpers[sheetHelpers.length - 1].gridGapY * 2]);
            sheetHelpers[sheetHelpers.length - 1].label.content = `${posY + 2
                }.${posX + 2} `;
            sheetHelpers[sheetHelpers.length - 1].label.strokeColor = globalColor;
        }

    movableSheetsTo = Math.floor((horizontalExtent + sheetDimH) / sheetDimH) + 2;
    // sheetsPerRow = Math.floor((maxW + sheetLength) / sheetLength) + 2;
    sheetsPerRow = _sheetsPerRow + 2;
    console.log(`${sheetsPerRow} sheets per row.`);

    // style active rows:
    for (var i = movableSheetsFrom; i < movableSheetsTo; i++) {
        sheets.children[i].strokeWidth = 4;
    }

    console.log(sheets.children.length, "vertical sheets created with size", sheets.lastChild.bounds.size);
    document.getElementById("text_gridGapX").textContent = Math.round(sheetHelpers[0].gridGapX / raster.pxPerMM);
    document.getElementById("text_gridGapY").textContent = Math.round(sheetHelpers[0].gridGapY / raster.pxPerMM);

    sheetsGroup = sheets;
}

// scale sheets and recreate dots:
export function scaleSheets() {

    let previousSheetLength = sheetsGroup.children[0].bounds.width;
    var newSheetLength = raster.realSheetDimHorizontal * raster.pxPerMM;
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
        sheetHelpers[i].gridGapY = raster.realSheetDimVertical / Math.floor(raster.realSheetDimVertical / raster.realSheetMarginMin) * raster.pxPerMM;

        sheetHelpers[i].gridDots.removeChildren(); // TODO: funktioniert das?
        sheetHelpers[i].gridDots = new paper.Group();
        sheetHelpers[i].createGridPoints(raster.realSheetDimHorizontal * raster.pxPerMM, raster.realSheetDimVertical * raster.pxPerMM);

        console.log(sheetHelpers[sheetHelpers.length - 1].gridDots.children.length * sheetsGroup.children.length, "gridDots erstellt mit gridSize", sheetHelpers[sheetHelpers.length - 1].gridGapX, sheetHelpers[sheetHelpers.length - 1].gridGapY);

    }
    console.log("scaled sheets. new size:", sheetsGroup.lastChild.bounds.size);
    document.getElementById("rasterPxPerMM").textContent = raster.pxPerMM.toFixed(3);

}

export function rotateSheets() {
    sheetsGroup.rotate(90);
}

export function getSheetAtCursorPos(pt) {
    lastActiveSheet = activeSheet
    for (var i = 0; i < sheetsGroup.children.length; i++) {
        if (sheetsGroup.children[i].contains(pt)) {
            activeSheet = sheetHelpers[i];
            activeSheetIdx = i;
            if (lastActiveSheet != activeSheet) {
                sheetHelpers.forEach(sheet => {
                    sheet.hideGridPoints();
                });
                sheetHelpers[i].showGridPoints();
            }
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

    // remove all sheets:
    for (let index = 0; index < sheetsGroup.children.length; index++) {
        const child = sheetsGroup.children[index];
        child.remove();
    }
    sheetsGroup.remove();

    for (let index = 0; index < sheetHelpers.length; index++) {
        const sheetHelper = sheetHelpers[index];
        sheetHelper.gridDots.remove();
        sheetHelper.label.remove();
    }

    // create new sheets:
    sheetsGroup = new paper.Group();
    console.log(sheetsGroup);
    sheetHelpers = [];

    console.log(`sheetH: ${raster.realSheetDimHorizontal} > sheetV: ${raster.realSheetDimVertical}: ${(raster.realSheetDimHorizontal > raster.realSheetDimVertical)}`);
    // platten erstellen:
    if (raster.realSheetDimHorizontal > raster.realSheetDimVertical) {
        console.log("creating horizontal sheets");
        createSheetsHorizontal(
            raster.realSheetDimHorizontal * raster.pxPerMM, // horizontal
            raster.realSheetDimVertical * raster.pxPerMM, // vertikal 
            raster.roi.bounds.height,           // maxH
            raster.roi.bounds.width             // maxW
        );
    }
    else {
        console.log("creating vertical sheets");
        createSheetsVertical(
            raster.realSheetDimHorizontal * raster.pxPerMM, // sheetDimH
            raster.realSheetDimVertical * raster.pxPerMM, // sheetDimV
            raster.roi.bounds.height,           // verticalExtent
            raster.roi.bounds.width             // horizontalExtent
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

                    let someObj = areaChild.intersect(child);
                    if (globalVerboseLevel > 3)
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