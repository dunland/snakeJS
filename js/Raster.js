//////////////////////////////////////////////////////////////////
////////////////////////////// RASTER ////////////////////////////
//////////////////////////////////////////////////////////////////
import { Liniensegment } from "./Liniensegmente.js";
import { globalSheetLength, globalGridSize } from "./paperSnake.js";
import { setRadius } from "./paperUtils.js";

export class Raster {

    constructor(scaleX) {

        this.gridPoints = []; // linear list of grid points
        this.lineSegments = []; // TODO: replace with segmentHistory
        this.gridGap = globalSheetLength / Math.floor(globalSheetLength / globalGridSize) * scaleX;
        this.line; // must be initialized after paper.setup()
        this.area;

        this.scaleX = scaleX;
        this._color = (255, 255, 255);

        console.log(`raster created with gridSize=${this.gridGap}, scaleX=${this.scaleX}`);
    }

    initialize() {
        this.line = new paper.Path();
        this.line.strokeColor = 'white';
        this.line.strokeWidth = 2;

        this.area = new paper.Path();
        this.area.fillColor = new paper.Color(1, 0, 0, 0.45);
        this.area.closed = true;

        // this.gridPointGroup = new paper.Group();

    }

    ////////////////// FUNCTIONS ///////////////////

    // add line:
    addLine(ptAtSmallestDist) {
        console.log("create line with", ptAtSmallestDist.id);

        // toggle gridPoint:
        ptAtSmallestDist.selected = !ptAtSmallestDist.selected;
        let scaling = ptAtSmallestDist.selected ? this.gridGap / 5 : 1.5;
        setRadius(ptAtSmallestDist, scaling); // size

        // add line:
        if (ptAtSmallestDist.selected) {
            this.gridPoints.push(ptAtSmallestDist);
            if (this.gridPoints.length > 1) {
                var previousGP =
                    this.gridPoints.at(this.gridPoints.length - 2);
                // this.gitterpunkte[gpIdx].updateDirection(gp_vorher);
                var ls = new Liniensegment(ptAtSmallestDist, previousGP, this);
                this.lineSegments.push(ls);
                this.line.join(ls.segment);
            }
        } else {

            if (this.gridPoints.length > 1) {
                // find out which point was clicked:
                let idx = this.gridPoints.findIndex((dot) => (dot.id == ptAtSmallestDist.id));
                // remove from list:
                this.gridPoints.splice(idx, 1); // remove point
                this.lineSegments.splice([idx - 1], 1); // remove line
                if (idx != this.gridPoints.length - 1) // not last element → some line in between
                {
                    this.line.lastSegment.remove();
                    this.lineSegments.splice([idx], 1); // remove line
                }
            }         
        }
        // update path length:
        let pathLength = this.line.length / this.scaleX;
        document.getElementById("pathLength").textContent = pathLength.toFixed(3);
    }

    replaceLastCurve(type) {

        if (this.lineSegments.length < 1) {
            console.log("no active points left to change curve")
            return;
        }

        console.log(`replace ${this.lineSegments[this.lineSegments.length - 1].type} (${this.lineSegments[this.lineSegments.length - 1].segment}) with type ${type}`);

        this.lineSegments.pop(); // remove last linesegment helper
        this.line.lastSegment.remove();

        const ls = new Liniensegment(this.gridPoints[this.gridPoints.length - 1], this.gridPoints[this.gridPoints.length - 2], this, type);
        this.lineSegments.push(ls);
        this.line.join(ls.segment);
    }

    getPathDirection() {
        if (this.gridPoints.length < 2) return;
        if (this.gridPoints[this.gridPoints.length - 1].position.y < this.gridPoints[this.gridPoints.length - 2].position.y)
            return "UP";
        else return "DOWN";
    }
}