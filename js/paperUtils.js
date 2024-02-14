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