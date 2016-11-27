$(document).ready(function(){
  setTimeout(function(){$("#load").fadeOut();},300);
  // $("#load").fadeOut();
  console.log('ready!');
  $('#open-playlist').click(function(){
    $('#container-playlist').show();
  })
  $('#fermer-playlist').click(function(){
    $("#container-playlist").hide();
  })
  $('.ajout').click(function(){
    console.log('clicked');
    $(".alert").show().css('display','flex');
    setTimeout( function() {
    $(".alert").fadeOut();
  }, 200);
})
  //HOST
  $('#reglages')
  .click(function(){
    $('#reglages span').text('En construction');
  })
  .mouseleave(function(){
    $('#reglages span').text('Réglages');
  })
  //LECTEUR
  $('#play').click(function(){
    $('#play .fa').toggleClass('fa-play fa-pause');
  })
  $('.remove').click(function(){
    $(this).parent().fadeOut().remove();
    nbListAttente();
  })
  //BIBLI
  $('.add-icon').click(function(){
    // var parent = $(this).parent().parent();
    $(this).text('Ajouté');
    $(this).next().addClass('song-added').text('Ajouté');
    // parent.css('background-color','green');
    // parent.css('border-left','10px solid #28bd25');
  });
  nbListAttente();
})

function nbListAttente(){
  var nb = $('#liste ul > *').length;
  switch(nb){
    case nb=0:
      $('#next-song').text('Aucun morceau en attente');
      break;
    case nb=1:
      $('#next-song').text('1 morceau en attente');
      break;
    default:
      $('#next-song').text($('#liste ul > *').length + ' morceaux en attente');
    break;
  }
}
