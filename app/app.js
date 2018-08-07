var express = require("express"),
  app = express(),
  bodyParser = require('body-parser'),
  http = require("http"),
  path=require("path"),
  port=3000;

var routes = require("./routes");
var server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/", routes);
app.use(express.static(path.join(__dirname, 'public')));

server.listen(port, function () {
  console.log("Server listening at Port:", port);
});





