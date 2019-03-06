// chatbot for Node.js
var express = require("express");
var app = express();
var webSocketServer = require('ws').Server;
var wss = new webSocketServer({ port : 5001 });

var server = app.listen(3000, function(){
  console.log("Node.js is listening to PORT:" + server.address().port);
});

wss.on('connection', function(ws) {
  ws.on('message', function(message) {
    console.log('Received: ' + message);
    wss.clients.forEach(function(client) {
      client.send(message + ' : ' + new Date());
    });
  });
  ws.on('close', function() {
    console.log('I lost a client');
  });
});

app.set('view engine', 'ejs');

app.get("/", function(req, res, next){
  res.render("index", {});
});
