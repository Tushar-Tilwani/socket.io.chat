var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('home.html');
});

app.use('/js', express.static('public'));
var clients = {};
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected'+socket.id);
  });
   socket.on('chat message', function(msg){
    var jsonToSend = {
      user : clients[socket.id],
      message : msg
    }
    io.emit('chat message', JSON.stringify(jsonToSend) );
  });
    socket.on('uname', function(uname){
    console.log('message: ' + uname);
    clients[socket.id] = uname;
    io.emit('uname', 'User '+ uname + ' has logged in!');
  });
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});