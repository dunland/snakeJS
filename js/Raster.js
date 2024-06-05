//////////////////////////////////////////////////////////////////
////////////////////////////// RASTER ////////////////////////////
//////////////////////////////////////////////////////////////////
import { globalVerboseLevel } from "./Devtools.js";
import { Liniensegment } from "./Liniensegmente.js";
import { globalColor } from "./paperSnake.js";

export class Raster {

    constructor(scaleFactor) {

        this.pxPerMM = scaleFactor;
        this.lineSegmentsTypeHistory = []; // linear list of segmentTypes
        this.realSheetDimHorizontal = 1861; // [mm]
        this.realSheetDimVertical = 591;  // [mm]
        this.realSheetMarginMin = 55; // Mindestabstand zu Rand und zwischen Pfaden [mm]
        this.gridGapX = this.realSheetDimHorizontal / Math.floor(this.realSheetDimHorizontal / this.realSheetMarginMin) * this.pxPerMM;
        this.gridGapY = this.realSheetDimVertical / Math.floor(this.realSheetDimVertical / this.realSheetMarginMin) * this.pxPerMM;
        this.line;     // must be initialized after paper.setup()
        this.nextLine; // dashed line that shows next line to be drawn
        this.area;     // group of blocked, non-clickacble areas
        this.roi;      // region of interest / work area


        console.log(`raster created with gridSize=${this.gridGapX}, pxPerMM=${this.pxPerMM}`);
    }

    initialize() {
        if (!this.line) {
            this.line = new paper.Path();
            this.line.strokeColor = globalColor;
            this.line.strokeWidth = 2;
        }

        if (!this.area) {
            this.area = new paper.Group();
            this.area.fillColor = new paper.Color(1, 0, 0, 0.45);
            this.area.closed = true;
        }
        this.nextLine = new Liniensegment(new paper.Point(0, 0), new paper.Point(0, 0));
    }

    recalculateGridGap() {
        this.gridGapX = this.realSheetDimHorizontal / Math.floor(this.realSheetDimHorizontal / this.realSheetMarginMin) * this.pxPerMM;
        this.gridGapY = this.realSheetDimVertical / Math.floor(this.realSheetDimVertical / this.realSheetMarginMin) * this.pxPerMM;
    }

    // add line:
    addLine(ptAtSmallestDist) {
        console.log(`create line with point #${ptAtSmallestDist.id}`);

        // TODO: toggle gridPoint instead of set to true:
        ptAtSmallestDist.selected = true;

        // add line:
        if (ptAtSmallestDist.selected) {
            if (this.line.segments.length < 1) {
                this.line.add(new paper.Point(ptAtSmallestDist));
                this.line.position = ptAtSmallestDist.position;
                return;
            }
            this.line.join(this.nextLine.segment);

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

    indicateNextLine(pt) {
        if (this.line.segments.length) {
            // remove old line:
            this.nextLine.segment.remove();

            // set new coordinates:
            this.nextLine.x1 = this.line.lastSegment.point.x;
            this.nextLine.y1 = this.line.lastSegment.point.y;
            this.nextLine.x2 = pt.x;
            this.nextLine.y2 = pt.y;

            // create new:
            this.nextLine.updatePathDirection();
            if (globalVerboseLevel > 3)
                console.log(this.nextLine.type, this.nextLine.direction);
            this.nextLine.createCurveOfType(this.nextLine.type); // type of line will be set using keys

            // graphics:
            this.nextLine.segment.dashArray = [4, 8];
            this.nextLine.segment.strokeColor = globalColor;
        }
    }

    // replaceLastCurve(type) {

    //     if (this.line.segments.length < 1) {
    //         console.log("no active points left to change curve")
    //         return;
    //     }

    //     console.log(`replace ${this.lineSegmentsTypeHistory[this.lineSegmentsTypeHistory.length - 1]} (${this.line.lastSegment}) with type ${type}`);

    //     this.lineSegmentsTypeHistory.pop(); // remove last linesegment helper
    //     let tempPoint = new paper.Point(this.line.lastSegment.point);
    //     this.line.lastSegment.remove();

    //     const ls = new Liniensegment(
    //         tempPoint,
    //         this.line.segments[this.line.segments.length - 1].point,
    //         type);
    //     this.lineSegmentsTypeHistory.push(ls.type);
    //     this.line.join(ls.segment);
    // }

    getPathDirection() {
        if (this.line.segments.length < 2) return;
        if (this.line.lastSegment.point.y < this.line.segments[this.line.segments.length - 2].point.y)
            return "UP";
        else return "DOWN";
    }
}