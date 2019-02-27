/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerShader('ring', {
	schema: {
    blur: {default: 0.01, is: 'uniform'},
		color: {type: 'color', is: 'uniform'},
		progress: {default: 0, is: 'uniform'},
		radiusInner: {default: 0.6, is: 'uniform'},
		radiusOuter: {default: 1, is: 'uniform'}
	},

	vertexShader: require('./vertex.glsl'),

	fragmentShader: require('./fragment.glsl')
});
