import { changeMode, raster } from "./snake.js";
import { globalVerboseLevel } from "./Devtools.js";
import { Liniensegment } from "./Liniensegmente.js";

export var mouseGridX, mouseGridY;

// Tastaturbefehle:
export function keyPressed(keyEvent) {
    let key = keyEvent.key;
    console.log(key);
    // exportiere DXF mit Taste 'r':
    if (key == 'R' || key == 'r') {
        changeMode("DXF_EXPORT");
    }
    if (key == 'W' || key == 'w')
        raster.liniensegmente.at(raster.liniensegmente.length - 1).replaceCurve("KURVE_OBEN");
    if (key == 'A' || key == 'a')
        raster.liniensegmente.at(raster.liniensegmente.length - 1).typ = "KURVE_LINKS";
    if (key == 'S' || key == 's')
        raster.liniensegmente.at(raster.liniensegmente.length - 1).replaceCurve("KURVE_UNTEN");
    if (key == 'D' || key == 'd')
        raster.liniensegmente.at(raster.liniensegmente.length - 1).typ = "KURVE_RECHTS";
    if (key == 'Q' || key == 'q')
        raster.liniensegmente.at(raster.liniensegmente.length - 1).replaceCurve("KURVE_OBENLINKS");
    if (key == 'E' || key == 'e')
        raster.liniensegmente.at(raster.liniensegmente.length - 1).replaceCurve("KURVE_OBENRECHTS");
    if (key == 'Y' || key == 'y')
        raster.liniensegmente.at(raster.liniensegmente.length - 1).replaceCurve("KURVE_UNTENLINKS");
    if (key == 'X' || key == 'x')
        raster.liniensegmente.at(raster.liniensegmente.length - 1).replaceCurve("KURVE_UNTENRECHTS");
    if (key == ' ') {
        if (raster.liniensegmente[raster.liniensegmente.length - 1].typ == "HORIZONTALE")
            raster.liniensegmente[raster.liniensegmente.length - 1].typ = "VERTIKALE";
        else if (raster.liniensegmente[raster.liniensegmente.length - 1].typ == "VERTIKALE")
            raster.liniensegmente[raster.liniensegmente.length - 1].typ = "HORIZONTALE";
        else
            raster.liniensegmente[raster.liniensegmente.length - 1].typ = "HORIZONTALE";
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
