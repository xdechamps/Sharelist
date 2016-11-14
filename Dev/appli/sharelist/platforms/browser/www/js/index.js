/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        //document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        console.log('app ok');
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

$(document).ready(function(){

  console.log('ready index.js on ' + document.location.href);
  setTimeout(function(){$("#load").fadeOut();},300);

  //INDEX

  //PLAYLIST
  $('#open-playlist').click(function(){
    $('#container-playlist').show();
  })
  $('#fermer-playlist').click(function(){
    $("#container-playlist").hide();
  })

  //AJOUTER MUSIQUE
  $('.ajout').click(function(){
    console.log('clicked');
    $(".alert").show().css('display','flex');
    setTimeout( function() {
      $(".alert").fadeOut();
    }, 200);
  });

  //HOME

  if(document.location.href == "http://localhost:8000/home.html"){
    var ipServer = sessionStorage.getItem("ipServer");
    $('#ip-server-show').text("IP du serveur : " + ipServer);
  }

//end ready
});

function sendIP(e,ip){
  e.preventDefault();
  console.log("IP du serveur : " + ip);
  sessionStorage.setItem("ipServer",ip);
  // setTimeout(function(){
  //   document.location.href="home.html";
  //   $('#ip-server-show').val(ip);
  // },1000);
}
