import { Raster } from "./Raster.js";
import { imageArea, raster } from "./paperSnake.js";

export var sheetHelpers = [];
class SheetHelper {

    constructor(rectangleObject) {
        this.rasterMass = 6;
        this.scaleBy = 2.5
        this.rectangleObject = rectangleObject;
        this.gridDots = new paper.Group();
        // this.raster = new Raster(rasterMass, scaleBy);
    }

    createGridPoints(sheetLength, sheetWidth) {

        // TODO: change when rotate
        // var sheetWidth = this.rectangleObject.bounds.height;
        // var sheetLength = this.rectangleObject.bounds.width;

        for (let x = this.rectangleObject.position.x + this.rasterMass; x < this.rectangleObject.position.x + sheetLength - this.rasterMass; x += this.rasterMass * this.scaleBy) {
            for (let y = this.rectangleObject.position.y + this.rasterMass; y < this.rectangleObject.position.y + sheetWidth - this.rasterMass; y += this.rasterMass * this.scaleBy) {
                const pt = new paper.Point(x - sheetLength / 2, y - sheetWidth / 2);
                this.gridDots.addChild(new paper.Path.Circle({
                    center: pt,
                    radius: 1,
                    fillColor: 'white',
                    visible: false
                }));
            }
        }
        console.log(this.gridDots.children.length, "gridDots erstellt");
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

export function createSheets(maxH, maxW, sheetLength, sheetWidth, scaleBy) {

    sheetLength = sheetLength * scaleBy;
    sheetWidth = sheetWidth * scaleBy;

    var sheetsGroup = new paper.Group();
    for (var y = -1; y < maxH / sheetWidth; y++)
        for (var x = -1; x < maxW / sheetLength; x++) {
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

    // sheetsGroup.onMouseMove = function(sheet) {
    //     console.log("hi");
        // var idx = sheetHelpers.findIndex((el) => el.rectangleObject.id == sheet.id);
        // console.log(sheet,
        //     el.rectangleObject,
        //     el.rectangleObject.id,
        //     sheet.id);
        // sh = sheetHelpers[idx];        
        // sh.gridDots.visible = true;
    // }

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
}