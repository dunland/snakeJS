/*
   Heizungsauslegungsgenerator v.0.1.03a
   dunland, März 2022

   TODO:
   - [x] Raster bewegen per drag&drop
   - [ ] Raster zerschneiden??
   - [ ] Interaktion:
       - [ ] Liniensegmente rückgängig machen
       - [ ] Liniensegmente an Gitterpunkte binden
       - [ ] Liniensegmente exportieren/speichern
   - [ ] Raster:
       - [ ] Erkennung vertikale vs horizontale Verläufe
       - [ ] Liniensegmente bei Entfernen eines Punkts löschen
       - [ ] Punkte entfernen ‒ ohne Fehler
       - [ ] Benennung Maßeinheiten Wand
       - [x] Einfügen eines technischen Bildes
           - [ ] neu setzen der Rasterpunkte bei Laden des Bildes
           - [ ] Fehler, wenn kein Bild geladen → Popup File Panel
   - [ ] Export
       - [ ] Segmentierung des dxf-Exportes
   - [ ] UI:
       - [ ] Liste aller Punkte, draggable
       - [ ] Buttons:
           - [ ] SVG Export
           - [ ] DXF Export
           - [ ] Bild laden
           - [ ] Rastermaß bestimmen
 */

/*
   Fragen:
   - was für ein Output für FreeCAD benötigt? Eine Linie? zwei? drei?
   - welcher Dateityp? SVG oder DXF?
 */

// import { DxfWriter, point3d } from "@tarikjabiri/dxf";
import { mode_run, mode_setup } from "./modes.js";
import { GitterPunkt, Raster } from "./Raster.js";
// import { Liniensegment } from "./Liniensegmente.js";
import  imageSettings from "./settings.json" assert { type: 'json' };

console.log(imageSettings)

// fetch('./settings.json')
//     .then((response) => response.json())
//     .then((json) => console.log(json));

var backgroundImage;
var imagePath;
var output_datei = "output.dxf";
var settings_datei = "settings.json";

var record;
// const rastermass = 13; // in cm
// const punktAbstand_x = rastermass, punktAbstand_y = rastermass;
var globalVerboseLevel = 0;

var MODE; // can be "RUNNING" or "SETUP"

// Punktlisten:
var raster = new Raster();

const FLAG_GET_IMAGE_DIALOG = false;

function setup() {
    //Grafikeinstellungen:
    createCanvas(800, 500);
    console.log(settings_datei);

    //ellipseMode(CENTER);


    // try loading data, otherwise go to SETUP:
    try {
        imagePath = imageSettings.bild_pfad;
        if (imagePath) {
            backgroundImage = loadImage(imagePath);
            console.log(imagePath);
            console.log(backgroundImage);
            MODE = "RUNNING";
        }
        else {
            MODE = "SETUP";
            console.log("Bild-Dateipfad ist leer.");
            FLAG_GET_IMAGE_DIALOG = true;
        }

    } catch (e) {
        print(e, "Bitte Eintellungen eigenhändig vornehmen.");
        MODE = "SETUP";
        FLAG_GET_IMAGE_DIALOG = true;
    }
    console.log("Entering mode ", MODE);

    // Gitterpunkte erstellen:
    for (let x = 0; x < width; x += raster.punktAbstand_x * raster.scale_x) {
        for (let y = 0; y < width; y += raster.punktAbstand_y * raster.scale_x) {
            raster.gitterpunkte.push(new GitterPunkt(x, y));
        }
    }
    console.log(raster.gitterpunkte.length, " Gitterpunkte erstellt.");
}

function draw() {
    background(255,0,0);

    if (MODE == "RUNNING") {
        mode_run(raster, backgroundImage);
    }
    else if (MODE == "SETUP") {
        mode_setup();
    }
}

// using p5js as a module, the functions have to be called manually:
window.setup = setup;
window.draw = draw;