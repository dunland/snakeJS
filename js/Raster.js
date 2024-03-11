//////////////////////////////////////////////////////////////////
////////////////////////////// RASTER ////////////////////////////
//////////////////////////////////////////////////////////////////
import { Liniensegment } from "./Liniensegmente.js";
import { globalColor } from "./paperSnake.js";

export class Raster {

    constructor(scaleX) {

        this.lineSegmentsTypeHistory = []; // linear list of segmentTypes
        this.realSheetLength = 1861; // [mm]
        this.realSheetWidth = 591; // [mm]
        this.realSheetMargin = 55; // Mindestabstand zu Rand und zwischen Pfaden [mm]
        this.gridGapX = this.realSheetLength / Math.floor(this.realSheetLength / this.realSheetMargin) * scaleX;
        this.line; // must be initialized after paper.setup()
        this.area; // group of blocked, non-clickacble areas
        this.roi;  // region of interest / work area

        this.pxPerMM = scaleX;

        console.log(`raster created with gridSize=${this.gridGapX}, pxPerMM=${this.pxPerMM}`);
    }

    initialize() {
        if (!this.line){
            this.line = new paper.Path();
            this.line.strokeColor = globalColor;
            this.line.strokeWidth = 2;
        }

        if (!this.area){
            this.area = new paper.Group();
            this.area.fillColor = new paper.Color(1, 0, 0, 0.45);
            this.area.closed = true;
        }
    }

    ////////////////// FUNCTIONS ///////////////////

    // add line:
    addLine(ptAtSmallestDist) {
        console.log("create line with", ptAtSmallestDist.id);

        // toggle gridPoint:
        ptAtSmallestDist.selected = !ptAtSmallestDist.selected;

        // add line:
        if (ptAtSmallestDist.selected) {
            if (this.line.segments.length < 1) {
                this.line.add(new paper.Point(ptAtSmallestDist));
                this.line.position = ptAtSmallestDist.position;
                return;
            }

            var ls = new Liniensegment(ptAtSmallestDist.position, this.line.lastSegment.point);
            this.lineSegmentsTypeHistory.push(ls.type);
            this.line.join(ls.segment);

            for (let index = 0; index < this.line.segments.length; index++) {
                let element = this.line.segments[index];
            }
        } else { // remove line

            if (this.line.segments.length < 1) return;
            // find out which point was clicked:
            // let idx = this.gridPoints.findIndex((dot) => (dot.id == ptAtSmallestDist.id));
            // remove from list:
            // this.gridPoints.splice(idx, 1); // remove point
            // this.lineSegmentsTypeHistory.splice([idx - 1], 1); // remove line
            // if (idx != this.gridPoints.length - 1) // not last element → some line in between
            console.log("segment removal not implemented! use undo button instead.");
            // {
            //     this.line.lastSegment.remove();
            //     this.lineSegmentsTypeHistory.splice([idx], 1); // remove line
            // }

        }
        // update path length:
        let pathLength = this.line.length / this.pxPerMM / 1000;
        document.getElementById("pathLength").textContent = pathLength.toFixed(3);

    }

    replaceLastCurve(type) {

        if (this.line.segments.length < 1) {
            console.log("no active points left to change curve")
            return;
        }

        console.log(`replace ${this.lineSegmentsTypeHistory[this.lineSegmentsTypeHistory.length - 1]} (${this.line.lastSegment}) with type ${type}`);

        this.lineSegmentsTypeHistory.pop(); // remove last linesegment helper
        let tempPoint = new paper.Point(this.line.lastSegment.point);
        this.line.lastSegment.remove();

        const ls = new Liniensegment(
            tempPoint,
            this.line.segments[this.line.segments.length - 1].point,
            type);
        this.lineSegmentsTypeHistory.push(ls.type);
        this.line.join(ls.segment);
    }

    getPathDirection() {
        if (this.line.segments.length < 2) return;
        if (this.line.lastSegment.point.y < this.line.segments[this.line.segments.length - 2].point.y)
            return "UP";
        else return "DOWN";
    }
}