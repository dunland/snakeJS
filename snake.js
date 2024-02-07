/*
   Heizungsauslegungsgenerator v.0.2
   dunland, Februar 2024
 */

/*
   Fragen:
   - was für ein Output für FreeCAD benötigt? Eine Linie? zwei? drei?
   - welcher Dateityp? SVG oder DXF?
 */

// import { DxfWriter, point3d } from "@tarikjabiri/dxf";
import { renderScene } from "./modes.js";
import { GitterPunkt, Raster } from "./Raster.js";
import imageSettings from "./settings.json" assert { type: 'json' };
import { mousePressed, mouseMoved, keyPressed } from "./UserInteraction.js";

console.log(imageSettings)

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
export var raster = new Raster();
export var font;
export var record;

const FLAG_GET_IMAGE_DIALOG = false;

function preload() {
    // try loading data, otherwise go to SETUP:
    try {
        imagePath = imageSettings.bild_pfad;
        if (imagePath) {
            backgroundImage = loadImage(imagePath);
            console.log(imagePath);
            console.log(backgroundImage.width);
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

    // load font:
    font = loadFont("./fonts/Arial.otf", function success() {
        console.log('successfully loaded font');
    });
}

function setup() {
    //Grafikeinstellungen:
    createCanvas(1600, 800);
    // frameRate(15);
    ellipseMode(CENTER);

    // Gitterpunkte erstellen:
    console.log(backgroundImage.width, backgroundImage.height);
    for (let x = 0; x < Math.min(width, backgroundImage.width); x += raster.punktAbstand_x * raster.scale_x) {
        for (let y = 0; y < Math.min(height, backgroundImage.height); y += raster.punktAbstand_y * raster.scale_x) {
            raster.gitterpunkte.push(new GitterPunkt(x, y, raster));
        }
    }
    console.log(raster.gitterpunkte.length, " Gitterpunkte erstellt.");
    console.log(window.width, window.height, backgroundImage.width, backgroundImage.height);
}

function draw() {
    background(255, 0, 0);

    renderScene(MODE, raster, backgroundImage);
}

// using p5js as a module, the functions have to be called manually:
window.preload = preload;
window.setup = setup;
window.draw = draw;
window.keyPressed = keyPressed;
window.mousePressed = mousePressed;
window.mouseMoved = mouseMoved;