import { raster } from "./snake.js";
import { globalVerboseLevel } from "./Devtools.js";

export var record = false;
export var mouseGridX, mouseGridY;

// Tastaturbefehle:
export function keyPressed() {
    console.log(key);
    // exportiere DXF mit Taste 'r':
    if (key == 'R' || key == 'r') {
        record = true;
    }
    if (key == 'W' || key == 'w')
        raster.liniensegmente.at(raster.liniensegmente.length - 1).set_type("KURVE_OBEN");
    if (key == 'A' || key == 'a')
        raster.liniensegmente.at(raster.liniensegmente.length - 1).typ = "KURVE_LINKS";
    if (key == 'S' || key == 's')
        raster.liniensegmente.at(raster.liniensegmente.length - 1).set_type("KURVE_UNTEN");
    if (key == 'D' || key == 'd')
        raster.liniensegmente.at(raster.liniensegmente.length - 1).typ = "KURVE_RECHTS";
    if (key == 'Q' || key == 'q')
        raster.liniensegmente.at(raster.liniensegmente.length - 1).set_type("KURVE_OBENLINKS");
    if (key == 'E' || key == 'e')
        raster.liniensegmente.at(raster.liniensegmente.length - 1).set_type("KURVE_OBENRECHTS");
    if (key == 'Y' || key == 'y')
        raster.liniensegmente.at(raster.liniensegmente.length - 1).set_type("KURVE_UNTENLINKS");
    if (key == 'X' || key == 'x')
        raster.liniensegmente.at(raster.liniensegmente.length - 1).set_type("KURVE_UNTENRECHTS");
    if (key == ' ') {
        if (raster.liniensegmente.at(raster.liniensegmente.length - 1).typ == "HORIZONTALE")
            raster.liniensegmente.at(raster.liniensegmente.length - 1).typ = "VERTIKALE";
        else if (raster.liniensegmente.at(raster.liniensegmente.length - 1).typ == "VERTIKALE")
            raster.liniensegmente.at(raster.liniensegmente.length - 1).typ = "HORIZONTALE";
        else
            raster.liniensegmente.at(raster.liniensegmente.length - 1).typ = "HORIZONTALE";
    }
    if (key == '+' || key == 'ȉ') {
        globalVerboseLevel++;
        console.log("globalVerboseLevel = ", globalVerboseLevel);
    }
    if (key == '-') {
        globalVerboseLevel--;
        console.log("globalVerboseLevel = ", globalVerboseLevel);
    }
    if (key == 'n' || key == 'N') {
        raster.enable_scaling_mode();
    }
}

export function mousePressed() {
    for (let i = 0; i < raster.gitterpunkte.length; i++) {
        var gp = raster.gitterpunkte[i];
        if (mouseGridX == gp.x && mouseGridY == gp.y) {
            gp.active = !gp.active;
            if (gp.active) {
                raster.activeGridPoints.push(gp);
                // neues Liniensegment:
                if (raster.activeGridPoints.length > 1) {
                    var gp_vorher =
                        raster.activeGridPoints.at(raster.activeGridPoints.length - 2);
                    raster.liniensegmente.push(
                        new Liniensegment(gp, gp_vorher, raster));
                    // TODO : gp.linie = zuletzt erstelle Linie
                }
            } else {
                console.log("removal of points not yet implemented!")
                // this.activeGridPoints.remove(gp);
                // entferne Liniensegment:
                // TODO : alle aktiven gps müssen zugeordnete linie haben → entferne
                // diese linie
            }
        }
    }

    if (this.scaling_mode_is_on) {
        if (this.choose_point_index < 1)
            this.set_scaling_point(mouseX, mouseY);
        else
            this.set_scaling_point(mouseX, int(this.scale_line[0].y));
    }
}

export function mouseMoved() {

    let maxW = 1000; // TODO: must be backgroundImage.width
    let maxH = 667; // TODO: must be backgroundImage.height

    mouseGridX = clamp(step(mouseX, raster.rasterMass), raster.rasterMass, Math.min(maxW, window.width) - raster.rasterMass);
    mouseGridY = clamp(step(mouseY, raster.rasterMass), raster.rasterMass, Math.min(maxH, window.height) - raster.rasterMass);
}

function clamp(v, min, max) { return v < min ? min : v > max ? max : v }
function step(v, s) { return Math.round(v / s) * s }
