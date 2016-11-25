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
        files.forEach(getTags);
      })
  })}
//obtenir meta donnés des chansons
var tags =[];
function getTags(song){
    id3.read(song).then(function(result) {
      console.log(result.data.artist);
      console.log(result.data.album);
      console.log(result.data.title);
      mp3Duration(song, function (err, duration) {
        millisToMinutesAndSeconds(parseInt(duration)); //convertir millisecondes en minutes:secondes;
        });//console.log(result.data.attached_picture);
      }).catch(function(err){throw err})
    }
function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60);
  var seconds = ((millis % 60)).toFixed(0);
  console.log(minutes + ":" + (seconds < 10 ? '0' : '') + seconds);
}
