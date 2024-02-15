import { globalVerboseLevel } from "./Devtools.js";

export class Liniensegment {

    constructor(gp_end, gp_start, raster, liniensegmente) {
        this.x1 = gp_start.position.x;
        this.y1 = gp_start.position.y;
        this.x2 = gp_end.position.x;
        this.y2 = gp_end.position.y;
        this.ctrl1 = new paper.Point(0, 0);
        this.ctrl2 = new paper.Point(0, 0);
        this.raster = raster;
        this.liniensegmente = liniensegmente; // TODO: ersetzen durch "line". Es wird hier immer nur ein segment geben!
        this.typ = ""; // mögliche Typen: "HORIZONTALE", "VERTIKALE", "KURVE_UNTEN","KURVE_OBEN", "KURVE_LINKS", "KURVE_RECHTS"

        this.angle = 180;
        this.length = 4 * Math.tan(degreesToRadians(this.angle / 4)) / 3 * this.raster.scale_x;

        if (raster.activeGridPoints) // do not allocate first activePoint
            this.setType();
        else
            console.log(
                "Liniensegment konnte nicht erzeugt werden, da es zu wenig aktive Gitterpunkte gibt.");
    }

    //////////////////////// Zuordnung des Kurventyps ////////////////////////////
    setType() {
        let radius;
        // --------------------------- gerade Linien: --------------------------
        if (this.y1 == this.y2) {
            this.typ = "HORIZONTALE";

            this.liniensegmente.push(new paper.Path.Line({
                from: [this.x1, this.y1],
                to: [this.x2, this.y2],
                strokeWidth: 2,
                strokeColor: 'white'
            }));
            return;
        }

        else if (this.x1 == this.x2) {
            this.typ = "VERTIKALE";

            this.liniensegmente.push(new paper.Path.Line({
                from: [this.x1, this.y1],
                to: [this.x2, this.y2],
                strokeWidth: 2,
                strokeColor: 'white'
            }));
            return;
        }

        // ---------------------- Kurven: ------------------------
        // KURVE OBEN LINKS; nach oben:
        else if (this.x1 > this.x2 && this.y1 < this.y2) {
            this.typ = "KURVE_OBENLINKS";
            this.angle = 90;
            // mittlere Linie:
            radius = this.raster.rasterMass;
            const length = 4 * Math.tan(degreesToRadians(this.angle / 4)) / 3 * this.raster.scale_x;

            this.end = new paper.Point(this.x1, this.y1);
            this.ctrl1 = new paper.Point(this.x1 - (radius * length), this.y1);
            this.ctrl2 = new paper.Point(this.x2, this.y2 - (radius * length));
            this.start = new paper.Point(this.x2, this.y2);
            this.liniensegmente.push(this.createCurveOfType(this.typ));
            return;
        }

        // KURVE OBEN LINKS; nach unten:
        else if (this.x1 < this.x2 && this.y1 > this.y2) {
            this.typ = "KURVE_OBENLINKS";
            this.angle = 90;
            // mittlere Linie:
            radius = this.raster.rasterMass;
            length = 4 * Math.tan(degreesToRadians(this.angle / 4)) / 3 * this.raster.scale_x; // TODO: * (relativeDiffX);

            this.start = new paper.Point(this.x1, this.y1);
            this.ctrl1 = new paper.Point(this.x1, this.y1 - (radius * length));
            this.ctrl2 = new paper.Point(this.x2 - (radius * length), this.y2);
            this.end = new paper.Point(this.x2, this.y2);
            this.liniensegmente.push(this.createCurveOfType(this.typ));
            return;
        }


        // oben rechts, von unten kommend:
        else if (this.x2 < this.x1 && this.y2 < this.y1) {
            this.typ = "KURVE_OBENRECHTS";
            console.log("oben rechts von unten kommend");

            this.angle = 90;
            // mittlere Linie:
            let radius = this.raster.rasterMass;
            length = 4 * Math.tan(degreesToRadians(this.angle / 4)) / 3 * this.raster.scale_x;

            this.start = new paper.Point(this.x1, this.y1);
            this.ctrl1 = new paper.Point(this.x1, this.y1 - (radius * length));
            this.ctrl2 = new paper.Point(this.x2 + (radius * length), this.y2);
            this.end = new paper.Point(this.x2, this.y2);

            this.liniensegmente.push(this.createCurveOfType(this.typ));
            return;
        }

        // oben rechts, von oben kommend:
        else if (this.x2 > this.x1 && this.y2 > this.y1) {
            this.typ = "KURVE_OBENRECHTS";
            console.log("oben rechts von oben kommend");

            this.angle = 90;
            // mittlere Linie:
            let radius = this.raster.rasterMass;
            length = 4 * Math.tan(degreesToRadians(this.angle / 4)) / 3 * this.raster.scale_x;

            this.start = new paper.Point(this.x2, this.y2);
            this.ctrl1 = new paper.Point(this.x1 + (radius * length), this.y1);
            this.ctrl2 = new paper.Point(this.x2, this.y2 - (radius * length));
            this.end = new paper.Point(this.x1, this.y1);

            this.liniensegmente.push(this.createCurveOfType(this.typ));
            return;

        }

        // unten links, von oben kommend:
        else if (this.x2 > this.x1 && this.y2 > this.y1) {
            this.typ = "KURVE_UNTENLINKS";
            console.log("unten links von oben kommend");

            this.angle = 90;
            // mittlere Linie:
            let radius = this.raster.rasterMass;
            length = 4 * Math.tan(degreesToRadians(this.angle / 4)) / 3 * this.raster.scale_x;

            this.start = new paper.Point(this.x1, this.y1);
            this.ctrl1 = new paper.Point(this.x1, this.y1 + (radius * length));
            this.ctrl2 = new paper.Point(this.x2 - (radius * length), this.y2);
            this.end = new paper.Point(this.x2, this.y2);

            this.liniensegmente.push(this.createCurveOfType(this.typ));
            return;
        }

        // unten links, von unten kommend:
        else if (this.x2 < this.x1 && this.y2 < this.y1) {
            this.typ = "KURVE_UNTENLINKS";
            console.log("unten links von unten kommend");

            this.angle = 90;
            // mittlere Linie:
            let radius = this.raster.rasterMass;
            length = 4 * Math.tan(degreesToRadians(this.angle / 4)) / 3 * this.raster.scale_x;

            this.end = new paper.Point(this.x1, this.y1);
            this.ctrl1 = new paper.Point(this.x1 - (radius * length), this.y1);
            this.ctrl2 = new paper.Point(this.x2, this.y2 + (radius * length));
            this.start = new paper.Point(this.x2, this.y2);

            this.liniensegmente.push(this.createCurveOfType(this.typ));
            return;
        }

        // unten rechts:
        else if (this.x1 > this.x2 && this.y1 < this.y2) {
            this.typ = "KURVE_UNTENRECHTS";
            console.log("unten rechts von unten kommend");

            this.angle = 90;
            let radius = this.raster.rasterMass;
            length = 4 * Math.tan(degreesToRadians(this.angle / 4)) / 3 * this.raster.scale_x;

            this.start = new paper.Point(this.x1, this.y1);
            this.ctrl1 = new paper.Point(this.x1 + (radius * length), this.y1);
            this.ctrl2 = new paper.Point(this.x2, this.y2 + (radius * length));
            this.end = new paper.Point(this.x2, this.y2);

            this.liniensegmente.push(this.createCurveOfType(this.typ));
            return;

        } else if (this.x1 < this.x2 && this.y1 > this.y2) {
            this.typ = "KURVE_UNTENRECHTS";
            console.log("unten rechts von oben kommend");

            this.angle = 90;
            let radius = this.raster.rasterMass;
            length = 4 * Math.tan(degreesToRadians(this.angle / 4)) / 3 * this.raster.scale_x;

            this.end = new paper.Point(this.x1, this.y1);
            this.ctrl1 = new paper.Point(this.x1 + (radius * length), this.y1);
            this.ctrl2 = new paper.Point(this.x2, this.y2 + (radius * length));
            this.start = new paper.Point(this.x2, this.y2);

            this.liniensegmente.push(this.createCurveOfType(this.typ));
            return;
        }
    }

    createCurveOfType(type) {
        // create curve:
        var radius = this.raster.rasterMass;
        switch (type) {

            case "KURVE_OBENLINKS":

                var handleIn = new paper.Point(-radius * length, 0);
                var handleOut = new paper.Point(0, -radius * length);

                case "KURVE_OBENRECHTS":

                var handleIn = new paper.Point(radius * length, 0);
                var handleOut = new paper.Point(0, -radius * length);

            case "KURVE_UNTENLINKS":

                var handleIn = new paper.Point(0, radius * length);
                var handleOut = new paper.Point(-radius * length, 0);

            case "KURVE_UNTENRECHTS":

                var handleIn = new paper.Point(0, radius * length);
                var handleOut = new paper.Point(radius * length, 0);

        }

        console.log(`neue Linie des Typs ${type}:\n ${this.x1}|${this.y1} \t ${this.ctrl1.x}|${this.ctrl1.y} \t ${this.ctrl2.x}|${this.ctrl2.y} \t ${this.x2}|${this.y2}`);

        var firstSegment = new paper.Segment(this.start, null, handleOut);
        var secondSegment = new paper.Segment(this.end, handleIn, null);

        return new paper.Path({
            segments: [firstSegment, secondSegment]
            // strokeColor: 'white',
            // strokeWidth: 2
        });

    }

    replaceCurve(type) {
        console.log(`replace ${this.liniensegmente[this.liniensegmente.length - 1]} with type ${type}`);
        
        this.liniensegmente[this.liniensegmente.length - 1].replaceWith(this.createCurveOfType(type));
    }

}

function degreesToRadians(degrees) {
    const pi = Math.PI;
    return degrees * (pi / 180);
}
