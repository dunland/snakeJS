/*
   Heizungsauslegungsgenerator v.0.2
   dunland, Februar 2024
 */

import imageSettings from "../settings.json" assert { type: 'json' };
// import { mousePressed, mouseMoved, keyPressed, mouseGridX, mouseGridY } from "./UserInteraction.js";
import { globalVerboseLevel } from "./Devtools.js";
import { Bezier } from "./bezierjs/src/bezier.js";
import { exportLines } from "./lineExport.js";

var backgroundImage;
var imagePath;

export var MODE = "SETUP"; // can be "RUNNING" or "SETUP"
export function changeMode(newMode) { MODE = newMode; }
// Punktlisten:
export var font;

const FLAG_GET_IMAGE_DIALOG = false;

function preload() {
    // try loading data, otherwise go to SETUP:
    try {
        imagePath = imageSettings.imagePath;
        if (imagePath) {
            backgroundImage = loadImage(imagePath);
            MODE = "RUNNING";
        }
        else {
            MODE = "SETUP";
            console.log("Bild-Dateipfad ist leer.");
            FLAG_GET_IMAGE_DIALOG = true;
        }

    } catch (e) {
        console.log(e, "Bitte Eintellungen eigenhändig vornehmen.");
        MODE = "SETUP";
        FLAG_GET_IMAGE_DIALOG = true;
    }

    // load font:
    font = loadFont("./fonts/Arial.otf", function success() {
        console.log('successfully loaded font');
    });
}

function setup() {
    //Grafikeinstellungen:
    createCanvas(1600, 800);
    console.log("using renderer", webglVersion);

    // frameRate(15);
    ellipseMode(CENTER);

    console.log(backgroundImage.width, backgroundImage.height);
    
    // Gitterpunkte erstellen:
    raster.createPoints(Math.min(width, backgroundImage.width), Math.min(height, backgroundImage.height));

    console.log(window.width, window.height, backgroundImage.width, backgroundImage.height);
}

function draw() {

    switch (MODE) {

        case "RUNNING":

            let now = millis();
            background(0);

            if (backgroundImage) {
                image(backgroundImage, 0, 0);
            }

            // Gitter zeichnen:
            for (var i = 0; i < raster.gitterpunkte.length; i++) {
                // raster.gitterpunkte[i].render();
            }

            // Formen zeichnen:
            // zeichne Linie durch alle aktiven raster.gitterpunkte:
            // if (liniensegmente.length > 1)
            for (let i = 0; i < raster.liniensegmente.length; i++) {
                // raster.liniensegmente[i].render();
            }

            if (raster.scaling_mode_is_on) {
                stroke(raster._color);
                // Kreuzzeichnen:
                if (raster.choose_point_index < 1) {
                    line(mouseX - 10, mouseY - 10, mouseX + 10, mouseY + 10);
                    line(mouseX + 10, mouseY - 10, mouseX - 10, mouseY + 10);
                } else {
                    line(mouseX - 10, raster.scale_line[0].y - 10, mouseX + 10,
                        raster.scale_line[0].y + 10);
                    line(mouseX + 10, raster.scale_line[0].y - 10, mouseX - 10,
                        raster.scale_line[0].y + 10);
                }

                // Linie und Länge einblenden:
                if (raster.choose_point_index > 0) {
                    line(raster.scale_line[0].x, raster.scale_line[0].y, mouseX, raster.scale_line[0].y);
                    textFont(font);
                    textSize(14);
                    text(int(raster.scale_line[0].dist(
                        new PVector(mouseX, raster.scale_line[0].y))) +
                        " px",
                        raster.scale_line[0].x, raster.scale_line[0].y - 10);
                }
            }

            // draw cursor:
            noFill();
            stroke(255);
            ellipse(mouseGridX, mouseGridY, 10);

            // performance information:
            if (globalVerboseLevel) {
                fill(255);
                noStroke();
                let fps = frameRate();
                let cycleDuration = millis() - now;
                textFont(font);
                textSize(14);
                text("FPS: " + fps.toFixed(2), 10, height - 10);
                text("cycle duration: " + cycleDuration.toFixed(2), 10, height - 25);
            }

            break;


        case "SETUP":

            background(0);
            textAlign(CENTER, BOTTOM);
            text("Bitte Bilddatei auswählen!", width / 2, height / 2);

            if (FLAG_GET_IMAGE_DIALOG) {
                FLAG_GET_IMAGE_DIALOG = false;
                file = ui.showFileSelection();
                println(file);
                bild_pfad = file.getParent() + "/" + file.getName();
                println(bild_pfad);

                try {
                    backgroundImage = loadImage(bild_pfad);
                    raster.scaling_mode_is_on = true;
                    MODE = "RUNNING";

                    settings.setString("bild_pfad", bild_pfad);
                    saveJSONObject(settings, "settings.json");

                } catch (e) {
                    println(e);
                }
            }
            break;

        case "DXF_EXPORT":
            console.log("begin dxf export");

            const exportedModel = exportLines();
            console.log(exportedModel);

            const dataToSend = {fileName: `export/${imagePath}.dxf`, fileContent: JSON.stringify(exportedModel)};
            console.log(dataToSend);

            fetch('http://localhost:3000/api/sendData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            })
                .then(response => response.text())
                .then(message => {
                    console.log('Antwort vom Server:', message);
                })
                .catch(error => {
                    console.error('Fehler beim Senden der Daten:', error);
                });


            changeMode("RUNNING");
            break;

        default:
            console.log("no mode defined.");
            break;
    }
}
