(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('../index.js');

},{"../index.js":2}],2:[function(require,module,exports){
/**
 * TextGeometry component for A-Frame.
 */
var debug = AFRAME.utils.debug;

var error = debug('aframe-text-component:error');

var fontLoader = new THREE.FontLoader();

AFRAME.registerComponent('text-geometry', {
  schema: {
    bevelEnabled: {default: false},
    bevelSize: {default: 8, min: 0},
    bevelThickness: {default: 12, min: 0},
    curveSegments: {default: 12, min: 0},
    font: {type: 'asset', default: 'https://rawgit.com/ngokevin/kframe/master/components/text-geometry/lib/helvetiker_regular.typeface.json'},
    height: {default: 0.05, min: 0},
    size: {default: 0.5, min: 0},
    style: {default: 'normal', oneOf: ['normal', 'italics']},
    weight: {default: 'normal', oneOf: ['normal', 'bold']},
    value: {default: ''}
  },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function (oldData) {
    var data = this.data;
    var el = this.el;

    var mesh = el.getOrCreateObject3D('mesh', THREE.Mesh);
    if (data.font.constructor === String) {
      // Load typeface.json font.
      fontLoader.load(data.font, function (response) {
        var textData = AFRAME.utils.clone(data);
        textData.font = response;
        mesh.geometry = new THREE.TextGeometry(data.value, textData);
      });
    } else if (data.font.constructor === Object) {
      // Set font if already have a typeface.json through setAttribute.
      mesh.geometry = new THREE.TextGeometry(data.value, data);
    } else {
      error('Must provide `font` (typeface.json) or `fontPath` (string) to text component.');
    }
  }
});

},{}]},{},[1]);
