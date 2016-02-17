  var express = require('express');
  var app = express();
  var http = require('http').Server(app);
  var io = require('socket.io')(http);
  var _ = require('lodash-node');

  app.get('/', function(req, res){
    res.sendfile('index.html');
  });

  app.use('/js', express.static('public'));
  var clients = {};
  var sockets = {};
  io.on('connection', function(socket){
    console.log('a user connected');
    
    socket.emit('connId',socket.id);
    
    sockets[socket.id] = socket;
    
    socket.on('disconnect', function(){
      delete clients[socket.id];
      delete sockets[socket.id];
      io.emit('uname', JSON.stringify(clients));
      console.log('user disconnected'+socket.id);
    });

    socket.on('chat message', function(jsonRecieved){
      console.log(jsonRecieved);
      jsonRecieved = JSON.parse(jsonRecieved);
      var jsonToSend = {
        user : clients[socket.id],
        message : jsonRecieved.msg
      };
      sockets[jsonRecieved.to].emit('chat message', JSON.stringify(jsonToSend) );
      sockets[jsonRecieved.from].emit('chat message', JSON.stringify(jsonToSend) );
      
    });

    socket.on('uname', function(uname){
      clients[socket.id] = uname;
      io.emit('uname', JSON.stringify(clients));
    });

    socket.on('chatDest',function(val){
      sockets[val].emit('chatReq',socket.id);
    });

  });

  http.listen(process.env.PORT || 3000, function(){
    console.log('listening on *:3000');
  });