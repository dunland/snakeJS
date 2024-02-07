//////////////////////////////////////////////////////////////////
////////////////////////////// RASTER ////////////////////////////
//////////////////////////////////////////////////////////////////

export class Raster {

    constructor(rows, cols, rasterMass) {

        this.gitterpunkte = []; // list of grid points
        // this.activeGridPoints = []; // list of active grid points
        this.liniensegmente = [];
        this.rasterMass = rasterMass;
        this.punktAbstand_x = this.rasterMass;
        this.punktAbstand_y = this.rasterMass;
        
        rows = Math.floor(rows / rasterMass);
        cols = Math.floor(cols / rasterMass);
        this.activePoints = new Array(rows).fill(false).map(() => new Array(cols).fill(false));
        // var this.activePoints = [[],[]]
        console.log(this.activePoints);

        this.scaling_mode_is_on = false;
        this.choose_point_index = 0;
        //   PVector[] scale_line = new PVector[2]; // TODO: vectors in JS?

        this.scale_x = 1;
        this._color = (255, 255, 255);
    }

    ////////////////////// FUNCTIONS ////////////////////
    render(backgroundImage) {
        for (let x = 0; x < Math.floor(Math.min(width, backgroundImage.width) / this.rasterMass * this.scale_x); x++) {
            for (let y = 0; y < Math.floor(Math.min(height, backgroundImage.height) / this.rasterMass * this.scale_x); y++) {

                // weißen Kreis malen, wenn aktiv:
                if (this.activePoints[x][y]) {
                    fill(255);
                    ellipse(x * this.rasterMass * this.scale_x, y * this.rasterMass * this.scale_x, this.rasterMass / 3, this.rasterMass / 3);
                }
                else {
                    // weißen Gitterpunkt malen:
                    stroke(255);
                    point(x * this.rasterMass * this.scale_x, y * this.rasterMass * this.scale_x);
                }
            }
        }
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

        this.x_toleranz = 10;
        this.y_toleranz = 10;
        this.active = false;
    }

    render() {
        // weißen Kreis malen, wenn aktiv:
        if (this.active) {
            fill(255);
            ellipse(this.x, this.y, this.raster.rasterMass / 3, this.raster.rasterMass / 3);
        }
        else {
            // weißen Gitterpunkt malen:
            stroke(255);
            point(this.x, this.y);

        }
    }
}