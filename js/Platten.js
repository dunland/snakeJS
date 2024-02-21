export function createSheets(maxH, maxW, sheetLength, sheetWidth) {

    var sheetsGroup = new paper.Group();
    for (var y = 0; y < maxH / sheetWidth; y++)
        for (var x = 0; x < maxW / sheetLength; x++) {
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