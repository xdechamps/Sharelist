console.log('[script.js] Chargé !');

app.initialize();

var clicked = 0;//Nombre incrémenté pour savoir si le formulaire a été rempli plusieurs fois
var monNombre = 0;//[A SUPPRIMER] nombre dans la console
var librairie;//La librairie
var playlistTEST;//la playlist
var numLib = 0;//Nombre incrémenté pour identifier les morceaux dans la librairie
var numPlay = 0;//Nombre incrémenté pour identifier les morceaux dans la playlist
var checksum = [0,0,0];//chekcsum permettant de suivre l'état de la librairie
var musiqueAAjouter;//this.id bouton cliqué pour ajout musique sur serveur distant
var ipServer;//contient l'ip du serveur à joindre
var socket;//socket de l'application
var currentLocalSong;//morceau actuellement à l'écoute

document.addEventListener('deviceready', function() {
  $('#console').hide();

  console.log('[Cordova] Device ready');
  addConsole('[Cordova] Device ready');

  networkinterface.getIPAddress(function (ip){
    subNet = ip;
    subNet = subNet.substr(0, subNet.lastIndexOf(".")) + '.';
  });

  $('#form-login').submit(function(){
    // clicked++;
    // if(clicked>1){
    //   console.log('Connexion déjà établie ou échouée, veuillez recharger la page !');
    //   addConsole('Connexion déjà établie ou échouée, veuillez recharger la page !');
    // } else {
      ipServer = 'http://' + subNet + $('#ip-server').val() + ':3000';
      console.log('[Client] Trying to connect to ' + $('#ip-server').val() + ':3000');
      addConsole('[Client] Trying to connect to ' + ipServer);
      $('#envoyer').html('<i class="fa fa-spinner fa-pulse fa-lg fa-fw"></i><span class="sr-only">Loading...</span>');
      $('#envoyer').addClass('disabled');
      $('#ip-server').prop('disabled', true);
      socket = io(ipServer);

      socket._connectTimer = setTimeout(function() {
        socket.close();
        console.log('[Client] Connexion échouée');
          $('#envoyer').text('Connexion échouée');
          $('#envoyer').addClass('btn-danger');
          $('#envoyer').removeClass('btn-primary');
          setTimeout(function(){
            $('#envoyer').text('Valider');
            $('#envoyer').addClass('btn-primary');
            $('#envoyer').removeClass('btn-danger');
            $('#ip-server').focus();
            var tmpIpServer = $('#ip-server').val();
            $('#ip-server').val("");
            $('#ip-server').val(tmpIpServer);
            $('#envoyer').removeClass('disabled');
            $('#ip-server').prop('disabled', false);
          },2000);
      }, 1500);

      socket.on('connect', function() {
        clearTimeout(socket._connectTimer);
        console.log('[Socket.io] Connected');
        addConsole('[Socket.io] Connected');

        var delivery = new Delivery(socket);

        delivery.on('delivery.connect',function(delivery){
           $("input[type=submit]").click(function(evt){
             var file = $("input[type=file]")[0].files[0];
             var extraParams = {foo: 'bar'};
             delivery.send(file, extraParams);
             evt.preventDefault();
           });
         });

        delivery.on('file.load',function(filePackage){
          console.log(filePackage.name + " est chargé.");
          addConsole("<span style='color:#0B8BF8!important'>"+filePackage.name + "</span> est chargé.");
          $('#sendFichier').val('Chargement...').addClass('disabled');
          chronoStart();
        });

        delivery.on('send.success',function(fileUID){
           console.log("Le fichier a été uploadé avec succès.");
           addConsole("Le fichier a été uploadé avec succès.");
           $('#sendFichier').val('Envoyé !').addClass('btn-success');
           chronoStop();
           setTimeout(function(){
             $('#sendFichier').val('Envoyer').removeClass('btn-success disabled');
             clearFichier();
             console.log("Prêt à envoyer à nouveau.");
             addConsole("Prêt à envoyer à nouveau.");
             chronoReset();
             $('#chronotime').text("");
           },2000);
        });

       });//socket.on('connect')

      socket.on('disconnect',function(){
        console.log('Vous avez été déconnecté.');
        addConsole('Vous avez été déconnecté.');
        alert('Vous avez été déconnecté');
        $('#ip-server').prop('disabled', false);
        location.reload();
      });

      socket.on('news', function(text) {
        console.log('[Serveur] ' + text);
        addConsole('[Serveur] ' + text);
        $('#envoyer').text('Connexion établie').addClass('btn-success disabled');
        $('#container-connexion').hide();
        $('#container-choix').css('display','flex');
      });//socket.on('news')

      socket.on('lib', function(librairie){
        // console.log('librairie');
        // console.log('librairie.length : ' + librairie.length);
        $('#librairie ul').text("");
        construireLib(librairie);
      });

      socket.on('playlist', function(playlist){
        // console.log('---------------------------playlist-------------------------');
        // console.log(playlist);
        $('#playlist ul').text("");
        construirePlaylist(playlist);
        playlistTEST = playlist;
      });

      socket.on('currentSong', function(currentSong){
        currentLocalSong = currentSong;
        // console.log('currentSong : ' + currentSong);
        var art = playlistTEST[currentSong].artiste;
        var titre = playlistTEST[currentSong].titre;
        $('#live-text b').html("A l'écoute : ");
        $('#live-current').html(art + ' - ' + titre);
        // console.log('playlistTEST : ' + playlistTEST);
        construirePlaylist(playlistTEST);
      });

      socket.on('check', function(text){
        console.log('text : ' + text);
        console.log('checksum : ' + checksum);
        if(text[0] + text[1] + text[2] != checksum[0] + checksum[1] + checksum[2]){
          console.log('DIFF');
          checksum = text;
          console.log('after');
          console.log('text : ' + text);
          console.log('checksum : ' + checksum);
        } else {
          console.log('EGAL');
        }
      });

      socket.on('checkStatus', function(checkStatus){
        console.log('[Status] : ' + checkStatus);
      });

      setInterval(function(){
        socket.emit('check', checksum);
      },1000);

      // socket.emit('choixMusique','yolo32');

      // socket.emit('choixMusique',musiqueAAjouter);

    // }//else
    return false;
  });//#form-login
  $(document).ready(function () {

    var marquee = $('#live');
    marquee.each(function() {
      var mar = $(this),indent = mar.width();
      mar.marquee = function() {
          indent--;
          mar.css('text-indent',indent);
          if (indent < -1 * mar.children('#live-text').width()) {
              indent = mar.width();
          }
      };
      mar.data('interval',setInterval(mar.marquee,1000/60));
    });

    // "use strict";
    // Click on li item will change input text value
    // $('#librairie li').click(function () {
    //   console.log($(this).html());
    //     $('#search-input').val($(this).html());
    // });

    // Type some text into input will hide some fruit !
    $('#search-input').on('keyup', function () {
        var input_content = $.trim($(this).val());
        if (!input_content) {
            $('ul>li').show();
        } else {
            // $('ul>li').show().not(':contains(' + input_content  + ')').hide();
            $('ul>li').each(function(){
              if(noAccents ($(this).html()).search(new RegExp(noAccents (input_content))) !== -1){
                $(this).show();
              } else {
                $(this).hide();
              }
            });
        }
    });

});//document.ready

});//addEventListener('deviceready')

function noAccents(s){
  var r = s.toLowerCase();
  non_asciis = {'a': '[àáâãäå]', 'ae': 'æ', 'c': 'ç', 'e': '[èéêë]', 'i': '[ìíîï]', 'n': 'ñ', 'o': '[òóôõö]', 'oe': 'œ', 'u': '[ùúûűü]', 'y': '[ýÿ]'};
  for (i in non_asciis) { r = r.replace(new RegExp(non_asciis[i], 'g'), i); }
  return r;
};

function addConsole(msg){
  monNombre++;
  var d = new Date();
  var n = d.toLocaleString();
  $('#console-in').append('<div><span>'+underten(monNombre)+'. '+n+' | </span>'+msg+'</div>');
}

function underten(x){
  if ( x < 10){
      x = "0"+x;
  }
  return x;
}

function showUp(){
  // console.log('clicked');
  var nomFichier = $('#upload-fichier').val();
  nomFichier = nomFichier.replace(/C:\\fakepath\\/i, '');
  $('#label-upload-fichier').text(nomFichier);
}

function clearFichier(){
  $('#upload-fichier').val("");
  $('#label-upload-fichier').text("Fichier à envoyer");
}

function ok(){
  $('#container-connexion').css('display','block');
  $('#container-accueil').css('display','none');
}

function showSendPage(){
  $('#container-upload').css('display','block');
  $('#container-choix').css('display','none');
}

function showLibPage(){
  $('#container-librairie').css('display','block');
  $('#container-choix').css('display','none');
  $('#container-upload').css('display','none');
}

function showChoix(){
  $('#container-choix').css('display','flex');
  $('#container-upload').css('display','none');
  $('#container-librairie').css('display','none');
}

function showLib(){
  $('section#librairie').show();
  $('section#playlist').hide();
  $('#box-show-librairie').addClass('active');
  $('#box-show-playlist').removeClass('active');
}

function showPlaylist(){
  $('section#playlist').show();
  $('section#librairie').hide();
  $('#box-show-playlist').addClass('active');
  $('#box-show-librairie').removeClass('active');
}

function construireLib(librairie){
  // console.log('construireLib()');
  for(var i=0;i<librairie.length;i++){
    numLib++
    var art = librairie[i].artiste;
    var tit = librairie[i].titre;
    console.log(numLib + ". " + art + " - " + tit);
    $('#librairie ul').append('<li id=liLib-'+numLib+'><div class="li-text">' + art + " - " + tit +'</div><a href="#" id="btnAjouter-' + numLib + '" class="btn btn-sm btn-success btn-ajouter">Ajouter</a></li>');
  }
  console.log(librairie.length + ' morceaux ont été ajoutés à la librairie.');
  $('.btn-ajouter').click(function(){
    var btnAddId = $(this).attr('id');
    console.log('Musique souhaitée : [' + btnAddId + '] ' + $(this).parent('li').children('.li-text').text());
    socket.emit('choixMusique', btnAddId);
  });
}

function construirePlaylist(playlist){
  // console.log('construirePlaylist()');
  $('#playlist ul').html("");
  numPlay = 0;
  for(var i=0;i<playlist.length;i++){
    // console.log(i);
    numPlay++
    var art = playlist[i].artiste;
    var tit = playlist[i].titre;
    var vote = playlist[i].nbrVote;
    console.log(numPlay + ". " + art + " - " + tit);
    // $('#playlist ul').append('<li id=liPlay-'+numPlay+'><div class="li-text">' + art + " - " + tit +'</div><a href="#" id="btnVote-' + numPlay + '" class="btn btn-sm btn-success btn-voter"><i class="fa fa-thumbs-up" aria-hidden="true"></i> '+ vote +'</a></li>');
    $('#playlist ul').append('<li id=liPlay-'+numPlay+'><div class="li-text">' + art + " - " + tit +'</div><div class="btn-group" role="group" aria-label="Basic example"><a href="#" id="btnVote-' + numPlay + '" class="btn btn-sm btn-success btn-voter"><i class="fa fa-thumbs-up" aria-hidden="true"></i> '+ vote +'</a></li>');
    $('#playlist ul').append('<div class="btn-group" role="group" aria-label="Basic example"><button type="button" class="btn btn-secondary">3</button><button type="button" class="btn btn-secondary btn-success"><i class="fa fa-thumbs-up" aria-hidden="true"></i></button></div>');
    if(i<currentLocalSong+1){
      $('#btnVote-'+i).text("Joué");
      $('#btnVote-'+i).addClass('btn-played');
    } else if(i==currentLocalSong+1) {
      $('#btnVote-'+i).text("En lecture");
      $('#btnVote-'+i).addClass('btn-current');
    }
  }
  console.log(playlist.length + ' morceaux ont été ajoutés à la playlist.');
  $('.btn-voter').click(function(){
    var btnVoteId = $(this).attr('id');
    console.log('Musique votée : [' + btnVoteId + '] ' + $(this).parent('li').children('.li-text').text());
    socket.emit('voteMusique', btnVoteId);
    $(this).addClass('disabled');
  });
}
