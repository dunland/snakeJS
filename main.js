const http = require('http');
var fs = require('fs');
var path = require('path');
var express = require('express'); // needed to serve files
var app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

var dir = path.join(__dirname, '.');

app.use(express.static(dir)); // serve static files

const hostname = '127.0.0.1';
const port = 3000;

app.use(bodyParser.json());
app.use(cors()); // CORS ist ein Sicherheitsmechanismus, der standardmäßig vom Browser implementiert wird, um zu verhindern, dass JavaScript auf einer Webseite Ressourcen von einem anderen Ursprung (z. B. einem anderen Domainnamen, Port oder Protokoll) anfordert, es sei denn, der Server erlaubt explizit solche Anfragen.

// Beispiel-Route zum Empfangen von POST-Anfragen vom Browser
app.post('/api/sendData', (req, res) => {
  const { fileName, fileContent } = req.body; // Daten vom Browser erhalten
  console.log('Daten vom Browser:', fileName, fileContent);
   
    // Überprüfen, ob sowohl Dateiname als auch Dateiinhalt vorhanden sind
    if (!fileName || !fileContent) {
      return res.status(400).send('Ungültige Anfrage: Dateiname und Dateiinhalt sind erforderlich.');
  }
  
  const incomingData = JSON.parse(fileContent);

  // TODO: automatisieren
    // TODO: 
    // function svgPathToDXF(svgPathData) {
    //   const model = makerjs.importer.fromSVGPathData(svgPathData);
    //   return makerjs.exporter.toDXF(model);
    // }

    // https://github.com/microsoft/maker.js/issues/579#issuecomment-1786083802

    // Use d3.path to convert Canvas comands to SVG path data
    // Use Maker.js to import the SVG path data as a model.
    // Use Maker.js to export the model as DXF

    // https://observablehq.com/@danmarshall/html-canvas-to-dxf
  var points = incomingData.models.c1.points;
  var curve1 = new makerjs.models.BezierCurve(points);

  var model = {
    models: {
      c1: curve1
    }
  };

  model = makerjs.model.mirror(model, false, true);

  var dxf = makerjs.exporter.toDXF(model);
  console.log(dxf);

  // Schreiben der Datei mit dem fs-Modul
  fs.writeFile(fileName, dxf, err => {
      if (err) {
          console.error('Fehler beim Schreiben der Datei:', err);
          return res.status(500).send('Interner Serverfehler beim Schreiben der Datei.');
      }
      console.log(`Datei '${fileName}' erfolgreich geschrieben.`);
      res.send('Datei erfolgreich hochgeladen und geschrieben.');
  });

});

app.listen(port, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});
