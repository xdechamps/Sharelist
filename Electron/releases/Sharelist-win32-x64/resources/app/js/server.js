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
    socket.on('newClient', function(hello){
        console.log(hello);
    });
    socket.on('voteMusique', function(vote){
        var indexVote = vote.split('-')[1] - 1;
        addVote(indexVote);
    });

    socket.on('choixMusique',function(btnClient){   //changed here
        btnClient.split('-')[1] - 1;
        clientAddQueue(btnClient.split('-')[1] - 1);
    })

    socket.on('check', function(check){
        // console.log("client : " + check);
        if(check[0] != checksum[0]){
            if(library[0]!=null){
                socket.emit('lib',library);
                socket.emit('check', checksum);
                // console.log('envoye a client' + library);
            }
        }
        if (check[1] != checksum[1]) {
            var listeAttenteSansImg = listeAttente;
            listeAttenteSansImg.forEach(function(element) {
              delete element.cover;
            });
            // console.log(listeAttenteSansImg);
            socket.emit('playlist', listeAttenteSansImg);
            socket.emit('check', checksum);
        }
        if (check[2] != checksum[2]) {
            // console.log(indexCurrentSong);
            socket.emit('check', checksum);
            socket.emit('currentSong', (indexCurrentSong));
        }else{
            socket.emit('checkStatus', "dejaSync");
        }

    });
    var delivery = dl.listen(socket);
    delivery.on('receive.success',function(file){
        var params = file.params;
        fs.writeFile(__dirname + "/dl/"+file.name,file.buffer, function(err){
            if(err){
                console.log('File could not be saved.' + err);
            }else{
                console.log('Fichier reçu' + file.name);
                addDlSong(file.name);
            }
        });
    });

});

http.listen(8246, function(){
    console.log('listening on *:8246');
});
