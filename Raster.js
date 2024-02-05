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
        this._color = (255, 255, 255); // TODO: must be color
    }

    ////////////////////////////// FUNCTIONS /////////////////////////////
    // --------------------------------------------
    enable_scaling_mode() {
        scaling_mode_is_on = true;
        choose_point_index = 0;
    }

    // --------------------------------------------
    set_scaling_point(point_x, point_y) {
        if (scaling_mode_is_on) {
            raster.scale_line[raster.choose_point_index] =
                new PVector(point_x, point_y);
            if (choose_point_index < 1) {
                choose_point_index++;
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
                            this.gitterpunkte.push(new GitterPunkt(x, y));
                        }
                    }

                } catch (e) {
                    println("keine Länge eingegeben oder Länge mit falschem Format ",
                        "(Dezimalstellen-Punkt statt Komma verwenden!)");
                }
                scaling_mode_is_on = false;
            }
        }
    }

    mouseClick() {
        if (mouseIsPressed === true) {

            console.log("click!");
            // Gitterpunkt an Stelle der Maus auswählen:
            for (let i = 0; i < this.gitterpunkte.length; i++) {
                var gp = this.gitterpunkte[i];
                if ((mouseX > gp.x - gp.x_toleranz && mouseX < gp.x + gp.x_toleranz) &&
                    mouseY > gp.y - gp.y_toleranz && mouseY < gp.y + gp.y_toleranz) {
                    gp.active = !gp.active;
                    if (gp.active) {
                        this.activeGridPoints.push(gp);
                        // neues Liniensegment:
                        if (this.activeGridPoints.length > 1) {
                            var gp_vorher =
                                this.activeGridPoints.at(this.activeGridPoints.length - 2);
                            this.liniensegmente.push(
                                new Liniensegment(gp, gp_vorher, this));
                            // TODO : gp.linie = zuletzterstelle Linie
                        }
                    } else {
                        this.activeGridPoints.remove(gp);
                        // entferne Liniensegment:
                        // TODO : alle aktiven gps müssen zugeordnete linie haben → entferne
                        // diese linie
                    }
                }
            }
        }

        if (this.scaling_mode_is_on) {
            if (this.choose_point_index < 1)
                this.set_scaling_point(mouseX, mouseY);
            else
                this.set_scaling_point(mouseX, int(this.scale_line[0].y));
        }
    }
}

/////////////////////////////////////////// /////////////////////////////
////////////////////////////// GITTERPUNKTE /////////////////////////////
/////////////////////////////////////////// /////////////////////////////
export class GitterPunkt {

    constructor(x_, y_) {
        this.x = x_;
        this.y = y_;
        this.x_toleranz = 10;
        this.y_toleranz = 10;
        this.underMouse = false;
        this.active = false;
    }

    render() {
        // weißen Gitterpunkt malen:
        // console.log(this.x, this.y);
        stroke(255);
        point(this.x, this.y);

        // grauen Kreis malen, wenn Maus in der Nähe:
        if (this.underMouse) {
            noStroke();
            fill(185, 185, 185, 80);
            ellipse(this.x, this.y, this.rasterMass / 3, this.rasterMass / 3);
        }

        // weißen Kreis malen, wenn aktiv:
        if (this.active) {
            fill(255);
            ellipse(this.x, this.y, this.rasterMass / 3, this.rasterMass / 3);
        }
        //else {
        //  fill(255);
        //  ellipse(this.x, this.y, this.rasterMass / 6, this.rasterMass / 6);
        //}
    }

    // schauen, ob die Maus in der Nähe ist:
    checkMouseOverlap() {
        if ((mouseX > this.x - this.x_toleranz && mouseX < this.x + this.x_toleranz) &&
            mouseY > this.y - this.y_toleranz && mouseY < this.y + this.y_toleranz) {
            this.underMouse = true;
        } else {
            this.underMouse = false;
        }
    }
}