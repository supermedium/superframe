var firebase = require('firebase');
var parse = require('url-parse');

var channelQueryParam = parse(location.href, true).query['aframe-firebase-channel'];

function FirebaseWrapper () { }

FirebaseWrapper.prototype.init = function (config) {
  this.channel = channelQueryParam || config.channel || 'default';
  this.firebase = firebase.initializeApp(config);
  this.database = firebase.database().ref(this.channel);
};

FirebaseWrapper.prototype.getAllEntities = function () {
  var database = this.database;
  return new Promise(function (resolve) {
    database.child('entities').once('value', function (snapshot) {
      resolve(snapshot.val() || {});
    });
  });
};

FirebaseWrapper.prototype.onEntityAdded = function (handler) {
  this.database.child('entities').on('child_added', function (data) {
    handler(data.key, data.val());
  });
};

FirebaseWrapper.prototype.onEntityChanged = function (handler) {
  this.database.child('entities').on('child_changed', function (data) {
    handler(data.key, data.val());
  });
};

FirebaseWrapper.prototype.onEntityRemoved = function (handler) {
  this.database.child('entities').on('child_removed', function (data) {
    handler(data.key);
  });
};

FirebaseWrapper.prototype.removeEntityOnDisconnect = function (id) {
  this.database.child('entities').child(id).onDisconnect().remove();
};

FirebaseWrapper.prototype.createEntity = function () {
  return this.database.child('entities').push().key;
};

FirebaseWrapper.prototype.updateEntity = function (id, data) {
  this.database.child('entities/' + id).update(data);
};

module.exports = FirebaseWrapper;
