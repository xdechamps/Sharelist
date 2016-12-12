var paused = true;
function play_pause(){
  if(paused){playPlayback()}else if(!paused){pausePlayback()}
}
function playPlayback(){
  document.getElementById('player').play();
  $("#playpause").replaceWith('<i id="playpause" class="fa fa-pause" aria-hidden="true"></i>');
  paused = false;
}
function pausePlayback(){
  document.getElementById('player').pause();
  $("#playpause").replaceWith('<i id="playpause" class="fa fa-play" aria-hidden="true"></i>');
  paused = true;
}
// $('#duration-total').text = ;
setInterval(function(){
  if($('#player').attr('src') == ''){dureTotal = 0;}else {
    dureTotal = document.getElementById("player").duration;
  }
  $('#duration-total').html(secToMinSec(dureTotal));
  var dureCurrent = document.getElementById("player").currentTime;
  $('#duration-current').html(secToMinSec(dureCurrent));
  pourcentAvancement = (dureCurrent/dureTotal)*100;
  $('#lecteur-progress-current').css("width",pourcentAvancement+"%");
  if(pourcentAvancement>99){nextSong()};
}, 500);

function secToMinSec(secs){
  var minutes = '0';
  var secondes = Math.floor(secs);
  while (secondes >= 60){
    secondes -= 60;
    minutes++;
  }
  return minutes + ":" + (secondes < 10 ? '0' : '') + secondes;
}
function nextSong(){
  if((listeAttente.length > 0) && (indexCurrentSong < (listeAttente.length-1))) {
    indexCurrentSong++;
    checksum[2]++;
    constructQueue(listeAttente);
    $('#player').attr('src', listeAttente[indexCurrentSong].chemin); // si prochaine chanson alors recharge la source 
    $('#artist').html(listeAttente[indexCurrentSong].artiste);
    $('#title').html(listeAttente[indexCurrentSong].titre);
    $('#cover').attr('src', listeAttente[indexCurrentSong].cover);
    playPlayback();
    //tbodyCss();
    var scrollposition1 = $('.currentSong');
    for (var i = 0; i < 4; i++) {
      scrollposition1 = scrollposition1.prev();
    }
    $('#liste').scrollTo(scrollposition1);
  }
}
function prevSong(){
  if((listeAttente.length > 0) && (indexCurrentSong > 0 )) {
    indexCurrentSong--;
    checksum[2]++;
    constructQueue(listeAttente);
    $('#player').attr('src', listeAttente[indexCurrentSong].chemin); // si précédente chanson alors recharge la source 
    $('#artist').html(listeAttente[indexCurrentSong].artiste);
    $('#title').html(listeAttente[indexCurrentSong].titre);
    $('#cover').attr('src', listeAttente[indexCurrentSong].cover);
    playPlayback();
    //tbodyCss();
    var scrollposition2 = $('.currentSong');
    for (var i = 0; i < 4; i++) {
      scrollposition2 = scrollposition2.prev();
    }
    $('#liste').scrollTo(scrollposition2);
  }
}

 //$('#queue').scrollTop($('#queue li:nth-child('indexCurrentSong')').position().top);
 //$('#queue').animate({
 //     scrollTop: $('#yourUL li:nth-child(14)').position().top
 //}, 'slow');
