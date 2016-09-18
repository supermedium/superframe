var ImprovedNoise = require('./lib/ImprovedNoise.js');

/**
 * Mountain component.
 */
AFRAME.registerComponent('mountain', {
  schema: {
    color: {default: 'rgb(92, 32, 0)'},
    shadowColor: {default: 'rgb(128, 96, 96)'},
    sunPosition: {type: 'vec3', default: {x: 1, y: 1, z: 1}}
  },

  update: function () {
    var data = this.data;

    var worldDepth = 256;
    var worldWidth = 256;

    // Generate heightmap.
    var terrainData = generateHeight(worldWidth, worldDepth);

    // Texture.
    var canvas = generateTexture(
      terrainData, worldWidth, worldDepth, new THREE.Color(data.color),
      new THREE.Color(data.shadowColor), data.sunPosition);
    var texture = new THREE.CanvasTexture(canvas);
		texture.wrapS = THREE.ClampToEdgeWrapping;
		texture.wrapT = THREE.ClampToEdgeWrapping;

    // Create geometry.
    var geometry = new THREE.PlaneBufferGeometry(7500, 7500, worldWidth - 1, worldDepth - 1);
    geometry.rotateX(- Math.PI / 2);
		var vertices = geometry.attributes.position.array;
		for (var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3) {
		  vertices[j + 1] = terrainData[i] * 10;
    }

    // Lower geometry.
    geometry.translate(
      0, -1 * (terrainData[worldWidth / 2 + worldDepth / 2* worldWidth] * 10 + 500), 0
    );

    // Create material.
    var material = new THREE.MeshBasicMaterial({map: texture});

    // Create mesh.
    var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({map: texture}));
    this.el.setObject3D('mesh', mesh);
  }
});

function generateHeight (width, height) {
  var size = width * height;
  var data = new Uint8Array(size);
  var perlin = new ImprovedNoise();
  var quality = 1;
  var z = Math.random() * 100;

  for (var j = 0; j < 4; j ++) {
    for (var i = 0; i < size; i ++) {
      var x = i % width, y = ~~ (i / width);
      data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);
    }
    quality *= 5;
  }

  return data;
}

function generateTexture (terrainData, width, height, color, colorShadow, sunPos) {
  var sun = new THREE.Vector3(sunPos.x, sunPos.y, sunPos.z);
  sun.normalize();

  // Create canvas and context.
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  var context = canvas.getContext('2d');
  context.fillStyle = '#000';
  context.fillRect(0, 0, width, height);

  var image = context.getImageData(0, 0, canvas.width, canvas.height);
  var imageData = image.data;

  // Convert three.js rgb to 256.
  var red = color.r * 256;
  var green = color.g * 256;
  var blue = color.b * 256;
  var redShadow = colorShadow.r * 256;
  var greenShadow = colorShadow.g * 256;
  var blueShadow = colorShadow.b * 256;

  var shade;
  var vector3 = new THREE.Vector3(0, 0, 0);
  for (var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++) {
    vector3.x = terrainData[j - 2] - terrainData[j + 2];
    vector3.y = 2;
    vector3.z = terrainData[j - width * 2] - terrainData[j + width * 2];
    vector3.normalize();
    shade = vector3.dot(sun);
    imageData[i] = (red + shade * redShadow) * (0.5 + terrainData[j] * 0.007);
    imageData[i + 1] = (green + shade * blueShadow) * (0.5 + terrainData[j] * 0.007);
    imageData[i + 2] = (blue + shade * greenShadow) * (0.5 + terrainData[j] * 0.007);
  }

  context.putImageData(image, 0, 0);

  // Scaled 4x.
  var canvasScaled = document.createElement('canvas');
  canvasScaled.width = width * 4;
  canvasScaled.height = height * 4;

  context = canvasScaled.getContext('2d');
  context.scale(4, 4);
  context.drawImage(canvas, 0, 0);

  image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
  imageData = image.data;

  for (var i = 0, l = imageData.length; i < l; i += 4) {
    var v = ~~ (Math.random() * 5);
    imageData[i] += v;
    imageData[i + 1] += v;
    imageData[i + 2] += v;
  }

  context.putImageData(image, 0, 0);
  return canvasScaled;
}

/**
 * <a-mountain>
 */
AFRAME.registerPrimitive('a-mountain', {
  defaultComponents: {
    mountain: {}
  },

  mappings: {
    color: 'mountain.color',
    'shadow-color': 'mountain.shadowColor',
    'sun-position': 'mountain.sunPosition'
  }
});
