const http = require('http');
var fs = require('fs');
var path = require('path');
var express = require('express'); // needed to serve files
var app = express();

fs.readFile("./settings.json", "utf8", (error, data) => {
  if (error) {
    console.log(error);
    return;
  }
  console.log(JSON.parse(data));
});

var dir = path.join(__dirname, '.');

app.use(express.static(dir)); // serve static files

const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});
