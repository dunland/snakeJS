# Wandwurm

Wandheizungsauslegungsgenerator in JavaScript

see the [Log](Log.md) file for the full programming log and annotations

## installation

- Windows: Doppelklick `install.bat`
- Terminal: `npm install`

## start

- In Windows: Doppelklick auf `start.bat`, sonst im Terminal: `npm start` (führt `nodemon main.js` aus)
- läuft derzeit nur in Chrome, da Firefox: *snake.js:16:46 import assertions are not currently supported*

## Projektstruktur

```
snakeJS
└───js (Quellcode)
└───node_modules (Quellcode-Bibliotheken)
└───Projects
|   └───Projekt_Name
|   |   └───project.json
|   |   └───bild1.jpg
|   └───Projekt_1
|   |   └───project.json
|   |   └───beispielbild2.jpg
|   └───...
└───index.html
└───start.html
```

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
    - [x] Aussparungen markieren
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
    - [ ] gestrichelte Linie wenn Linien malen möglich
    - [ ] Buttons:
        - [ ] SVG Export
        - [ ] DXF Export
        - [ ] Bild laden
        - [ ] Rastermaß bestimmen

**Fragen:**

- was für ein Output für FreeCAD benötigt? Eine Linie? zwei? drei?
- welcher Dateityp? SVG oder DXF?
