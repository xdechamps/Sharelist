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
var dureTotal = document.getElementById("player").duration;
$('#duration-total').html(secToMinSec(dureTotal));
setInterval(function(){
  var dureCurrent = document.getElementById("player").currentTime;
  $('#duration-current').html(secToMinSec(dureCurrent));
  pourcentAvancement = dureCurrent/dureTotal;
  $('#lecteur-progress-current').css("width",(dureCurrent/dureTotal)*100+"%");
}, 1000);

function secToMinSec(secs){
  var minutes = Math.floor(secs / 60);
  var seconds = (secs % 60).toFixed(0);
  return minutes + ":" + (secs < 10 ? '0' : '') + seconds;
}
