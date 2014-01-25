var express = require('express');
var fs = require('fs');
var buffer = new Buffer(256);
buffer = fs.readFileSync("index.html");
var app = express();
app.use(express.logger());

app.get('/', function(request, response) {
  response.send(buffer.toString("utf-8"));
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
