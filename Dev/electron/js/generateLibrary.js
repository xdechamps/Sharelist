var app = require('electron').remote;
var dial = app.dialog;
var glob = require("glob");
var id3 = require('music-tag');
var mp3Duration = require('mp3-duration');

function ouvrirDossier(){
  dial.showOpenDialog({
    title:"Choisir votre dossier musique",
    properties: ["openDirectory"]
  },function (folderPaths) {
      var path = folderPaths[0];
      glob(path+"**/**/*.{mp3,wav,ogg}", function (er, files) {
        // files is an array of filenames. If the `nonull` option is set, and nothing was found, then files is ["**/*.js"] er is an error object or null.
        getTags(files);
      })
  })}
//obtenir meta donnés des chansons
function getTags(file){
  file.forEach(function(song,index) {
    id3.read(song).then(function(result) {
          $("#table-bdd tbody").append(
            "<tr id=row"+index+"><td class='add'>"+
              "<i onclick='addSong(this)' class='fa fa-plus' aria-hidden='true'></i>"+
              "</td><td class='titre'>"+result.data.title+"</td>"+
              "<td class='artiste'>"+result.data.artist+"</td><td class='album'>"+result.data.album+"</td></tr>")
    });
  });
}
function addSong(boutonPlus){
  songRow = boutonPlus.parentElement.parentElement.getElementsByClassName('titre');
  console.log(songRow);
  // $('#row3 .titre')[0].innerText
  // console.log(boutonPlus);
}
