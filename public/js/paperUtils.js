export var getRadius = function(path) {

    return path.bounds.width / 2 + path.strokeWidth / 2;

    // or return path.strokeBounds.width / 2; 

}
export var setRadius = function(path, radius) {

    // figure out what the new radius should be without the stroke

    var newRadiusWithoutStroke = radius - path.strokeWidth / 2;

    // figure out what the current radius is without the stroke 

    var oldRadiusWithoutStroke = path.bounds.width / 2;

    path.scale(newRadiusWithoutStroke / oldRadiusWithoutStroke);

}

export function showIntersections(path1, path2) {
    var intersections = path1.getIntersections(path2);
    for (var i = 0; i < intersections.length; i++) {
        new paper.Path.Circle({
            center: intersections[i].point,
            radius: 5,
            fillColor: '#009dec'
        }).removeOnMove();
    }
}