//paquet npm
var app = require('electron').remote;
var dial = app.dialog;
var glob = require("glob");
//var id3 = require('music-tag');

var ID3 = require('id3-parser');

var mp3Length = require('mp3Length');
var upath = require ('upath');

var indexCurrentSong = -1;      //index dans la playlist de la musique en cours de lecture
var indexListe = 0;     //Index unique d'un morceau dans la playlist
var listeAttente = [];      //tableau liste de lecture
nr = 0;     //index bibliothèque
var checksum = [0,0,0];      //index de synchronisation
var library = [];       //bibliothèque des morceaux
var filescheck = [];

function ouvrirDossier() {
    dial.showOpenDialog({
        title: "Choisir votre dossier musique",
        properties: ["openDirectory"]
    }, function (folderPaths) {
        var path = folderPaths[0];
        glob(path + "**/**/*.{mp3,wav,ogg}",
            function (er, files) {             // files is an array of filenames. If the `nonull` option is set, and nothing was found, then files is ["**/*.js"] er is an error object or null. 
                getTags(files);
            })
    })
}

function includes(k) {
    for(var i=0; i < this.length; i++){
        if( this[i] === k || ( this[i] !== this[i] && k !== k ) ){
            return true;
        }
    }
    return false;
}

function getTags(file) {
file.forEach(function (song) {
    if (!(filescheck.includes(song))){
        filescheck.push(song);

        var id3length = ('0:00');
        mp3Length(song, function (err, length) {
            if (err) return console.log('error song : ' + err.message);
            var minutes = 0;
            while (length > 60) {
                length -= 60;
                minutes++;
            }
            id3length = (minutes + ':' + (length < 10 ? '0' : '') + length);
        });
        var fileBuffer = fs.readFileSync(song);
        var id3cover = 'https://assets.materialup.com/uploads/5495d88e-7a3f-46fd-a93c-26403b6e4cc5/UjXSVmq_uzjAKg7P8C18AniBoWQCmbVm52DQVd9n_3Cb4PNaflSpiS7nWHtP-ImfJlMe=w300';
        //var id3cover = 'https://media2.popsugar-assets.com/files/2010/11/44/3/192/1922507/cbd54cb61c6a8f90_new-itunes-10-logo.jpg';

        ID3.parse(fileBuffer).then(function (tag) {
            nr++;
            id3titre = tag.title;
            id3artiste = tag.artist;
            id3album = tag.album;
            id3chemin = song;
            if (tag.image) {
                var base64String = "";
                for (var i = 0; i < tag.image.data.length; i++) {
                    base64String += String.fromCharCode(tag.image.data[i]);
                }
                id3cover = "data:" + tag.image.format + ";base64," + window.btoa(base64String);
            }
            if (id3titre == undefined) {
                id3titre = id3chemin.replace(/^.*[\\\/]/, '').replace(/\.[^/.]+$/, "");
                id3artiste = '';
                id3album = '';
                library.push({
                    index:indexListe,
                    titre: id3titre,
                    artiste: '',
                    album: '',
                    chemin: id3chemin,
                    duree: id3length,
                    image: id3cover
                })
                indexListe++;
            } else {
                library.push({
                    titre: id3titre,
                    artiste: id3artiste,
                    album: id3album,
                    chemin: id3chemin,
                    duree: id3length,
                    image: id3cover
                });
                indexListe++;
            }
            $("#table-bdd tbody").append(
                "<tr>" + "<td class='add'>" +
                "<div class='add-icon' onclick='addSong(this)'>" +
                    "<i class='fa fa-plus' aria-hidden='true'></i>" +
                    "<span class='add-text'>Ajouter</span>" +
                "</div>" +
                "<div class='number'>" + nr + "</div>" + "</td>" +
                "<td class='titre'>" + id3titre + "</td>" +
                "<td class='artiste'>" + id3artiste + "</td>" +
                "<td class='album'>" + id3album + "</td>" +
                "<td class='duree'>" + id3length + "</td>" +
                "<td class='chemin'>" + id3chemin + "</td>" +
                "<td class='coverB64'>" + id3cover + "</td>" +
                "</tr>")
        });
    } else {
        //musique déjà présente
    }
});
checksum[0]++;
console.log('checksum : '+checksum);
}

function addSong(boutonPlus) {                          //morceau envoyé depuis la bibliothèque
    songTitle = boutonPlus.parentElement.parentElement.getElementsByClassName('titre')[0].innerText;
    songArtist = boutonPlus.parentElement.parentElement.getElementsByClassName('artiste')[0].innerText;
    songPath = boutonPlus.parentElement.parentElement.getElementsByClassName('chemin')[0].innerText;
    songCover = boutonPlus.parentElement.parentElement.getElementsByClassName('coverB64')[0].innerText;
    listeAttente.push({index: indexListe, titre: songTitle, artiste: songArtist, chemin: songPath, cover: songCover, nbrVote:0});
    if (listeAttente.length == 1) {
        nextSong();
        checksum[1]++;
    }
    constructQueue(listeAttente);
    checksum[1]++;
    indexListe++;
}
function addDlSong(fileDl){                             //morceau envoyé depuis l'application
    fileDlPath = upath.normalize(__dirname)+'/dl/' + fileDl;
    var fileBuffer = fs.readFileSync(fileDlPath);
    //var id3cover = 'https://assets.materialup.com/uploads/5495d88e-7a3f-46fd-a93c-26403b6e4cc5/UjXSVmq_uzjAKg7P8C18AniBoWQCmbVm52DQVd9n_3Cb4PNaflSpiS7nWHtP-ImfJlMe=w300';
    ID3.parse(fileBuffer).then(function (tag) {
        if (tag.image) {
            console.log(image.data.length);
            var base64String = "";
            for (var i = 0; i < image.data.length; i++) {
                base64String += String.fromCharCode(image.data[i]);
            }
            id3cover = "data:" + image.format + ";base64," + window.btoa(base64String);
        }
        console.log(tag.title);
        if (tag.title == undefined) {
            id3titre = fileDlPath.replace(/^.*[\\\/]/, '').replace(/\.[^/.]+$/, "");
            listeAttente.push({
                index: indexListe,
                titre: id3titre,
                artiste: '',
                chemin: fileDlPath,
                nbrVote:0
            });
            indexListe++;
        } else {
            listeAttente.push({
                index: indexListe,
                titre: tag.title,
                artiste: tag.artist,
                chemin: fileDlPath,
                nbrVote:0
            });
            indexListe++;
        }
        constructQueue(listeAttente);
        checksum[1]++;
    })
}

function constructQueue(liste) {
    $("#queue").html("");
    var i = 0;
    var indexQueue = 1;
    var listPlayed = liste.slice(0,indexCurrentSong+1);
    var listToPlay = liste.slice(indexCurrentSong+1);
    listToPlay.sort(function(a, b) {
        return parseFloat(b.nbrVote) - parseFloat(a.nbrVote);
    });
    liste = listPlayed.concat(listToPlay);
    listeAttente =  liste;
    liste.forEach(function (item, index, array) {
        if (index < indexCurrentSong) {
            $("#queue").append(
                "<li class='played'>" +
                    "<div class='index'>" + array[index].index + "</div>" +
                    "<div class='number'>" + indexQueue + "</div>" +
                    "<div class='song'>" +
                        array[index].artiste + (array[index].artiste == '' ? '' : ' - ') + array[index].titre +
                    "</div>" +
                    "<div class='duration'></div>" +
                    "<div class='path'>"+array[index].chemin+"</div>" +
                    '<div class="nbrVote">'+array[index].nbrVote+'</div>'+
                "</li>");
        } else if (index === indexCurrentSong) {
            $("#queue").append(
                "<li class='currentSong'>" +
                    "<div class='index'>" + array[index].index + "</div>" +
                    "<div class='number'>" + indexQueue + "</div>" +
                    "<div class='song'>" +
                        array[index].artiste + (array[index].artiste == '' ? '' : ' - ') + array[index].titre + "</div>" +
                    "<div class='duration'></div>" +
                    "<div class='path'>"+array[index].chemin+"</div>" +
                    '<div class="nbrVote">'+array[index].nbrVote+'</div>'+
                "</li>");
        } else if (index > indexCurrentSong) {
            $("#queue").append(
                "<li class='toPlay'>" +
                    "<div class='remove' onclick='removeSong(this)'>" +
                        "<i class='fa fa-close' aria-hidden='true'></i>" +
                    "</div>" +
                    "<div class='index'>" + array[index].index + "</div>" +
                    "<div class='number'>" + indexQueue + "</div>" +
                    "<div class='song'>" +
                        array[index].artiste + (array[index].artiste == '' ? '' : ' - ') + array[index].titre +
                    "</div>" +
                    "<div class='duration'></div>" +
                    "<div class='path'>"+array[index].chemin+"</div>" +
                    '<div class="nbrVote">'+array[index].nbrVote+'</div>'+
                "</li>");
        }
        indexQueue++;
    });
    if (listeAttente.length > 0) {
        $('#next-song').css('display', 'none');
    }
    if (listeAttente.length == 1) {
        nextSong();
        checksum[1]++;
    }
    tbodyCss();
}
function removeSong(boutonRemove) {
    for (var i=0; i<listeAttente.length; i++){
        if (listeAttente[i].index == boutonRemove.parentElement.getElementsByClassName('index')[0].innerText){
            listeAttente.splice(i, 1);
        }
    }
    constructQueue(listeAttente);
    checksum[1]++;
    //tbodyCss();
}

function clientAddQueue(indexChoixClient){//rajoute dans la fille d'atente le choix de chansons dans l'appli
    songChoice = library[indexChoixClient];
    checksum[1]++;
    listeAttente.push({index: indexListe, titre: songChoice.titre, artiste: songChoice.artiste, chemin: songChoice.chemin, cover: songChoice.image, nbrVote:0});
    indexListe++;
    if (listeAttente.length == 1) {
        nextSong();
    }
    constructQueue(listeAttente);
    if (listeAttente.length > 0) {
        $('#next-song').css('display', 'none');
    }
}
function addVote(indexVote){
    listeAttente[indexVote].nbrVote++;
    constructQueue(listeAttente);
    checksum[1]++;
};
