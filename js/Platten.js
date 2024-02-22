import { imageArea } from "./paperSnake.js";

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
        }
    sheetsGroup.strokeColor = 'grey';

    return sheetsGroup
}

// scale sheets, but do not remove or replace:
export function scaleSheets(sheetsGroup, scaleBy) {
    for (var i = 0; i < sheetsGroup.children.length; i++) {
        var child = sheetsGroup.children[i];

        child.scale(scaleBy, child.bounds.topLeft);
        child.position.x = child.position.x * scaleBy;
        child.position.y = child.position.y * scaleBy;

        if (!imageArea.bounds.intersects(sheetsGroup.children[i].bounds)){
            sheetsGroup.children[i].fillColor = 'red';
        }
}
}