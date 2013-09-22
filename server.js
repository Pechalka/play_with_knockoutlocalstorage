var express = require('express')
  , http = require('http');

var app = express();

app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(__dirname));


http.createServer(app).listen(3000, function(){
  console.log('Express server listening on port 3000');
});