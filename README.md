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
