const del = require('del');
var network = require('network');
var ipSubnet;
network.get_private_ip(function(err,ip) {
  console.log(err||ip);
  ipSubnet = ip.substr(ip.lastIndexOf(".") + 1);
});

$(document).ready(function(){
  setTimeout(function(){$("#load").fadeOut();},300);
  // $("#load").fadeOut();
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
  nbListAttente();
  $('#ipConnectBox').click(function(){
    $(this).addClass('btn-ipConnect');
    $('#ipConnect').html(ipSubnet);
    setTimeout(function(){
      $('#ipConnect').text("Code unique");
      $('#ipConnectBox').removeClass('btn-ipConnect');
    },3000);
  });
  $('#table-search-input').on('focusin', function(){
    $('#bibli-search').css('background-color', '#FFF');
  });
  $('#table-search-input').on('focusout', function(){
    $('#bibli-search').css('background-color', 'transparent');
  });
});

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
window.onbeforeunload = function (event) {
  path = upath.normalize(__dirname)+'/dl/*';
  del(path);
};
$(document).on('click','.add-icon', function(){
  //tbodyCss();
});

$(document).on('click','#liste #queue li', function(){
  console.log($(this).find('.index').text());
});

function tbodyCss() {
  $("#table-bdd tbody tr").each(function () {
    //console.log($(this).find('.chemin').text());
    var a = $(this).find('.chemin').text();
    var tBody = $(this);
    var nr = $(this).find('.number').text();
    tBody.find('.add').css('border-left', 'none');
    tBody.find('.add').html("<div class='add-icon' onclick='addSong(this)'><i class='fa fa-plus' aria-hidden='true'></i><span class='add-text'>Ajouter</span> </div><div class='number'>" + nr + "</div>");

    $('#liste #queue .played').each(function () {
      var b = $(this).find('.path').text();
      if (a == b) {
        nr = $(this).find('.number').text();
        tBody.find('.add').css('border-left', 'none');
        tBody.find('.add').html("<div class='add-icon' onclick='addSong(this)'><i class='fa fa-plus' aria-hidden='true'></i><span class='add-text'>Ajouter</span> </div><div class='number'>" + nr + "</div>");
      }
    });
    $('#liste #queue .toPlay').each(function () {
      var b = $(this).find('.path').text();
      if (a == b) {
        tBody.find('.add-icon').html("<i class='fa fa-check' aria-hidden='true'></i>" + "<span class='add-text'>Ajouté</span>");
        tBody.find('.add-icon').css('background-color', '#28bd25');
        tBody.find('.add').css('border-left', '3px solid #28bd25');
      }
    });
    $('#liste #queue .currentSong').each(function () {
      var b = $(this).find('.path').text();
      if (a == b) {
        tBody.find('.add-icon').html("<i class='fa fa-play' aria-hidden='true'></i>" + "<span class='add-text'>Lecture</span>");
        tBody.find('.add-icon').css('background-color', '#3498db');
        tBody.find('.add').css('border-left', '3px solid #3498db');
      }
    });
  });
}

$(document).on('keyup','#table-search-input',function(){
  var searchTerm = $("#table-search-input").val();
  var listItem = $('#table-bdd tbody').children('tr');
  var searchSplit = searchTerm.replace(/ /g, "'):containsi('")

  $.extend($.expr[':'], {'containsi': function(elem, i, match, array){
    return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
  }
  });

  $("#table-bdd tbody tr").not(":containsi('" + searchSplit + "')").each(function(e){
    $(this).attr('visible','false');
  });

  $("#table-bdd tbody tr:containsi('" + searchSplit + "')").each(function(e){
    $(this).attr('visible','true');
  });
});
