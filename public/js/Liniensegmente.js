import { globalVerboseLevel } from "./Devtools.js";
import { raster } from "./paperSnake.js";

export class Liniensegment {

    constructor(to, from, type) {
        this.x1 = from.x;
        this.y1 = from.y;
        this.x2 = to.x;
        this.y2 = to.y;
        this.ctrl1 = new paper.Point(0, 0);
        this.ctrl2 = new paper.Point(0, 0);

        this.radius = Math.abs(this.x1 - this.x2) / raster.pxPerMM;
        this.angle = 90;
        this.length = 4 * Math.tan(degreesToRadians(this.angle / 4)) / 3 * raster.pxPerMM;
        this.segment = null;

        if (type == undefined) this.updateTypeAndDirection();
        this.direction = ["", ""]; // ["LEFT"/"RIGHT", "UP"/"DOWN"]
        this.createCurveOfType(this.type);
        if (globalVerboseLevel > 1)
            console.log(this.type);
    }
    //////////////// Zuordnung des Kurventyps ////////////////
    updateTypeAndDirection() {
        if (Math.abs(this.y1 - this.y2) <= 1) {
            console.log("horizontal line");
            this.type = "GERADE";
        }

        else if (Math.abs(this.x1 - this.x2) <= raster.gridGapX) {
            console.log("vertical line");
            this.type = "GERADE";
        }

        else if (this.x1 > this.x2 && this.y1 < this.y2) {
            this.type = "KURVE_OBENLINKS";
            this.direction[1] = "DOWN";
        }

        else if (this.x1 < this.x2 && this.y1 > this.y2) {
            this.type = "KURVE_OBENLINKS"
            this.direction[1] = "UP";
        }

        else if (this.x2 > this.x1 && this.y2 > this.y1) {
            this.type = "KURVE_OBENRECHTS";
            this.direction[1] = "DOWN";
        }

        else if (this.x2 < this.x1 && this.y2 < this.y1) {
            this.type = "KURVE_OBENRECHTS";
            this.direction[1] = "UP";
        }

        else if (this.x2 < this.x1 && this.y2 < this.y1) {
            this.type = "KURVE_UNTENLINKS";
            this.direction[1] = "UP";
        }

        else if (this.x2 > this.x1 && this.y2 > this.y1) {
            this.type = "KURVE_UNTENLINKS";
            this.direction[1] = "DOWN";
        }

        else if (this.x1 > this.x2 && this.y1 < this.y2) {
            this.type = "KURVE_UNTENRECHTS";
            this.direction[1] = "DOWN";
        }

        else if (this.x1 < this.x2 && this.y1 > this.y2) {
            this.type = "KURVE_UNTENRECHTS";
            this.direction[1] = "UP";
        }
    }

    updatePathDirection() {
        if (this.segment.segments.length < 2) return;
        if (this.y2 < this.y1)
            this.direction[1] = "UP";
        else if (Math.abs(this.y1 - this.y2) < 1)
            this.direction[1] = "";
        else
            this.direction[1] = "DOWN";

        if (this.x2 < this.x1)
            this.direction[0] = "LEFT";
        else if (Math.abs(this.x1 - this.x2) < raster.gridGapX)
            this.direction[0] = ""
        else
            this.direction[0] = "RIGHT";

        if (globalVerboseLevel > 4)
            console.log(`${Math.round(this.x1)}, ${Math.round(this.y1)} -> ${Math.round(this.x2)}, ${Math.round(this.y2)}`);

    }

    createCurveOfType(type) {
        var handleIn, handleOut;
        this.radius = Math.abs(this.x1 - this.x2) / raster.pxPerMM;

        switch (type) {

            case "KURVE_OBEN":
                this.angle = 180;
                this.length = 2 * Math.tan(degreesToRadians(this.angle / 4)) / 3 * raster.pxPerMM;

                this.start = new paper.Point(this.x1, this.y1);
                this.end = new paper.Point(this.x2, this.y2);

                handleIn = new paper.Point(0, -this.radius * this.length);
                handleOut = new paper.Point(0, -this.radius * this.length);

                break;

            case "KURVE_UNTEN":
                this.angle = 180;
                this.length = 2 * Math.tan(degreesToRadians(this.angle / 4)) / 3 * raster.pxPerMM;

                this.start = new paper.Point(this.x1, this.y1);
                this.end = new paper.Point(this.x2, this.y2);

                handleIn = new paper.Point(0, this.radius * this.length);
                handleOut = new paper.Point(0, this.radius * this.length);

                break;

            case "KURVE_LINKS":
                this.radius = Math.abs(this.y1 - this.y2) / raster.pxPerMM;
                this.angle = 180;
                this.length = 2 * Math.tan(degreesToRadians(this.angle / 4)) / 3 * raster.pxPerMM;

                this.start = new paper.Point(this.x1, this.y1);
                this.end = new paper.Point(this.x2, this.y2);

                handleIn = new paper.Point(-this.radius * this.length, 0);
                handleOut = new paper.Point(-this.radius * this.length, 0);

                break;

            case "KURVE_RECHTS":
                this.radius = Math.abs(this.y1 - this.y2) / raster.pxPerMM;
                this.angle = 180;
                this.length = 2 * Math.tan(degreesToRadians(this.angle / 4)) / 3 * raster.pxPerMM;

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

                if (globalVerboseLevel > 2)
                    console.log(`Linie des Typs ${type}:\n ${this.x1}|${this.y1} \t ${this.x2}|${this.y2}`);

                return;

            case "KURVE_OBENLINKS":

                if (this.direction[1] == "UP") {
                    this.start = new paper.Point(this.x1, this.y1);
                    this.end = new paper.Point(this.x2, this.y2);

                    handleIn = new paper.Point(-this.radius * this.length, 0);
                    handleOut = new paper.Point(0, -this.radius * this.length);

                } else if (this.direction[1] == "DOWN") {
                    this.end = new paper.Point(this.x1, this.y1);
                    this.start = new paper.Point(this.x2, this.y2);

                    handleIn = new paper.Point(-this.radius * this.length, 0);
                    handleOut = new paper.Point(0, -this.radius * this.length);
                }
                break;

            case "KURVE_OBENRECHTS":
                if (this.direction[1] == "UP") {

                    this.start = new paper.Point(this.x1, this.y1);
                    this.end = new paper.Point(this.x2, this.y2);

                    handleIn = new paper.Point(this.radius * this.length, 0);
                    handleOut = new paper.Point(0, -this.radius * this.length);
                }
                else if (this.direction[1] == "DOWN") {

                    this.end = new paper.Point(this.x1, this.y1);
                    this.start = new paper.Point(this.x2, this.y2);

                    handleIn = new paper.Point(this.radius * this.length, 0);
                    handleOut = new paper.Point(0, -this.radius * this.length);
                }

                break;

            case "KURVE_UNTENLINKS":
                if (this.direction[1] == "UP") {
                    this.start = new paper.Point(this.x1, this.y1);
                    this.end = new paper.Point(this.x2, this.y2);

                    handleIn = new paper.Point(0, this.radius * this.length);
                    handleOut = new paper.Point(-this.radius * this.length, 0);
                }
                else if (this.direction[1] == "DOWN") {
                    this.end = new paper.Point(this.x1, this.y1);
                    this.start = new paper.Point(this.x2, this.y2);

                    handleIn = new paper.Point(0, this.radius * this.length);
                    handleOut = new paper.Point(-this.radius * this.length, 0);
                }

                break;

            case "KURVE_UNTENRECHTS":
                if (this.direction[1] == "UP") {

                    this.start = new paper.Point(this.x1, this.y1);
                    this.end = new paper.Point(this.x2, this.y2);

                    handleIn = new paper.Point(0, this.radius * this.length);
                    handleOut = new paper.Point(this.radius * this.length, 0);

                }
                else if (this.direction[1] == "DOWN") {

                    this.end = new paper.Point(this.x1, this.y1);
                    this.start = new paper.Point(this.x2, this.y2);

                    handleIn = new paper.Point(0, this.radius * this.length);
                    handleOut = new paper.Point(this.radius * this.length, 0);

                }
                break;
        }

        if (globalVerboseLevel > 2)
            console.log(`Linie des Typs ${type}:\n ${this.x1}|${this.y1} \t ${handleIn} \t ${handleOut} \t ${this.x2}|${this.y2}`);

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
