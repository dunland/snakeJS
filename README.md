# snakeJS

a.k.a. "Werner"/Wärmer a.k.a. Wandheizungsauslegungsgenerator in JavaScript

## start

- `npm start` (führt `nodemon main.js` aus)
- läuft derzeit nur in Chrome, da Firefox: *snake.js:16:46 import assertions are not currently supported*

## To do

- [x] Keyboard Interaction
- [ ] Upload Images
- [ ] Export dxf

- [ ] Liniensegmente:
    - [ ] Liste Sidepanel
    - [ ] Liniensegmente rückgängig machen
    - [ ] Liniensegmente an Gitterpunkte binden
    - [ ] Liniensegmente exportieren/speichern
- [ ] Raster:
    - [ ] Aussparungen markieren
    - [ ] Raster zerschneiden??
    - [ ] Erkennung vertikale vs horizontale Verläufe
    - [ ] Raster bewegen per drag&drop
    - [ ] Liniensegmente bei Entfernen eines Punkts löschen
    - [ ] Punkte entfernen ‒ ohne Fehler
    - [ ] Benennung Maßeinheiten Wand
    - [x] Einfügen eines technischen Bildes
        - [ ] neu setzen der Rasterpunkte bei Laden des Bildes
        - [ ] Fehler, wenn kein Bild geladen → Popup File Panel
- [ ] Export
    - [ ] Segmentierung des dxf-Exportes
- [ ] UI:
    - [ ] Liste aller Punkte, draggable
    - [ ] Buttons:
        - [ ] SVG Export
        - [ ] DXF Export
        - [ ] Bild laden
        - [ ] Rastermaß bestimmen

## log

07.02.2024
- [p5js Performance issues](https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance)
    - frameRate(15)... immernoch langsam
    - noL

06.02.2024
- Dotgrid cursor:
  ``` javascript
  function isEqual (a, b) { return a.x === b.x && a.y === b.y }
  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
  function step (v, s) { return Math.round(v / s) * s }
  ```
- **Upload images** 
    - [using nodeJS+Multer+Express](https://www.digitalocean.com/community/tutorials/nodejs-uploading-files-multer-express) / https://www.golinuxcloud.com/node-js-upload-file/
    - ChatGPT:
    - [ ] *Use noLoop() and redraw(): If your dots don't need to be updated continuously, you can use the noLoop() function to stop the draw loop and only redraw when needed using the redraw() function.*    
    - [ ] *Offscreen Buffer: Instead of drawing directly to the canvas, you can draw to an offscreen buffer using createGraphics() and then draw the buffer to the canvas. This can improve performance, especially if you're doing complex calculations or drawing operations.*    
    - [ ] *Batch Rendering: Instead of drawing each dot individually, you can batch render them using shapes like circles or rectangles. This can significantly reduce the number of draw calls and improve performance.*
    - [x] *Use WebGL Renderer: If your browser supports it, switching to the WebGL renderer (createCanvas(width, height, WEBGL)) can sometimes provide better performance for complex drawings.* **WEBGL ist auf jeden Fall viel schneller** aber braucht besondere Grafikeinstellungen: https://github.com/processing/p5.js/wiki/Getting-started-with-WebGL-in-p5
    - [ ] *Optimize Drawing Operations: Make sure you're only performing necessary drawing operations inside the draw loop. Avoid unnecessary calculations or operations that don't contribute to the final result.*
    - [ ] *Profile and Optimize: Use browser developer tools to profile your code and identify performance bottlenecks. Once you identify them, you can optimize those parts of your code to improve performance.*
05.02.2024
- [ ] **read JSON in nodeJS**:
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