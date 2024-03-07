import { globalVerboseLevel } from "./Devtools.js";
import { raster } from "./paperSnake.js";

export class Liniensegment {

    constructor(gp_end, gp_start, type) {
        this.x1 = gp_start.x;
        this.y1 = gp_start.y;
        this.x2 = gp_end.x;
        this.y2 = gp_end.y;
        this.ctrl1 = new paper.Point(0, 0);
        this.ctrl2 = new paper.Point(0, 0);

        this.radius = raster.gridGapX / raster.scaleX;
        this.angle = 90;
        this.length = 4 * Math.tan(degreesToRadians(this.angle / 4)) / 3 * raster.scaleX;

        this.type = (type == undefined) ? this.getType() : type;
        this.createCurveOfType(this.type);
        if (globalVerboseLevel > 1)
            console.log(this.type);
    }
    //////////////// Zuordnung des Kurventyps ////////////////
    getType() {
        if (Math.abs(this.y1 - this.y2) <= 1)
            return "GERADE";

        else if (Math.abs(this.x1 - this.x2) <= raster.gridGapX)
            return "GERADE";

        else if (this.x1 > this.x2 && this.y1 < this.y2)
            return "KURVE_OBENLINKS_DOWN";

        else if (this.x1 < this.x2 && this.y1 > this.y2)
            return "KURVE_OBENLINKS_UP"

        else if (this.x2 > this.x1 && this.y2 > this.y1)
            return "KURVE_OBENRECHTS_DOWN";

        else if (this.x2 < this.x1 && this.y2 < this.y1)
            return "KURVE_OBENRECHTS_UP";

        else if (this.x2 < this.x1 && this.y2 < this.y1)
            return "KURVE_UNTENLINKS_UP";

        else if (this.x2 > this.x1 && this.y2 > this.y1)
            return "KURVE_UNTENLINKS_DOWN";

        else if (this.x1 > this.x2 && this.y1 < this.y2)
            this.type = "KURVE_UNTENRECHTS_DOWN";

        else if (this.x1 < this.x2 && this.y1 > this.y2)
            return "KURVE_UNTENRECHTS_UP";
    }

    createCurveOfType(type) {
        var handleIn, handleOut;

        switch (type) {

            case "KURVE_OBEN":
                this.angle = 180;
                this.length = 2 * Math.tan(degreesToRadians(this.angle / 4)) / 3 * raster.scaleX;

                this.start = new paper.Point(this.x1, this.y1);
                this.end = new paper.Point(this.x2, this.y2);

                handleIn = new paper.Point(0, -this.radius * this.length);
                handleOut = new paper.Point(0, -this.radius * this.length);

                break;

            case "KURVE_UNTEN":
                this.angle = 180;
                this.length = 2 * Math.tan(degreesToRadians(this.angle / 4)) / 3 * raster.scaleX;

                this.start = new paper.Point(this.x1, this.y1);
                this.end = new paper.Point(this.x2, this.y2);

                handleIn = new paper.Point(0, this.radius * this.length);
                handleOut = new paper.Point(0, this.radius * this.length);

                break;

            case "KURVE_LINKS":
                this.angle = 180;
                this.length = 2 * Math.tan(degreesToRadians(this.angle / 4)) / 3 * raster.scaleX;

                this.start = new paper.Point(this.x1, this.y1);
                this.end = new paper.Point(this.x2, this.y2);

                handleIn = new paper.Point(-this.radius * this.length, 0);
                handleOut = new paper.Point(-this.radius * this.length, 0);

                break;

            case "KURVE_RECHTS":
                this.angle = 180;
                this.length = 2 * Math.tan(degreesToRadians(this.angle / 4)) / 3 * raster.scaleX;

                this.start = new paper.Point(this.x1, this.y1);
                this.end = new paper.Point(this.x2, this.y2);

                handleIn = new paper.Point(this.radius * this.length, 0);
                handleOut = new paper.Point(this.radius * this.length, 0);

                break;

            case "GERADE":
                this.segment = new paper.Path.Line({
                    from: [this.x1, this.y1],
                    to: [this.x2, this.y2],
                    strokeWidth: 2,
                    strokeColor: 'white'
                });

                if (globalVerboseLevel > 1)
                    console.log(`neue Linie des Typs ${type}:\n ${this.x1}|${this.y1} \t ${this.x2}|${this.y2}`);

                return;

            case "KURVE_OBENLINKS_UP":

                this.start = new paper.Point(this.x1, this.y1);
                this.end = new paper.Point(this.x2, this.y2);

                handleIn = new paper.Point(-this.radius * this.length, 0);
                handleOut = new paper.Point(0, -this.radius * this.length);

                break;

            case "KURVE_OBENLINKS_DOWN":

                this.end = new paper.Point(this.x1, this.y1);
                this.start = new paper.Point(this.x2, this.y2);

                handleIn = new paper.Point(-this.radius * this.length, 0);
                handleOut = new paper.Point(0, -this.radius * this.length);

                break;

            case "KURVE_OBENRECHTS_UP":

                this.start = new paper.Point(this.x1, this.y1);
                this.end = new paper.Point(this.x2, this.y2);

                handleIn = new paper.Point(this.radius * this.length, 0);
                handleOut = new paper.Point(0, -this.radius * this.length);

                break;

            case "KURVE_OBENRECHTS_DOWN":

                this.end = new paper.Point(this.x1, this.y1);
                this.start = new paper.Point(this.x2, this.y2);

                handleIn = new paper.Point(this.radius * this.length, 0);
                handleOut = new paper.Point(0, -this.radius * this.length);

                break;

            case "KURVE_UNTENLINKS_UP":

                this.start = new paper.Point(this.x1, this.y1);
                this.end = new paper.Point(this.x2, this.y2);

                handleIn = new paper.Point(0, this.radius * this.length);
                handleOut = new paper.Point(-this.radius * this.length, 0);

                break;

            case "KURVE_UNTENLINKS_DOWN":
                this.end = new paper.Point(this.x1, this.y1);
                this.start = new paper.Point(this.x2, this.y2);

                handleIn = new paper.Point(0, this.radius * this.length);
                handleOut = new paper.Point(-this.radius * this.length, 0);

                break;

            case "KURVE_UNTENRECHTS_UP":

                this.start = new paper.Point(this.x1, this.y1);
                this.end = new paper.Point(this.x2, this.y2);

                handleIn = new paper.Point(0, this.radius * this.length);
                handleOut = new paper.Point(this.radius * this.length, 0);

                break;

            case "KURVE_UNTENRECHTS_DOWN":

                this.end = new paper.Point(this.x1, this.y1);
                this.start = new paper.Point(this.x2, this.y2);

                handleIn = new paper.Point(0, this.radius * this.length);
                handleOut = new paper.Point(this.radius * this.length, 0);

                break;
        }

        if (globalVerboseLevel > 1)
            console.log(`neue Linie des Typs ${type}:\n ${this.x1}|${this.y1} \t ${handleIn} \t ${handleOut} \t ${this.x2}|${this.y2}`);

        var firstSegment = new paper.Segment(this.start, null, handleOut);
        var secondSegment = new paper.Segment(this.end, handleIn, null);

        this.segment = new paper.Path({
            segments: [firstSegment, secondSegment],
        });
    }
}

function degreesToRadians(degrees) {
    const pi = Math.PI;
    return degrees * (pi / 180);
}
