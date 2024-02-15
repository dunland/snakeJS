//////////////////////////////////////////////////////////////////
////////////////////////////// RASTER ////////////////////////////
//////////////////////////////////////////////////////////////////
import { Liniensegment } from "./Liniensegmente.js";

export class Raster {

    constructor() {

        this.gitterpunkte = []; // list of grid points
        this.activeGridPoints = []; // list of active grid points
        this.liniensegmente = [];
        this.rasterMass = 13;
        this.punktAbstand_x = this.rasterMass;
        this.punktAbstand_y = this.rasterMass;

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
        this.raster = raster;

        this.active = false;
    }
}