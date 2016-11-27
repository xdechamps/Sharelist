//afffiche adresse ip locale dans console et dans la div ip1
var network = require('network');
network.get_private_ip(function(err,ip) {
  console.log(err||ip);
  document.getElementById("ip1").innerText = err||ip;
})
