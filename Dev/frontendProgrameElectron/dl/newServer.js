var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var dl = require('delivery');
var fs = require('fs');


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
        var ajd = new Date();
        var dateString = ajd.toDateString();
        var timeString = ajd.toTimeString();
        console.log('a user connected on', dateString, timeString);
        socket.emit('news', 'En attente');
        socket.on('console', function(msg){
                console.log('Console :', msg);
        });
        socket.on('message', function(msg){
                console.log('Message :', msg);
        });
        socket.on('disconnect', function(){
                console.log('user disconnected');
        });

var delivery = dl.listen(socket);
  delivery.on('receive.success',function(file){
    var params = file.params;
    fs.writeFile(__dirname + "/dl/"+file.name,file.buffer, function(err){
      if(err){
        console.log('File could not be saved.');
      }else{
        socket.on('fichier', function(msg){
                console.log('Fichier uploadé :', msg);
        });
      };
    });
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});