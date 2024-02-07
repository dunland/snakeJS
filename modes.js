import { globalVerboseLevel } from "./Devtools.js";
import { font, record } from "./snake.js";
import { mouseGridX, mouseGridY } from "./UserInteraction.js";
// import { DxfWriter, point3d } from "@tarikjabiri/dxf";

const output_datei = "output.dxf";

export function renderScene(MODE, raster, backgroundImage) {

  switch (MODE) {

    case "RUNNING":

      let now = millis();
      background(0);

      if (backgroundImage) {
        image(backgroundImage, 0, 0);
      }

      // Gitter zeichnen:
      for (var i = 0; i < raster.gitterpunkte.length; i++) {
        var gp = raster.gitterpunkte[i];
        // gp.checkMouseOverlap();
        if (!record) {
          gp.render();
        }
      }

      // DXFAufnahme starten:
      if (record) {
        beginRaw(DXF, output_datei);
      }

      // Formen zeichnen:
      // zeichne Linie durch alle aktiven raster.gitterpunkte:
      // if (liniensegmente.length > 1)
      for (let i = 0; i < raster.liniensegmente.length; i++) {
        raster.liniensegmente[i].render();
      }

      // DXFAufnahme beenden:
      if (record) {
        endRaw();
        record = false;
        println("record finished.");
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

      if (globalVerboseLevel) {
        fill(255);
        noStroke();
        let fps = frameRate();
        let cycleDuration = millis() - now;
        textFont(font);
        textSize(14);
        text("FPS: " + fps.toFixed(2), 10, height - 10);
        text("cycle duration: " + cycleDuration.toFixed(2), 10, height - 20);
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

    default:
      console.log("no mode defined.");
      break;
  }
}