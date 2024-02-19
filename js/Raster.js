//////////////////////////////////////////////////////////////////
////////////////////////////// RASTER ////////////////////////////
//////////////////////////////////////////////////////////////////
import { Liniensegment } from "./Liniensegmente.js";

export class Raster {

    constructor() {

        this.gitterpunkte = []; // list of grid points
        this.gridPointHistory = [];
        this.gridDots = []; // list of paper.Path.Circles
        this.activeGridPoints = []; // list of active grid points
        this.liniensegmente = []; // TODO: replace with segmentHistory
        this.rasterMass = 13;
        this.punktAbstand_x = this.rasterMass;
        this.punktAbstand_y = this.rasterMass;
        this.line; // must be initialized after paper.setup()
        this.area;

        this.scaling_mode_is_on = false;
        this.choose_point_index = 0;
        //   PVector[] scale_line = new PVector[2]; // TODO: vectors in JS?

        this.scale_x = 1;
        this._color = (255, 255, 255);
    }

    ////////////////// FUNCTIONS ///////////////////

    createPoints(dimX, dimY) {
        for (let x = 0; x < dimX; x += this.punktAbstand_x * this.scale_x) {
            for (let y = 0; y < dimY; y += this.punktAbstand_y * this.scale_x) {
                this.gitterpunkte.push(new GitterPunkt(x, y, this));
            }
        }
        console.log(this.gitterpunkte.length, " Gitterpunkte erstellt.");

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
                    for (let x = 0; x < width; x += this.punktAbstand_x * this.scale_x) {
                        for (let y = 0; y < width; y += this.punktAbstand_y * this.scale_x) {
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
        console.log(this.direction)

    }
}