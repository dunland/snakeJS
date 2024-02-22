//////////////////////////////////////////////////////////////////
////////////////////////////// RASTER ////////////////////////////
//////////////////////////////////////////////////////////////////
import { Liniensegment } from "./Liniensegmente.js";
import { cursor, globalSheetLength, globalGridSize } from "./paperSnake.js";
import { setRadius } from "./paperUtils.js";

export class Raster {

    constructor(scaleX) {

        this.gitterpunkte = []; // list of grid points
        this.gridPointHistory = [];
        this.gridCirclePaths = []; // list of paper.Path.Circles
        this.activeGridPoints = []; // linear list of active grid points
        this.liniensegmente = []; // TODO: replace with segmentHistory
        this.gridSize = globalSheetLength / Math.floor(globalSheetLength / globalGridSize) * scaleX;
        this.punktAbstand_x = this.gridSize;
        this.punktAbstand_y = this.gridSize;
        this.line; // must be initialized after paper.setup()
        this.area;

        this.scaleX = scaleX;
        this._color = (255, 255, 255);

        console.log(`raster created with gridSize=${this.gridSize}, scaleX=${this.scaleX}`);
    }

    initialize() {
        this.line = new paper.CompoundPath();
        this.line.strokeColor = 'white';
        this.line.strokeWidth = 2;

        this.area = new paper.Path();
        this.area.fillColor = new paper.Color(1, 0, 0, 0.45);
        this.area.closed = true;

        this.gridPointGroup = new paper.Group();

    }

    ////////////////// FUNCTIONS ///////////////////

    createPoints(dimX, dimY) {
        for (let x = 0; x < dimX; x += this.gridSize) {
            for (let y = 0; y < dimY; y += this.gridSize) {
                this.gitterpunkte.push(new GitterPunkt(x, y, this));
                const pt = new paper.Point(x, y);
                this.gridCirclePaths.push(new paper.Path.Circle({
                    center: pt,
                    radius: 1,
                    fillColor: 'white',
                    visible: document.getElementById("buttonShowGrid").classList.contains("active")
                }));

                this.gridPointGroup.addChild(this.gridCirclePaths[this.gridCirclePaths.length - 1]);
                this.gridCirclePaths[this.gridCirclePaths.length - 1].onMouseDown = function (event) {

                    console.log("you clicked", this);

                }
            }
        }
        console.log(this.gitterpunkte.length, " Gitterpunkte erstellt.");
    }

    removeGridPoints() {

        for (var i = 0; i < this.gridCirclePaths.length; i++) {
            this.gridCirclePaths[i].remove();
        }

        this.gitterpunkte = [];
        this.gridCirclePaths = [];
    }

    // add line:
    addLine(posX, posY) {
        posX = Math.floor(posX);
        posY = Math.floor(posY);
        console.log(posX, posY)
        const gpIdx = this.gitterpunkte.findIndex((el) => (Math.floor(el.x) == Math.floor(posX) && Math.floor(el.y) == Math.floor(posY)));
        const gp = this.gridCirclePaths[gpIdx];

        for (var i = 0; i < this.gridPointGroup.children.length; i++) {
            var gridPoint = this.gridPointGroup.children[i];
            if (cursor.contains(gridPoint))
                console.log("treffer!");
        }

        if (!gp) {
            console.log("no gp at ", posX, posY);
            return;
        }

        // toggle gridPoint:
        this.gitterpunkte[gpIdx].active = !this.gitterpunkte[gpIdx].active; // helper
        let scaling = this.gitterpunkte[gpIdx].active ? this.gridSize / 5 : 1.5;
        setRadius(gp, scaling); // size

        // add or remove gp:
        if (this.gitterpunkte[gpIdx].active) { // add
            this.activeGridPoints.push(gp);
            this.gridPointHistory.push(this.gitterpunkte[gpIdx]);

            // neues Liniensegment:
            if (this.activeGridPoints.length > 1) {
                var gp_vorher =
                    this.activeGridPoints.at(this.activeGridPoints.length - 2);
                this.gitterpunkte[gpIdx].updateDirection(gp_vorher);
                var ls = new Liniensegment(gp, gp_vorher, this);
                this.liniensegmente.push(ls);
                this.line.addChild(ls.segment);
            }
        } else { // remove
            // TODO: To remove a segment from a path, we use the path. removeSegment(index) function and pass it the index of the segment we want to remove. // TODO: associate gridPoints with line segments id
            // TODO: remove the specific linesegment helper
            // TODO: remove specific gp from active list
        }
    }

    replaceCurve(type) {

        if (this.liniensegmente.length < 1) {
            console.log("no active points left to change curve")
            return;
        }

        console.log(`replace ${this.liniensegmente[this.liniensegmente.length - 1].type} (${this.liniensegmente[this.liniensegmente.length - 1].segment}) with type ${type}`);

        this.line.lastChild.remove(); // remove last segment
        this.liniensegmente.pop(); // remove last linesegment helper

        const ls = new Liniensegment(this.activeGridPoints[this.activeGridPoints.length - 1], this.activeGridPoints[this.activeGridPoints.length - 2], this, type);
        this.liniensegmente.push(ls);

        this.line.addChild(ls.segment); // add new segment
    }
}

////////////////////////////////////////////////////////////
//////////////////////// GITTERPUNKTE //////////////////////
////////////////////////////////////////////////////////////
export class GitterPunkt {

    constructor(x_, y_, raster) {
        this.x = x_;
        this.y = y_;
        this.direction; // up or down, relative to last gp

        this.active = false;
    }

    updateDirection(gpPrior) {
        if (gpPrior.position.y > this.y)
            this.direction = "UP";
        else
            this.direction = "DOWN";

    }
}