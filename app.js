// Chatbot for Node.js
var express = require("express");
var app = express();
var webSocketServer = require('ws').Server;
var wss = new webSocketServer({ port : 5001 });
var Mecab = require("mecab-lite");
var mecab = new Mecab();
var botMessage;
var moneyFlag = false;

var server = app.listen(3000, function(){
  console.log("Node.js is listening to PORT:" + server.address().port);
});

wss.on('connection', function(ws) {
  ws.on('message', function(message) {
    var items = mecab.parseSync(message);
    botMessage = "";
    moneyFlag = false;

    console.log('Received: ' + message);

    for(var i = 0; i < items.length; i++) {
      if(items[i][0] == "円") {
        moneyFlag = true;
      }
    }

    if(moneyFlag) {
      for(var i = 0; i < items.length; i++) {
        if(items[i][2] == "数") {
          botMessage += items[i][0];
        }
      }
      botMessage += "円のコースはこちらになります。";
    }

    wss.clients.forEach(function(client) {
      client.send(botMessage + ' : ' + new Date());
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
