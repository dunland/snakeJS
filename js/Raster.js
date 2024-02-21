//////////////////////////////////////////////////////////////////
////////////////////////////// RASTER ////////////////////////////
//////////////////////////////////////////////////////////////////
import { Liniensegment } from "./Liniensegmente.js";
import { cursor } from "./paperSnake.js";
import { setRadius } from "./paperUtils.js";

export class Raster {

    constructor(rasterMass, scaleX) {

        this.gitterpunkte = []; // list of grid points
        this.gridPointHistory = [];
        this.gridCirclePaths = []; // list of paper.Path.Circles
        this.activeGridPoints = []; // linear list of active grid points
        this.liniensegmente = []; // TODO: replace with segmentHistory
        this.rasterMass = rasterMass * scaleX;
        this.punktAbstand_x = this.rasterMass;
        this.punktAbstand_y = this.rasterMass;
        this.line; // must be initialized after paper.setup()
        this.area;

        this.scaling_mode_is_on = false;
        this.choose_point_index = 0;
        //   PVector[] scale_line = new PVector[2]; // TODO: vectors in JS?

        this.scaleX = scaleX;
        this._color = (255, 255, 255);
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
        for (let x = 0; x < dimX; x += this.rasterMass) {
            for (let y = 0; y < dimY; y += this.rasterMass) {
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

        for (var i = 0; i<this.gridPointGroup.children.length; i++){
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
        let scaling = this.gitterpunkte[gpIdx].active ? this.rasterMass / 5 : 1.5;
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

    // --------------------------------------------
    enable_scaling_mode() {
        this.scaling_mode_is_on = true;
        this.choose_point_index = 0;
    }

    // --------------------------------------------
    set_scaling_point(point_x, point_y) {
        if (this.scaling_mode_is_on) {
            this.scale_line[this.choose_point_index] =
                new PVector(point_x, point_y);
            if (this.choose_point_index < 1) {
                this.choose_point_index++;
            } else {
                try {
                    let input = float(ui.showTextInputDialog(
                        "Maße in [cm] eingeben (als float mit Dezimal-Punkt)"));
                    let v_diff = scale_line[0].dist(scale_line[1]);
                    scale_x = v_diff / input;
                    println("scale_x = ", v_diff, "px /", input, "cm =", scale_x,
                        "px/cm");
                    settings.setFloat("scale_x", scale_x);
                    saveJSONObject(settings, "settings.json");

                    // neue Gitterpunkte erstellen:
                    this.gitterpunkte = [];   // clear
                    this.liniensegmente = []; // clear
                    for (let x = 0; x < width; x += this.punktAbstand_x * this.scaleX) {
                        for (let y = 0; y < width; y += this.punktAbstand_y * this.scaleX) {
                            this.gitterpunkte.push(new GitterPunkt(x, y, this));
                        }
                    }

                } catch (e) {
                    println("keine Länge eingegeben oder Länge mit falschem Format ",
                        "(Dezimalstellen-Punkt statt Komma verwenden!)");
                }
                this.scaling_mode_is_on = false;
            }
        }
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