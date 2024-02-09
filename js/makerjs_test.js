//renders a line

var makerjs = require('makerjs');

var line = { 
  type: 'line', 
  origin: [0, 0], 
  end: [50, 50] 
 };
 
var svg = makerjs.exporter.toSVG(line);

document.write(svg);