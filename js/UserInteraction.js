import { changeMode } from "./snake.js";
import { globalVerboseLevel } from "./Devtools.js";
import { Liniensegment } from "./Liniensegmente.js";
import { raster } from "./paperSnake.js";

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
        raster.replaceCurve("KURVE_OBEN");
    if (key == 'A' || key == 'a')
        raster.liniensegmente.at(raster.liniensegmente.length - 1).typ = "KURVE_LINKS";
    if (key == 'S' || key == 's')
        raster.replaceCurve("KURVE_UNTEN");
    if (key == 'D' || key == 'd')
        raster.liniensegmente.at(raster.liniensegmente.length - 1).typ = "KURVE_RECHTS";
    if (key == 'Q' || key == 'q')
        raster.replaceCurve("KURVE_OBENLINKS_" + raster.gridPointHistory[raster.gridPointHistory.length - 1].direction);
    if (key == 'E' || key == 'e')
        raster.replaceCurve("KURVE_OBENRECHTS_" + raster.gridPointHistory[raster.gridPointHistory.length - 1].direction);
    if (key == 'Y' || key == 'y')
        raster.replaceCurve("KURVE_UNTENLINKS_" + raster.gridPointHistory[raster.gridPointHistory.length - 1].direction);
    if (key == 'X' || key == 'x')
        raster.replaceCurve("KURVE_UNTENRECHTS_" + raster.gridPointHistory[raster.gridPointHistory.length - 1].direction);
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
    if (key == 'g' || key == 'G') {
        let buttonShowGrid = document.getElementById("buttonShowGrid");
        raster.gridDots.forEach((dot) => {
            dot.visible = !dot.visible;
        });
        buttonShowGrid.classList.toggle("active");
    }
}
