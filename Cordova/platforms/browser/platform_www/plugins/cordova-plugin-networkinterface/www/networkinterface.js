cordova.define("cordova-plugin-networkinterface.networkinterface", function(require, exports, module) { var networkinterface = function() {
};

networkinterface.getIPAddress = function( success, fail ) {
    cordova.exec( success, fail, "networkinterface", "getIPAddress", [] );
};

module.exports = networkinterface;

});
