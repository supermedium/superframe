var vertexShader = require('webpack-glsl!./shaders/vertex.glsl');
var fragmentShader = require('webpack-glsl!./shaders/fragment.glsl');

AFRAME.registerShader('sunSky', {
  schema: {
    luminance: {default: 1, min: 0, max: 2, is: 'uniform'},
    mieCoefficient: {default: 0.005, min: 0, max: 0.1, is: 'uniform'},
    mieDirectionalG: {default: 0.8, min: 0, max: 1, is: 'uniform'},
    reileigh: {default: 1, min: 0, max: 4, is: 'uniform'},
    sunPosition: {type: 'vec3', default: '0 0 -1', is: 'uniform'},
    turbidity: {default: 2, min: 0, max: 20, is: 'uniform'}
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
});

AFRAME.registerPrimitive('a-sun-sky', {
  defaultComponents: {
    geometry: {
      primitive: 'sphere',
      radius: 5000,
      segmentsWidth: 64,
      segmentsHeight: 20
    },
    material: {
      shader: 'sunSky',
      side: 'back'
    },
    scale: '-1 1 1'
  },

  mappings: {
    luminance: 'material.luminance',
    mieCoefficient: 'material.mieCoefficient',
    mieDirectionalG: 'material.mieDirectionalG',
    reileigh: 'material.reileigh',
    sunPosition: 'material.sunPosition',
    turbidity: 'material.turbidity'
  }
});
