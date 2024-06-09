## To do

- [ ] **Interaktion**
	- [ ] (Pfadbearbeitung: Hinzufügen, Entfernen, Ändern von Pfadsegmenten)
	- [ ] **Platten längs oder quer**: 
		- [x] Pfeiltasten hoch/runter bewegen nur Reihe wenn vertikal
		- [x] **Platzieren** ist irgendwie komisch (Versatz entsteht, wenn ich zweiten Knopf benutze)
		- [ ] Skalieren macht alles kaputt, wenn in vertikalmodus
- [ ] Rastergröße ändern, wenn bereits gezeichnet wurde
- [ ] Projektmanager: Bilddatei händisch auswählbar?

- Distanzmessung mit Komma `,` in input möglich?
- [ ] Nach Laden des Projektes sind mehr Platten beweglich, als die Zeile lang ist...
- [ ] (Warum sind Rasterpunkte manchmal außerhalb der Platten?)

## refactor & beautifications

- **mehr Dialoge!**
	- [ ] Projekt laden: Dialog öffnen, Ordner auswählen
	- [ ] Projekt laden: Fehlermeldung, wenn keine `project.json`
- [ ] UI-beautification: Bilddiagonale messen: Bilddiagonale anzeigen!

- [ ] Anzeige von kritischen Plattengrenzen & Gestößen
- [ ] remove gridPoints out of bounds
- [ ] undo area: auch lastSegment rückänderbar machen (einfach wenn mode == area)
- [ ] **bug:** Bildskalierung läuft total schief..??
- [ ] nach Speichern link einblenden ?!
- [ ] feste Radien = 200
- [ ] **SVG als Eingangsbild** (scale to roi.height / window.height)
- [ ] **bug:** movableSheetsFrom und To werden bei Projekt laden nicht gut geladen -> muss immer Platten neu berechnen
- [ ] gestrichelte Hilfslinie automatisch nach Quadranten und Richtung?

## log

05.06.2024

- [x] **händisch einzelne Platten** oder alle links / alle rechts **verschieben**
	- `Shift` und `Control` auch bei Lukas so?	
- [x] wenn Plattenlänge und -breite vertauscht sind, ist Rastergröße (um ca. die Hälfte?) verschoben
- [x] Raster auch neu berechnen, wenn Platten-Randabstand geändert wird

25.03.2024

- [x] gestrichelte Linie für nächsten Pfad

19.03.2024

- [x] **bug**: Wenn sheets von import geladen, werden die alten nicht entfernt, wenn recreate from input fields!
	- `parseInt(inputValue)` hat gefehlt!
- [x] plus-minus-knopf für feintuning der Skalierung

13.03.2024, 14.03.2024

- [x] Linienwerkzeug nur möglich wenn raster.roi existiert
- [x] Batch Skripte zum Installieren, Starten und Beenden
- [x] measure distance hat bei lukas nen bug
		- [x] Distanzmessung via Bilddiagonale
- [x] Schreiben in Input Fields führt alle keydown functions aus.. 
- [x] **zweiter Arbeitsbereich muss entfernt werden**
	- [x] Arbeitsbereich erstellen -> recreateSheets()
- [x] Sheets werden initial falsch erstellt, wenn Bild noch nicht geladen ist!
	- [x] --> erst erstellen, wenn Arbeitsbereich definiert?
	
12.03.2024

- [x] **Layout**
	- [x] merge start.html -> index.html ("Rasterabstand" -> "Mindest-Randabstand")
	- [x] Symbol für A und D
	- [x] Hinweis: Platten bewegen mit Leerzeichen
	- [x] gridGapX und Y anzeigen
- [x] Raster mit alternierender Helligkeit
	- erstmal via opacity = 0.5
- Verschnitt reparieren... hier unverwendeter, hilfreicher Code:

``` javascript
let tempObj = new paper.Path();
for (let index = 0; index < sheetsGroup.children.length; index++) {
	if (raster.roi.intersects(sheetsGroup.children[index])) {
		sheetsUsed++;
		tempObj = raster.roi.intersect(sheetsGroup.children[index]);
		if (raster.area.children.length) // area not undefined
			if (sheetsGroup.children[index].intersects(raster.area)) {
				tempObj = tempObj.subtract(raster.area);
				console.log(`${sheetHelpers[index].label.content} intersects raster.area`);
			}
			tempObj.fillColor = 'green';
			console.log(sheetHelpers[index].label.content, tempObj.area);
			tempObj.removeOnMove()
		}
	}
```

11.03.2024

- [x] **Ausschließen der Plattenelemente von Aussparungen**, berechnen der Gesamtfläche
- [x] Buttons unterhalb von Canvas
	- gelöst durch Abfrage, ob Maus in Canvas ist
- [ ]  **Arbeitsfläche bewegbar** machen (bisher Workaround: Eingangsbild anpassen)
	- [  ] ✎ edit segments
	- [  ] 🗘 remake
	- [x] neu hinzufügen
- deprecated:

``` javascript
export function selectNextRow(sheetsGroup, direction) {
	movableSheetsFrom = (movableSheetsFrom + (sheetsPerRow * direction));
	movableSheetsTo = movableSheetsTo + (sheetsPerRow * direction);
	if (movableSheetsFrom < 0 || movableSheetsTo > sheetsGroup.children.length) {
		movableSheetsFrom = 0;
		movableSheetsTo = sheetsPerRow;
		}

	// style:
	sheetsGroup.strokeWidth = 1;
	sheetsGroup.strokeColor = globalColor;
	for (var i = movableSheetsFrom; i < movableSheetsTo; i++) {
		sheetsGroup.children[i].strokeWidth = 4;
	}
}
```

10.03.2024

- mehrere Platten via intersect verschieben: Wie kann ich gridDots verschieben?
	- [x] gridDots mit sheetGroup in eine sheetGroup?
	- für Verschieben der sheetHelpers.gridDots bräuchte es nämlich die movableSheetsFrom und -To... **die Dinger benutzen!**
	- alternativ: cursorHorizontalLine

``` javascript
// paperSnake.js:
cursorVertical = new paper.Path.Line({
from: [0, 100],
to: [100, 100]
// strokeColor: 'black'
})

// UserInteraction.js:
onMouseMove(){
	cursorVertical.segments[0].point = [0, event.point.y];
	cursorVertical.segments[1].point = [raster.roi.bounds.topRight.x, event.point.y];
}

// Platten.js
export function selectRowBySheet_() {
	activeSheets = [];
	// style:
	sheetsGroup.strokeWidth = 1;
	sheetsGroup.strokeColor = globalColor;
	
	for (let index = 0; index < sheetsGroup.children.length; index++) {
		const sheet = sheetsGroup.children[index];
		if (sheet.intersects(cursorHorizontal)){
			sheet.strokeWidth = 4;
			activeSheets.push(sheet);
		}
	}
}
```

- [x] **Radius immer = x_dist**
- [x] Pfadlänge in Metern angeben

05.03.2024

- [x] **Projektmanager**
	- [x] [Export und import des ganzen Projektes](https://paperjs.org/reference/project/#exportjson)
	- [x] Startpage: neues Projekt
	- [x] das **Einfügen von Bildern** (Fotos) und Zeichnungen von Wänden und Angeben der Dimensionen (Längen/Größe der Wand) 
- [x] **Farben** von Linien, Kreisen etc einstellbar machen
- [x] Pfeile hoch und runter macht Pfad kaputt, da sich gridPoints verschieben! -> **sollte via `raster.line.lastSegment` als gp_previous gelöst werden!**

03.03.2024

- [x] kann Platten bei importiertem Projekt nicht bewegen --> überprüfe nochmal das laden von sheetsHelpers und sheetsGroup!
- [x] **export raster.gridPoints**
	- [x] als `[[x], [y]]` --> nicht praktikabel, da `let idx = this.gridPoints.findIndex((dot) => (dot.id == ptAtSmallestDist.id));` nicht präzise funktionieren wird..

01.03.2024

- **load project**: pass JSON to website while refresh: open project by url: `http://localhost:3000/?projectData=beispielbild.json`
- download JSON:

``` javascript
  // Unfortunately, due to browser security restrictions, JavaScript running in the browser cannot directly write files to disk for security reasons:
const blob = new Blob([projectExport], { type: 'application/json'});
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = fileName;
link.click();
```

26.02.2024:

- [x] **Verschieben einzelner Reihen (Versatz um Rastermaß)**
- **translate gridDots:** hat letztendlich nicht funktioniert wie gewollt; musste die gridDots neu erstellen.. 
  Was vllt hätte klappen können:

``` javascript
sheetHelpers[i].gridDots.position.x = child.bounds.topLeft.x + child.bounds.width/2; // hat so nicht geklappt

sheetHelpers[i].gridDots.position.x = child.position.x - sheetHelpers[i].gridGapX * i; // und so auch nicht.. Problem: um i verset zt!

sheetHelpers[i].gridDots.position.y = child.position.y; // scheint zu klappen!
```

22.02.2024

- Platten in ROI:
``` javascript
if (!platten.children[i].isInside(canvasArea.bounds))
    platten.children[i].fillColor = 'red';
// ODER
if (!canvasArea.bounds.contains(platten.children[i].bounds))
    platten.children[i].fillColor = 'red';
// ODER
if (!canvasArea.bounds.contains(platten.children[i].bounds.center))
	// ...
```

21.02.2024

- Manchmal werden gp beim klicken nicht erwischt, da minimal anderes Raster bei Erstellung als bei Erfassung durch mouseGridX und mouseGridY
	- [x] → clamp() und step() auch bei erstellung verwenden??

20.02.2024

- toggle tools via JS:

``` javascript
// toggle modes:
Array.prototype.forEach.call(document.getElementsByClassName("tool"), (element) => {
console.log(element);
element.classList.remove("active");
});
this.classList.toggle("active");
```

14.02.2024

- **Markierung von Aussparungen** wie z.B. Fenster, die nicht nutzbar sind
	- [x] Polygons malen auf neues PaperScope
		- [ ] https://paperjs.org/reference/size/
	- [ ] Überlappung checken → gridPunkt nicht erstellen, wenn Überlappung 
	- [x] Skalieren von gridPoints durch button-toggle vllt so: https://groups.google.com/g/paperjs/c/xJTDWTQIFwQ
	- [x] [raster-compoundPath](https://paperjs.org/reference/compoundpath/)

12.02.2024

- **Paper.js** *offers different approaches for its integration in the browser. The simplest way is to use PaperScript, our extension of JavaScript that facilitates a few things along the way. For more advanced users or bigger projects it might be preferable to work directly with JavaScript, as described in the tutorial about [Using JavaScript Directly](https://paperjs.org/tutorials/getting-started/using-javascript-directly/).*
	- `npm install paper` → include as module: *Cannot read properties of undefined (reading 'acorn')* → **do not include as module!**
	- include from `js/paper/paperjs-v0.12.17/dist/paper-full.js`: *Unable to find canvas with id "null"*
	- `<script type="text/javascript" src="./js/paper/paperjs-v0.12.17/dist/paper-core.js"></script>` → keine Fehlermeldung ✓
- **Paper.js performance** ebenfalls leider noch langsam (merkt man bei mouseMove wenn gridPoints gerendert werden)

07.02.2024, 08.02.2024

- **dxf export** mit maker.js
	- **Problem: import funktioniert nicht**..
		- wenn via `index.html` geladen: `./js/browser.maker.js`: *require not defined*
		- wenn in `index.html` via `<script type="module">`: in VSCode verfügbar, doch *snake.js:189 Uncaught ReferenceError: MakerJs is not defined*
	- `browserify main.js -o bundle.js`: *Error: Can't walk dependency graph: ENOENT: no such file or directory, lstat* `'/home/dav/github/snakeJS/async_hooks'` *required by `/home/dav/github/snakeJS/node_modules/on-finished/index.js`*
		- [ ] Alternative: **[webpack](https://webpack.js.org/concepts/)** oder **rollback** ausprobieren
	- **browserify**: [articles](https://browserify.org/articles.html)
		- [ ] [Browserify Handbook](https://github.com/substack/browserify-handbook)
		- [ ] [Introduction to Browserify (tumblr)](http://superbigtree.tumblr.com/post/54873453939/introduction-to-browserify)
		- [ ] [Frontend Dependency Management with Browserify (bit.ly)](http://word.bitly.com/post/101360133837/browserify)
		- [ ] [How Browserify works](http://benclinkinbeard.com/posts/how-browserify-works/)
		- [ ] [Sharing Code between nodeJS and the browser](https://blog.codecentric.de/en/2014/02/cross-platform-javascript/)
		- [ ] [NPM Everywhere](http://slid.es/azer/npm)
		- [ ] ...
	- **[Routing mit Express](https://expressjs.com/en/starter/basic-routing.html)** ✓
		- [dxf file export](https://maker.js.org/docs/exporting/#DXF)✓
		- [x] Liniensegmente als json → dxf file export
			- [x] Bezier → dxf
		- [ ] oder: Paths als SVG aus p5.js → import via `const dxf = makerjs.exporter.toDXF(makerjs.importer.fromSVGPathData(svg));`

 - [x] performance optimieren: dots als shader??... nicht mehr nötig, da dots nur bei mouseOver erscheinen
- [p5js Performance issues](https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance)
	- frameRate(15)... immernoch langsam
	- **ChatGPT**:
		- [ ] *Use noLoop() and redraw(): If your dots don't need to be updated continuously, you can use the noLoop() function to stop the draw loop and only redraw when needed using the redraw() function.*
		- [x] *Offscreen Buffer: Instead of drawing directly to the canvas, you can draw to an offscreen buffer using createGraphics() and then draw the buffer to the canvas. This can improve performance, especially if you're doing complex calculations or drawing operations.*
			- [methods cannot be called!!](https://github.com/processing/p5.js/issues/3916)
		- [ ] *Batch Rendering: Instead of drawing each dot individually, you can batch render them using shapes like circles or rectangles. This can significantly reduce the number of draw calls and improve performance.*
		- *Use WebGL Renderer: If your browser supports it, switching to the WebGL renderer (createCanvas(width, height, WEBGL)) can sometimes provide better performance for complex drawings.* **WEBGL ist auf jeden Fall viel schneller** ✓ **aber braucht besondere Grafikeinstellungen**: https://github.com/processing/p5.js/wiki/Getting-started-with-WebGL-in-p5
			- [WebGL1 vs webGL2](https://webgl2fundamentals.org/webgl/lessons/webgl2-whats-new.html) ... `createCanvas(width, height, WEBGL)` erzeugt webgl2 renderer
		- [ ] *Optimize Drawing Operations: Make sure you're only performing necessary drawing operations inside the draw loop. Avoid unnecessary calculations or operations that don't contribute to the final result.*
		- [ ] *Profile and Optimize: Use browser developer tools to profile your code and identify performance bottlenecks. Once you identify them, you can optimize those parts of your code to improve performance.*

06.02.2024

- Dotgrid cursor:
``` javascript
function isEqual (a, b) { return a.x === b.x && a.y === b.y }
function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
function step (v, s) { return Math.round(v / s) * s }
```
- **Upload images**
- [using nodeJS+Multer+Express](https://www.digitalocean.com/community/tutorials/nodejs-uploading-files-multer-express) / https://www.golinuxcloud.com/node-js-upload-file/

05.02.2024

- [x] **read JSON in nodeJS**:
- nodeJS: https://blog.logrocket.com/reading-writing-json-files-node-js-complete-tutorial/
> You can use the require function to synchronously load JSON files in Node. After loading a file using require, it is cached. Therefore, loading the file again using require will load the cached version. In a server environment, the file will be loaded again in the next server restart. It is therefore advisable to use require for loading static JSON files such as configuration files that do not change often. Do not use require if the JSON file you load keeps changing, because it will cache the loaded file and use the cached version if you require the same file again. Your latest changes will not be reflected.

- client: https://www.freecodecamp.org/news/how-to-read-json-file-in-javascript/

- [x] `npm start`: *Uncaught SyntaxError: Cannot use import statement outside a module*

``` javascript
// using p5js as a module, the functions have to be called manually at the bottom of the script:

window.setup = setup;
window.draw = draw;
```

02.02.2024

- [x] Wenn in html `<script src="./snake.js"></script>` → *Uncaught SyntaxError: import declarations may only appear at top level of a module*

- [x] Wenn `<script type="module" src="./snake.js"></script>` → *function setup und function draw werden nicht ausgeführt*

--------------------------------------------------------
### Namensgebung

Therm = Termiten = Thermiten
THERMisch ITErativ ENtwurf

Warm, Wurm, Wärme
Paperworm
Wandwɐrm, **Wandwurm**

--------------------------------------------------------
## Recherche

### verwandte Projekte und Frameworks:

- [maker.js](https://maker.js.org/) - [GitHub](https://github.com/microsoft/maker.js) - [Doc](http://maker.js.org/docs/) *2D vector line drawing and shape modeling for CNC and laser cutters.*
	- [Bezier.js](https://github.com/Pomax/bezierjs) wird auch benötigt
- [Dotgrid](https://github.com/hundredrabbits/Dotgrid) *is a grid-based vector drawing software designed to create logos, icons and type. It supports layers, the full SVG specs and additional effects such as mirroring and radial drawing. Dotgrid exports to both PNG and SVG files.*
	- exportiert png oder **svg** → lässt sich direkt in FreeCAD importieren als Path → Draft Menü → "Draft to Sketch" ✓ **da ließe sich ein Makro draus machen..**
	- [ ] Evaluieren:
		- [ ] Übertragen von meinen Kurven
		- [ ] Einfügen von Bildern
		- [ ] dxf-Integration
- [Python Scripting in FreeCAD](https://wiki.freecad.org/Python_scripting_tutorial/de)
	- [ ] Überlagern von Bildern?
- [Python ezdxf](https://ezdxf.readthedocs.io/) *is a Python package to create new DXF documents and read/modify/write existing DXF documents*
	- auch mit [add-on](https://ezdxf.readthedocs.io/en/stable/addons/drawing.html) to render DXF documents & produce vector-graphic images
	- [ ] cut, edit, export dxf ?
- [x] [processing: snake](https://github.com/dunland/snake)
	- funktioniert eigtl ganz fein in p4, kann auch executables exportieren... 
	- **konvertieren zu python o.ä.?**
- [ ] [d3js](https://d3js.org/getting-started)
	- [ ] [d3js.path (+ dotGrid?) + maker.js](https://github.com/microsoft/maker.js/issues/579#issuecomment-1786083802)
- snakeJS
	- [JavaScript dxf writer](https://github.com/dxfjs/writer)
	-  p5js?... **Performance überprüfen!**
	- p5 dxf/svg export
		- [p5js-svg Renderer](https://github.com/zenozeng/p5.js-svg)
		- dxf zerschneiden könnte so funktionieren: [Paper.js example: Path Intersections](https://paperjs.org/examples/path-intersections/)
- (https://cnc.js.org/ - *A web-based interface for CNC milling controller running [Grbl](https://github.com/grbl/grbl), [Smoothieware](https://github.com/Smoothieware/Smoothieware), or [TinyG](https://github.com/synthetos/TinyG). It runs on an [Raspberry Pi](https://www.raspberrypi.org/) or a laptop computer that you have Node.js installed, connecting to the Arduino over a serial connection using a USB serial port, a Bluetooth serial module, or a Serial-to-WiFi module like [XBee](https://www.arduino.cc/en/Guide/ArduinoWirelessShieldS2) or [USR-WIFI232-T](https://gist.github.com/ajfisher/1fdbcbbf96b7f2ba73cd).*)
- ([simplegrid.io](https://simplegrid.io/) - a CSS grid)
- (https://grid.layoutit.com/ - another CSS grid layouter)

### Suchbegriffe:

- html canvas to dxf
- framework to create paths along grid
- frontend path dxf
- interactive vector frontend // liefert bloß Ergebnisse bzgl Maps
- interactive dxf path frontend
