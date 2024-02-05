export var record = false;

// Tastaturbefehle:
export function keyPressed() {
    println(key);
    // exportiere DXF mit Taste 'r':
    if (key == 'R' || key == 'r') {
        record = true;
    }
    if (key == 'W' || key == 'w')
        liniensegmente.at(liniensegmente.length - 1).set_type("KURVE_OBEN");
    if (key == 'A' || key == 'a')
        liniensegmente.at(liniensegmente.length - 1).typ = "KURVE_LINKS";
    if (key == 'S' || key == 's')
        liniensegmente.at(liniensegmente.length - 1).set_type("KURVE_UNTEN");
    if (key == 'D' || key == 'd')
        liniensegmente.at(liniensegmente.length - 1).typ = "KURVE_RECHTS";
    if (key == 'Q' || key == 'q')
        liniensegmente.at(liniensegmente.length - 1).set_type("KURVE_OBENLINKS");
    if (key == 'E' || key == 'e')
        liniensegmente.at(liniensegmente.length - 1).set_type("KURVE_OBENRECHTS");
    if (key == 'Y' || key == 'y')
        liniensegmente.at(liniensegmente.length - 1).set_type("KURVE_UNTENLINKS");
    if (key == 'X' || key == 'x')
        liniensegmente.at(liniensegmente.length - 1).set_type("KURVE_UNTENRECHTS");
    if (key == ' ') {
        if (liniensegmente.at(liniensegmente.length - 1).typ == "HORIZONTALE")
            liniensegmente.at(liniensegmente.length - 1).typ = "VERTIKALE";
        else if (liniensegmente.at(liniensegmente.length - 1).typ == "VERTIKALE")
            liniensegmente.at(liniensegmente.length - 1).typ = "HORIZONTALE";
        else
            liniensegmente.at(liniensegmente.length - 1).typ = "HORIZONTALE";
    }
    if (key == '+' || key == 'ȉ') {
        globalVerboseLevel++;
        println("globalVerboseLevel = ", globalVerboseLevel);
    }
    if (key == '-') {
        globalVerboseLevel--;
        println("globalVerboseLevel = ", globalVerboseLevel);
    }
    if (key == 'n' || key == 'N') {
        raster.enable_scaling_mode();
    }
}