# snakeJS

a.k.a. "Werner"/Wärmer a.k.a. Wandheizungsauslegungsgenerator in JavaScript

## start

`npm start`

## log

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