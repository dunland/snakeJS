import { raster } from "./snake.js";

// line example:
var line = {
    type: 'line',
    origin: [0, 0],
    end: [50, 50]
};

// dxf example:
// var points = [[0, 100], [0, 0], [100, 0]];
// var curve1 = new makerjs.models.BezierCurve(points);
// curve1.origin = [20, 20];
// more accurate
// var curve2 = new makerjs.models.BezierCurve(points, 0.01);

// var model = {
//     models: {
//       c1: curve1, c2: curve2
//     }
//   };

// json output example:

var model = {
    models: {
        c1: {
            points: [[0, 100], [0, 0], [100, 0]], // ctrl, ctrl, end??
            origin: [20, 20]}, // x1, y1
        c2: {
            points: [[0, 100], [0, 0], [100, 0]],
            origin: [40, 40]
        },
        l1: {
            type: 'line',
            origin: [0, 0],
            end: [50, 50]
        }
    }
};


export function exportLines() {

    // TODO: 
    // - [ ] Iteration durch alle Liniensegmente und Automatisierung des jsonObject
    // - [ ] Diskriminierung zwischen unterschiedlichen Geometrien (Line / Bezier)

    const ls = raster.liniensegmente[0];
    const model = {
        models: {
            c1: {
                points: [
                    [ls.x1, ls.y1],
                    [ls.ctrl1.x, ls.ctrl1.y], 
                    [ls.ctrl2.x, ls.ctrl2.y], 
                    [ls.x2, ls.y2]], // start, ctrl, [ctrl,...] end
                origin: [ls.x1, ls.y1]}, // x1, y1
            c2: {
                points: [[0, 100], [0, 0], [100, 0]],
                origin: [40, 40]
            },
            l1: {
                type: 'line',
                origin: [0, 0],
                end: [50, 50]
            }
        }
    };

    return model;

}