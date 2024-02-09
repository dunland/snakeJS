import { globalVerboseLevel } from "./Devtools.js";

export class Liniensegment {

    constructor(gp_start, gp_end, raster) {
        // this.start = gp_start; // Gitterpunkte
        // this.end = gp_end;
        this.x1 = gp_start.x;
        this.y1 = gp_start.y;
        this.x2 = gp_end.x;
        this.y2 = gp_end.y;
        this.ctrl1 = createVector(0,0,0);
        this.ctrl2 = createVector(0,0,0);
        this.raster = raster;
        this.typ = ""; // mögliche Typen: "HORIZONTALE", "VERTIKALE", "KURVE_UNTEN","KURVE_OBEN", "KURVE_LINKS", "KURVE_RECHTS"

        this.angle = 180;
        this.length = 4 * tan(radians(this.angle / 4)) / 3 * this.raster.scale_x;

        if (raster.activeGridPoints)
            this.typ_zuordnung();
        else
            console.log(
                "Liniensegment konnte nicht erzeugt werden, da es zu wenig aktive Gitterpunkte gibt.");
    }

    //////////////////////// Zuordnung des Kurventyps ////////////////////////////
    typ_zuordnung() {
        // --------------------------- gerade Linien: --------------------------
        if (this.y1 == this.y2)
            this.typ = "HORIZONTALE";
        else if (this.x1 == this.x2)
            this.typ = "VERTIKALE";

        // ------------------------------ Kurven: ------------------------------
        // KURVE OBEN LINKS; nach oben:
        else if (this.x1 > this.x2 && this.y1 < this.y2) {
            this.typ = "KURVE_OBENLINKS";
            this.angle = 90;
            // mittlere Linie:
            let radius = this.raster.rasterMass;
            length = 4 * tan(radians(this.angle / 4)) / 3 * this.raster.scale_x;

            this.start = createVector(this.x1, this.y1);
            this.ctrl1 = createVector(this.x1 - (radius * length), this.y1);
            this.ctrl2 = createVector(this.x2, this.y2 - (radius * length));
            this.end = createVector(this.x2, this.y2);
        }

        // KURVE OBEN LINKS; nach unten:
        else if (this.x1 < this.x2 && this.y1 > this.y2) {
            this.typ = "KURVE_OBENLINKS";
            this.angle = 90;
            // mittlere Linie:
            let radius = this.raster.rasterMass;
            length = 4 * tan(radians(this.angle / 4)) / 3 * this.raster.scale_x;

            this.start = createVector(this.x1, this.y1);
            this.ctrl1 = createVector(this.x1, this.y1 - (radius * length));
            this.ctrl2 = createVector(this.x2 - (radius * length), this.y2);
            this.end = createVector(this.x2, this.y2);
        }

        // oben rechts, von oben kommend:
        else if (this.x2 < this.x1 && this.y2 < this.y1) {
            this.typ = "KURVE_OBENRECHTS";
            console.log("oben rechts von oben kommend");

            this.angle = 90;
            // mittlere Linie:
            let radius = this.raster.rasterMass;
            length = 4 * tan(radians(this.angle / 4)) / 3 * this.raster.scale_x;

            this.start = createVector(this.x1, this.y1);
            this.ctrl1 = createVector(this.x1, this.y1 - (radius * length));
            this.ctrl2 = createVector(this.x2 + (radius * length), this.y2);
            this.end = createVector(this.x2, this.y2);
        }

        // oben rechts, von unten kommend:
        else if (this.x2 > this.x1 && this.y2 > this.y1) {
            this.typ = "KURVE_OBENRECHTS";
            console.log("oben rechts von unten kommend");

            this.angle = 90;
            // mittlere Linie:
            let radius = this.raster.rasterMass;
            length = 4 * tan(radians(this.angle / 4)) / 3 * this.raster.scale_x;

            this.start = createVector(this.x1, this.y1);
            this.ctrl1 = createVector(this.x1 + (radius * length), this.y1);
            this.ctrl2 = createVector(this.x2, this.y2 - (radius * length));
            this.end = createVector(this.x2, this.y2);
        }

        // unten links, von unten kommend:
        else if (this.x2 > this.x1 && this.y2 > this.y1) {
            this.typ = "KURVE_UNTENLINKS";
            console.log("unten links von unten kommend");

            this.angle = 90;
            // mittlere Linie:
            let radius = this.raster.rasterMass;
            length = 4 * tan(radians(this.angle / 4)) / 3 * this.raster.scale_x;

            this.start = createVector(this.x1, this.y1);
            this.ctrl1 = createVector(this.x1, this.y1 + (radius * length));
            this.ctrl2 = createVector(this.x2 - (radius * length), this.y2);
            this.end = createVector(this.x2, this.y2);
        }

        // unten links, von oben kommend:
        else if (this.x2 < this.x1 && this.y2 < this.y1) {
            this.typ = "KURVE_UNTENLINKS";
            console.log("unten links von oben kommend");

            this.angle = 90;
            // mittlere Linie:
            let radius = this.raster.rasterMass;
            length = 4 * tan(radians(this.angle / 4)) / 3 * this.raster.scale_x;

            this.start = createVector(this.x1, this.y1);
            this.ctrl1 = createVector(this.x1 - (radius * length), this.y1);
            this.ctrl2 = createVector(this.x2, this.y2 + (radius * length));
            this.end = createVector(this.x2, this.y2);
        }

        // unten rechts:
        else if (this.x1 > this.x2 && this.y1 < this.y2) {
            this.typ = "KURVE_UNTENRECHTS";
            console.log("unten rechts von unten kommend");

            this.angle = 90;
            let radius = this.raster.rasterMass;
            length = 4 * tan(radians(this.angle / 4)) / 3 * this.raster.scale_x;

            this.start = createVector(this.x1, this.y1);
            this.ctrl1 = createVector(this.x1 + (radius * length), this.y1);
            this.ctrl2 = createVector(this.x2, this.y2 + (radius * length));
            this.end = createVector(this.x2, this.y2);
        } else if (this.x1 < this.x2 && this.y1 > this.y2) {
            this.typ = "KURVE_UNTENRECHTS";
            console.log("unten rechts von oben kommend");

            this.angle = 90;
            let radius = this.raster.rasterMass;
            length = 4 * tan(radians(this.angle / 4)) / 3 * this.raster.scale_x;

            this.start = createVector(this.x1, this.y1);
            this.ctrl1 = createVector(this.x1 + (radius * length), this.y1);
            this.ctrl2 = createVector(this.x2, this.y2 + (radius * length));
            this.end = createVector(this.x2, this.y2);
        }

        console.log(`neue Linie des Typs ${this.typ}:\n ${this.x1}|${this.y1} \t ${this.ctrl1.x}|${this.ctrl1.y} \t ${this.ctrl2.x}|${this.ctrl2.y} \t ${this.x2}|${this.y2}`);
    }

    set_type(type_) {
        this.typ = type_;
        let radius;

        switch (type_) {
            case "KURVE_OBEN":
                radius = this.raster.rasterMass / 2;
                length = 4 * tan(radians(this.angle / 4)) / 3 * this.raster.scale_x;

                this.start = createVector(this.x1, this.y1);
                this.ctrl1 = createVector(this.x1, this.y1 - (radius * length));
                this.ctrl2 = createVector(this.x2, this.y2 - (radius * length));
                this.end = createVector(this.x2, this.y2);
                break;

            case "KURVE_UNTEN":
                radius = this.raster.rasterMass / 2;
                length = 4 * tan(radians(this.angle / 4)) / 3 * this.raster.scale_x;

                this.start = createVector(this.x1, this.y1);
                this.ctrl1 = createVector(this.x1, this.y1 + (radius * length));
                this.ctrl2 = createVector(this.x2, this.y2 + (radius * length));
                this.end = createVector(this.x2, this.y2);
                break;

            case "KURVE_OBENLINKS":

                if (this.x1 > this.x2 && this.y1 < this.y2) {

                    this.angle = 90;
                    // mittlere Linie:
                    radius = this.raster.rasterMass;
                    length = 4 * tan(radians(this.angle / 4)) / 3 * this.raster.scale_x;

                    this.start = createVector(this.x1, this.y1);
                    this.ctrl1 = createVector(this.x1 - (radius * length), this.y1);
                    this.ctrl2 = createVector(this.x2, this.y2 - (radius * length));
                    this.end = createVector(this.x2, this.y2);
                } else if (this.x1 < this.x2 && this.y1 > this.y2) {

                    this.angle = 90;
                    // mittlere Linie:
                    radius = this.raster.rasterMass;
                    length = 4 * tan(radians(this.angle / 4)) / 3 * this.raster.scale_x;

                    this.start = createVector(this.x1, this.y1);
                    this.ctrl1 = createVector(this.x1, this.y1 - (radius * length));
                    this.ctrl2 = createVector(this.x2 - (radius * length), this.y2);
                    this.end = createVector(this.x2, this.y2);
                }
                break;

            case "KURVE_OBENRECHTS":
                // oben rechts, von oben kommend:
                if (this.x2 < this.x1 && this.y2 < this.y1) {
                    console.log("oben rechts von oben kommend");

                    this.angle = 90;
                    // mittlere Linie:
                    radius = this.raster.rasterMass;
                    length = 4 * tan(radians(this.angle / 4)) / 3 * this.raster.scale_x;

                    this.start = createVector(this.x1, this.y1);
                    this.ctrl1 = createVector(this.x1, this.y1 - (radius * length));
                    this.ctrl2 = createVector(this.x2 + (radius * length), this.y2);
                    this.end = createVector(this.x2, this.y2);
                }

                // oben rechts, von unten kommend:
                else if (this.x2 > this.x1 && this.y2 > this.y1) {
                    console.log("oben rechts von unten kommend");

                    this.angle = 90;
                    // mittlere Linie:
                    radius = this.raster.rasterMass;
                    length = 4 * tan(radians(this.angle / 4)) / 3 * this.raster.scale_x;

                    this.start = createVector(this.x1, this.y1);
                    this.ctrl1 = createVector(this.x1 + (radius * length), this.y1);
                    this.ctrl2 = createVector(this.x2, this.y2 - (radius * length));
                    this.end = createVector(this.x2, this.y2);
                }

                break;

            case "KURVE_UNTENLINKS":
                // unten links, von unten kommend:
                if (this.x2 > this.x1 && this.y2 > this.y1) {
                   this.typ = "KURVE_UNTENLINKS";
                    console.log("unten links von unten kommend");

                    this.angle = 90;
                    // mittlere Linie:
                    radius = this.raster.rasterMass;
                    length = 4 * tan(radians(this.angle / 4)) / 3 * this.raster.scale_x;

                    this.start = createVector(this.x1, this.y1);
                    this.ctrl1 = createVector(this.x1, this.y1 + (radius * length));
                    this.ctrl2 = createVector(this.x2 - (radius * length), this.y2);
                    this.end = createVector(this.x2, this.y2);
                }

                // unten links, von oben kommend:
                else if (this.x2 < this.x1 && this.y2 < this.y1) {
                    this.typ = "KURVE_UNTENLINKS";
                    console.log("unten links von oben kommend");

                    this.angle = 90;
                    // mittlere Linie:
                    radius = this.raster.rasterMass;
                    length = 4 * tan(radians(this.angle / 4)) / 3 * this.raster.scale_x;

                    this.start = createVector(this.x1, this.y1);
                    this.ctrl1 = createVector(this.x1 - (radius * length), this.y1);
                    this.ctrl2 = createVector(this.x2, this.y2 + (radius * length));
                    this.end = createVector(this.x2, this.y2);
                }
                break;

            case "KURVE_UNTENRECHTS":
                if (this.x1 > this.x2 && this.y1 < this.y2) {
                    this.typ = "KURVE_UNTENRECHTS";
                    console.log("unten rechts von unten kommend");

                    this.angle = 90;
                    radius = this.raster.rasterMass;
                    length = 4 * tan(radians(this.angle / 4)) / 3 * this.raster.scale_x;

                    this.start = createVector(this.x1, this.y1);
                    this.ctrl1 = createVector(this.x1, this.y1 + (radius * length));
                    this.ctrl2 = createVector(this.x2 + (radius * length), this.y2);
                    this.end = createVector(this.x2, this.y2);
                } else if (this.x1 < this.x2 && this.y1 > this.y2) {
                   this.typ = "KURVE_UNTENRECHTS";
                    console.log("unten rechts von oben kommend");

                    this.angle = 90;
                    radius = this.raster.rasterMass;
                    length = 4 * tan(radians(this.angle / 4)) / 3 * this.raster.scale_x;

                    this.start = createVector(this.x1, this.y1);
                    this.ctrl1 = createVector(this.x1 + (radius * length), this.y1);
                    this.ctrl2 = createVector(this.x2, this.y2 + (radius * length));
                    this.end = createVector(this.x2, this.y2);
                }

                break;
        }
    }

    render() {

        let radius;
        const x1 = this.x1;
        const x2 = this.x2;
        const y1 = this.y1;
        const y2 = this.y2;
        const rastermass = this.raster.rasterMass;
        const angle = 180;

        noFill();
        stroke(255);
        switch (this.typ) {
            case "HORIZONTALE":
                line(x1, y1, x2, y2);
                if (globalVerboseLevel > 1) {
                    // obere linie:
                    line(x1, y1 - 10, x2, y2 - 10);
                    // untere Linie:
                    line(x1, y1 + 10, x2, y2 + 10);
                }
                break;
            case "VERTIKALE":
                line(x1, y1, x2, y2);
                if (globalVerboseLevel > 1) {
                    // linke linie:
                    line(x1 - 10, y1, x2 - 10, y2);
                    // rechte Linie:
                    line(x1 + 10, y1, x2 + 10, y2);
                }
                break;
            case "KURVE_OBEN":
                stroke(255);
                bezier(this.start.x, this.start.y, this.ctrl1.x, this.ctrl1.y, this.ctrl2.x, this.ctrl2.y, this.end.x,
                    this.end.y);
                break;
            case "KURVE_UNTEN":
                stroke(255);
                bezier(this.start.x, this.start.y, this.ctrl1.x, this.ctrl1.y, this.ctrl2.x, this.ctrl2.y, this.end.x,
                    this.end.y);

                break;

            case "KURVE_LINKS":

                radius = rastermass / 2;
                length = 4 * tan(radians(this.angle / 4)) / 3 * this.raster.scale_x;

                // mittlere Linie:
                this.start = createVector(x1, y1);
                this.ctrl1 = createVector(x1 - (radius * length), y1);
                this.ctrl2 = createVector(x2 - (radius * length), y2);
                this.end = createVector(x2, y2);

                stroke(255);
                bezier(this.start.x, this.start.y, this.ctrl1.x, this.ctrl1.y, this.ctrl2.x, this.ctrl2.y, this.end.x,
                    this.end.y);

                // äußere linie:
                if (globalVerboseLevel > 1) {

                    radius = (y1 < y2) ? (rastermass + rastermass / 3) / 2 : (rastermass - rastermass / 3) / 2;
                    length = 4 * tan(radians(this.angle / 4)) / 3 * this.raster.scale_x;

                    this.start = createVector(x1, y1 - 10);
                    this.ctrl1 = createVector(x1 - (radius * length), y1 - 10);
                    this.ctrl2 = createVector(x2 - (radius * length), y2 + 10);
                    this.end = createVector(x2, y2 + 10);

                    bezier(this.start.x, this.start.y, this.ctrl1.x, this.ctrl1.y, this.ctrl2.x, this.ctrl2.y, this.end.x,
                        this.end.y);

                    // innere linie:
                    radius = (y1 > y2) ? (rastermass + rastermass / 3) / 2 : (rastermass - rastermass / 3) / 2;
                    length = 4 * tan(radians(this.angle / 4)) / 3 * this.raster.scale_x;

                    this.start = createVector(x1, y1 + 10);
                    this.ctrl1 = createVector(x1 - (radius * length), y1 + 10);
                    this.ctrl2 = createVector(x2 - (radius * length), y2 - 10);
                    this.end = createVector(x2, y2 - 10);

                    // stroke(255,0,0);
                    bezier(this.start.x, this.start.y, this.ctrl1.x, this.ctrl1.y, this.ctrl2.x, this.ctrl2.y, this.end.x,
                        this.end.y);

                }
                break;

            case "KURVE_RECHTS":
                // mittlere Linie:
                radius = rastermass / 2;
                length = 4 * tan(radians(this.angle / 4)) / 3 * this.raster.scale_x;

                this.start = createVector(x1, y1);
                this.ctrl1 = createVector(x1 + (radius * length), y1);
                this.ctrl2 = createVector(x2 + (radius * length), y2);
                this.end = createVector(x2, y2);

                stroke(255);
                bezier(this.start.x, this.start.y, this.ctrl1.x, this.ctrl1.y, this.ctrl2.x, this.ctrl2.y, this.end.x,
                    this.end.y);

                if (globalVerboseLevel > 1) {

                    // äußere Linie:
                    radius = (y1 < y2) ? (rastermass + rastermass / 3) / 2 : (rastermass - rastermass / 3) / 2;
                    length = 4 * tan(radians(this.angle / 4)) / 3 * this.raster.scale_x;

                    this.start = createVector(x1, y1 - 10);
                    this.ctrl1 = createVector(x1 + (radius * length), y1 - 10);
                    this.ctrl2 = createVector(x2 + (radius * length), y2 + 10);
                    this.end = createVector(x2, y2 + 10);

                    bezier(this.start.x, this.start.y, this.ctrl1.x, this.ctrl1.y, this.ctrl2.x, this.ctrl2.y, this.end.x,
                        this.end.y);

                    // innere Linie:
                    radius = (y1 > y2) ? (rastermass + rastermass / 3) / 2 : (rastermass - rastermass / 3) / 2;
                    length = 4 * tan(radians(this.angle / 4)) / 3 * this.raster.scale_x;

                    this.start = createVector(x1, y1 + 10);
                    this.ctrl1 = createVector(x1 + (radius * length), y1 + 10);
                    this.ctrl2 = createVector(x2 + (radius * length), y2 - 10);
                    this.end = createVector(x2, y2 - 10);

                    bezier(this.start.x, this.start.y, this.ctrl1.x, this.ctrl1.y, this.ctrl2.x, this.ctrl2.y, this.end.x,
                        this.end.y);
                }

                break;

            case "KURVE_OBENLINKS":
                try {
                    bezier(this.start.x, this.start.y, this.ctrl1.x, this.ctrl1.y, this.ctrl2.x, this.ctrl2.y, this.end.x, this.end.y);

                    
                    // Kontrollpunkte:
                    if (globalVerboseLevel > 0) {
                        noStroke();
                        fill(193, 96, 118);
                        ellipse(this.ctrl1.x, this.ctrl1.y, 10, 10);
                        fill(62, 147, 101);
                        ellipse(this.ctrl2.x, this.ctrl2.y, 10, 10);
                    }

                } catch (error) {
                    console.log("cannot draw curved line - dots are on same axis?")
                }

                break;

            case "KURVE_OBENRECHTS":
                try {
                    bezier(this.start.x, this.start.y, this.ctrl1.x, this.ctrl1.y, this.ctrl2.x, this.ctrl2.y, this.end.x, this.end.y);
                    
                    // Kontrollpunkte:
                    if (globalVerboseLevel > 0) {
                        noStroke();
                        fill(193, 96, 118);
                        ellipse(this.ctrl1.x, this.ctrl1.y, 10, 10);
                        fill(62, 147, 101);
                        ellipse(this.ctrl2.x, this.ctrl2.y, 10, 10);
                    }
                } catch (error) {
                    console.log("cannot draw curved line - dots located on same axis?")
                }
                break;

            case "KURVE_UNTENLINKS":
                try {
                    bezier(this.start.x, this.start.y, this.ctrl1.x, this.ctrl1.y, this.ctrl2.x, this.ctrl2.y, this.end.x, this.end.y);
                    
                    // Kontrollpunkte:
                    if (globalVerboseLevel > 0) {
                        noStroke();
                        fill(193, 96, 118);
                        ellipse(this.ctrl1.x, this.ctrl1.y, 10, 10);
                        fill(62, 147, 101);
                        ellipse(this.ctrl2.x, this.ctrl2.y, 10, 10);
                    }
                } catch (error) {
                    console.log("cannot draw curved line - dots located on same axis?")
                }

                break;

            case "KURVE_UNTENRECHTS":
                try {
                    bezier(this.start.x, this.start.y, this.ctrl1.x, this.ctrl1.y, this.ctrl2.x, this.ctrl2.y, this.end.x, this.end.y);
                    
                    
                    // Kontrollpunkte:
                    if (globalVerboseLevel > 0) {
                        noStroke();
                        fill(193, 96, 118);
                        ellipse(this.ctrl1.x, this.ctrl1.y, 10, 10);
                        fill(62, 147, 101);
                        ellipse(this.ctrl2.x, this.ctrl2.y, 10, 10);
                    }
                } catch (error) {
                    console.log("cannot draw curved line - dots located on same axis?")
                }
                break;

            default:
                break;
        }
    }
}