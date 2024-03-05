//////////////////////////////////////////////////////////////////
////////////////////////////// RASTER ////////////////////////////
//////////////////////////////////////////////////////////////////
import { Liniensegment } from "./Liniensegmente.js";
import { realSheetLength, realGridSize, globalColor } from "./paperSnake.js";
import { setRadius } from "./paperUtils.js";

export class Raster {

    constructor(scaleX) {

        this.gridPoints = []; // linear list of grid points
        this.lineSegmentsTypeHistory = []; // linear list of segmentTypes
        this.gridGapX = realSheetLength / Math.floor(realSheetLength / realGridSize) * scaleX;
        this.line; // must be initialized after paper.setup()
        this.area;

        this.scaleX = scaleX;

        console.log(`raster created with gridSize=${this.gridGapX}, scaleX=${this.scaleX}`);
    }

    initialize() {
        this.line = new paper.Path();
        this.line.strokeColor = globalColor;
        this.line.strokeWidth = 2;

        this.area = new paper.Group();
        this.area.fillColor = new paper.Color(1, 0, 0, 0.45);
        this.area.closed = true;
    }

    ////////////////// FUNCTIONS ///////////////////

    // add line:
    addLine(ptAtSmallestDist) {
        console.log("create line with", ptAtSmallestDist.id);

        // toggle gridPoint:
        ptAtSmallestDist.selected = !ptAtSmallestDist.selected;
        let scaling = ptAtSmallestDist.selected ? this.gridGapX / 5 : 1.5;
        setRadius(ptAtSmallestDist, scaling); // size

        // add line:
        if (ptAtSmallestDist.selected) {
            this.gridPoints.push(ptAtSmallestDist);
            if (this.gridPoints.length > 1) {
                var previousGP =
                    this.gridPoints.at(this.gridPoints.length - 2);
                    console.log(previousGP);
                // this.gitterpunkte[gpIdx].updateDirection(gp_vorher);
                var ls = new Liniensegment(ptAtSmallestDist, previousGP);
                this.lineSegmentsTypeHistory.push(ls.type);
                this.line.join(ls.segment);
                
                for (let index = 0; index < this.line.segments.length; index++) {
                    let element = this.line.segments[index];
                    console.log(element.point.x, element.point.y);
                    
                }
            }
        } else { // remove line

            if (this.gridPoints.length > 1) {
                // find out which point was clicked:
                let idx = this.gridPoints.findIndex((dot) => (dot.id == ptAtSmallestDist.id));
                // remove from list:
                this.gridPoints.splice(idx, 1); // remove point
                this.lineSegmentsTypeHistory.splice([idx - 1], 1); // remove line
                if (idx != this.gridPoints.length - 1) // not last element → some line in between
                {
                    this.line.lastSegment.remove();
                    this.lineSegmentsTypeHistory.splice([idx], 1); // remove line
                }
            }         
        }
        // update path length:
        let pathLength = this.line.length / this.scaleX;
        document.getElementById("pathLength").textContent = pathLength.toFixed(3);

    }

    replaceLastCurve(type) {

        if (this.line.segments.length < 1) {
            console.log("no active points left to change curve")
            return;
        }

        console.log(`replace ${this.lineSegmentsTypeHistory[this.lineSegmentsTypeHistory.length - 1]} (${this.line.lastSegment}) with type ${type}`);

        this.lineSegmentsTypeHistory.pop(); // remove last linesegment helper
        this.line.lastSegment.remove();

        const ls = new Liniensegment(this.gridPoints[this.gridPoints.length - 1], this.gridPoints[this.gridPoints.length - 2], type);
        this.lineSegmentsTypeHistory.push(ls.type);
        this.line.join(ls.segment);
    }

    getPathDirection() {
        if (this.gridPoints.length < 2) return;
        if (this.gridPoints[this.gridPoints.length - 1].position.y < this.gridPoints[this.gridPoints.length - 2].position.y)
            return "UP";
        else return "DOWN";
    }
}