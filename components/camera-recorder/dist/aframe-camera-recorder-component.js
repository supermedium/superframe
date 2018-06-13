/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

window.download = __webpack_require__(1);
window.GIF = __webpack_require__(2).GIF;
var Capture = __webpack_require__(3);

/* global AFRAME */
if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Camera recorder component for A-Frame.
 *
 * tilt, pan, dolly
 */
AFRAME.registerComponent('camera-recorder', {
  dependencies: ['camera'],

  schema: {
    dur: {default: 3000},
    enabled: {default: true},
    framerate: {default: 60},
    lookAt: {type: 'vec3'},
    holdTimeAfter: {default: 250},
    motionBlurEnabled: {default: true},
    name: {default: ''},
    quality: {default: 10},
    positionFrom: {type: 'vec3'},
    positionTo: {type: 'vec3'},
    rotationFrom: {type: 'vec3'},
    rotationTo: {type: 'vec3'},
    showControls: {default: true},
    workers: {default: 8},
    workerPath: {default: './'}
  },

  multiple: true,

  init: function () {
    var data = this.data;

    // Bind.
    this.startRecordingBound = () => { this.startRecording(false); };
    this.startPreviewingBound = () => { this.startRecording(true); };

    if (this.data.showControls) {
      this.injectRecordButton();
      this.injectDryRunButton();
    }

    // Create CCapture.
    this.capture = new Capture({
      format: 'gif',
      name: data.name || undefined,
      motionBlurFrames: data.motionBlurEnabled ? 1 : 0,
      onProgress: progress => {
        this.el.emit('camerarecorderprogress', progress, false);
      },
      quality: data.quality,
      workers: data.workers,
      workersPath: data.workerPath
    });

    this.lookAt = new THREE.Vector3();
    this.originalPosition = new THREE.Vector3();
    this.originalQuaternion = new THREE.Quaternion();
    this.originalCameraPosition = new THREE.Vector3();
    this.originalCameraQuaternion = new THREE.Quaternion();
  },

  update: function () {
    var data = this.data;
    var domAttributes;
    var el = this.el;

    this.time = 0;

    // To tell what is developer-defined.
    domAttributes = this.el.getDOMAttribute('camera-recorder');

    if ('positionTo' in domAttributes) {
      el.setAttribute('animation__recorderposition', {
        property: 'position',
        dur: data.dur,
        easing: 'linear',
        from: 'positionFrom' in domAttributes
          ? data.positionFrom
          : el.getAttribute('position'),
        startEvents: 'camerarecorderanimationstart',
        pauseEvents: 'camerarecorderanimationstop',
        to: data.positionTo,
      });
    }

    if ('rotationTo' in domAttributes) {
      el.setAttribute('animation__recorderrotation', {
        property: 'rotation',
        dur: data.dur,
        easing: 'linear',
        from: 'rotationFrom' in domAttributes
          ? data.rotationFrom
          : el.getAttribute('rotation'),
        startEvents: 'camerarecorderanimationstart',
        pauseEvents: 'camerarecorderanimationstop',
        to: data.rotationTo
      });
    }

    if ('lookAt' in domAttributes) {
      this.lookAt.copy(data.lookAt);
    }
  },

  play: function () {
    var el = this.el;
    el.addEventListener('camerarecorderstart', this.startRecordingBound);
    el.addEventListener('camerarecorderdrystart', this.startPreviewingBound);

    // Toggle off controls and set flag to see if we need to remove later.
    if (el.hasAttribute('look-controls') && el.getAttribute('look-controls').enabled) {
      el.setAttribute('look-controls', 'enabled', false);
      this.flippedLookControls = true;
    }

    if (el.hasAttribute('orbit-controls') && el.getAttribute('orbit-controls').enabled) {
      el.setAttribute('orbit-controls', 'enabled', false);
      this.flippedOrbitControls = true;
    }

    this.resetPose();
  },

  remove: function () {
    var el = this.el;
    el.emit('camerarecorderanimationstop', null, false);

    el.removeEventListener('camerarecorderstart', this.startRecordingBound);
    el.removeEventListener('camerarecorderdrystart', this.startPreviewingBound);

    // Re-enable controls if they were enabled before.
    if (this.flippedLookControls) {
      el.setAttribute('look-controls', 'enabled', true);
    }
    if (this.flippedOrbitControls) {
      el.setAttribute('orbit-controls', 'enabled', true);
    }

    setTimeout(() => {
      el.object3D.position.copy(this.originalPosition);
      el.object3D.quaternion.copy(this.originalQuaternion);
      el.getObject3D('camera').position.copy(this.originalCameraPosition);
      el.getObject3D('camera').quaternion.copy(this.originalCameraQuaternion);
    });
  },

  tick: function () {
    if (!this.isRecording && !this.isPreviewing) { return; }
    if (this.lookAt) {
      this.el.object3D.lookAt(this.lookAt);
    }
  },

  tock: function (t, dt) {
    if (!this.isRecording && !this.isPreviewing) { return; }

    this.time += dt;

    // Finished.
    if (this.time > this.data.dur + this.data.holdTimeAfter) {
      this.time = 0;

      setTimeout(() => {
        this.resetPose();
      }, this.data.holdTimeAfter + 100);

      if (this.isPreviewing) {
        this.isPreviewing = false;
        return;
      }

      this.isRecording = false;
      this.capture.stop();
      this.capture.save();
      if (this.recordButton) {
        this.recordButton.setAttribute('disabled', '');
        this.recordButton.innerHTML = 'Processing...';
      }
      return;
    }

    if (this.isRecording) {
      this.capture.capture(this.el.sceneEl.canvas);
    }
  },

  resetPose: function () {
    this.originalPosition.copy(this.el.object3D.position);
    this.originalQuaternion.copy(this.el.object3D.quaternion);
    this.originalCameraPosition.copy(this.el.getObject3D('camera').position);
    this.originalCameraQuaternion.copy(this.el.getObject3D('camera').quaternion);
  },

  startRecording: function (isDryRun) {
    this.el.emit('camerarecorderanimationstart');

    this.el.object3D.position.set(0, 0, 0);
    this.el.object3D.rotation.set(0, 0, 0);

    setTimeout(() => {
      if ('lookAt' in this.el.getDOMAttribute('camera-recorder')) {
        this.el.getObject3D('camera').rotation.y = Math.PI;
      }
      if (isDryRun) {
        this.isPreviewing = true;
        return;
      }

      this.capture.start();
      this.isRecording = true;
    });
  },

  injectRecordButton: function () {
    var button;
    button = document.createElement('button');
    button.innerHTML = 'Start recording';
    button.style.left = '5px';
    button.style.position = 'fixed';
    button.style.top = '5px';
    button.style.zIndex = 999999999999;
    document.body.appendChild(button);

    button.addEventListener('click', () => {
      this.startRecording();
    });

    this.recordButton = button;
  },

  injectDryRunButton: function () {
    var button;
    button = document.createElement('button');
    button.innerHTML = 'Preview recording';
    button.style.left = '5px';
    button.style.position = 'fixed';
    button.style.top = '30px';
    button.style.zIndex = 999999999999;
    document.body.appendChild(button);

    button.addEventListener('click', () => {
      this.startRecording(true);
    });
  }
});


/***/ }),
/* 1 */
/***/ (function(module, exports) {

//download.js v3.0, by dandavis; 2008-2014. [CCBY2] see http://danml.com/download.html for tests/usage
// v1 landed a FF+Chrome compat way of downloading strings to local un-named files, upgraded to use a hidden frame and optional mime
// v2 added named files via a[download], msSaveBlob, IE (10+) support, and window.URL support for larger+faster saves than dataURLs
// v3 added dataURL and Blob Input, bind-toggle arity, and legacy dataURL fallback was improved with force-download mime and base64 support

// data can be a string, Blob, File, or dataURL




module.exports = function download(data, strFileName, strMimeType) {

	var self = window, // this script is only for browsers anyway...
		u = "application/octet-stream", // this default mime also triggers iframe downloads
		m = strMimeType || u,
		x = data,
		D = document,
		a = D.createElement("a"),
		z = function(a){return String(a);},


		B = self.Blob || self.MozBlob || self.WebKitBlob || z,
		BB = self.MSBlobBuilder || self.WebKitBlobBuilder || self.BlobBuilder,
		fn = strFileName || "download",
		blob,
		b,
		ua,
		fr;

	//if(typeof B.bind === 'function' ){ B=B.bind(self); }

	if(String(this)==="true"){ //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
		x=[x, m];
		m=x[0];
		x=x[1];
	}



	//go ahead and download dataURLs right away
	if(String(x).match(/^data\:[\w+\-]+\/[\w+\-]+[,;]/)){
		return navigator.msSaveBlob ?  // IE10 can't do a[download], only Blobs:
			navigator.msSaveBlob(d2b(x), fn) :
			saver(x) ; // everyone else can save dataURLs un-processed
	}//end if dataURL passed?

	try{

		blob = x instanceof B ?
			x :
			new B([x], {type: m}) ;
	}catch(y){
		if(BB){
			b = new BB();
			b.append([x]);
			blob = b.getBlob(m); // the blob
		}

	}



	function d2b(u) {
		var p= u.split(/[:;,]/),
		t= p[1],
		dec= p[2] == "base64" ? atob : decodeURIComponent,
		bin= dec(p.pop()),
		mx= bin.length,
		i= 0,
		uia= new Uint8Array(mx);

		for(i;i<mx;++i) uia[i]= bin.charCodeAt(i);

		return new B([uia], {type: t});
	 }

	function saver(url, winMode){


		if ('download' in a) { //html5 A[download]
			a.href = url;
			a.setAttribute("download", fn);
			a.innerHTML = "downloading...";
			a.style.display = 'none';
			D.body.appendChild(a);
			setTimeout(function() {
				a.click();
				D.body.removeChild(a);
				if(winMode===true){setTimeout(function(){ self.URL.revokeObjectURL(a.href);}, 250 );}
			}, 66);
			return true;
		}

		//do iframe dataURL download (old ch+FF):
		var f = D.createElement("iframe");
		D.body.appendChild(f);
		if(!winMode){ // force a mime that will download:
			url="data:"+url.replace(/^data:([\w\/\-\+]+)/, u);
		}


		f.src = url;
		setTimeout(function(){ D.body.removeChild(f); }, 333);

	}//end saver


	if (navigator.msSaveBlob) { // IE10+ : (has Blob, but not a[download] or URL)
		return navigator.msSaveBlob(blob, fn);
	}

	if(self.URL){ // simple fast and modern way using Blob and URL:
		saver(self.URL.createObjectURL(blob), true);
	}else{
		// handle non-Blob()+non-URL browsers:
		if(typeof blob === "string" || blob.constructor===z ){
			try{
				return saver( "data:" +  m   + ";base64,"  +  self.btoa(blob)  );
			}catch(y){
				return saver( "data:" +  m   + "," + encodeURIComponent(blob)  );
			}
		}

		// Blob but not URL:
		fr=new FileReader();
		fr.onload=function(e){
			saver(this.result);
		};
		fr.readAsDataURL(blob);
	}
	return true;
} /* end download() */


/***/ }),
/* 2 */
/***/ (function(module, exports) {

(function(c){function a(b,d){if({}.hasOwnProperty.call(a.cache,b))return a.cache[b];var e=a.resolve(b);if(!e)throw new Error('Failed to resolve module '+b);var c={id:b,require:a,filename:b,exports:{},loaded:!1,parent:d,children:[]};d&&d.children.push(c);var f=b.slice(0,b.lastIndexOf('/')+1);return a.cache[b]=c.exports,e.call(c.exports,c,c.exports,f,b),c.loaded=!0,a.cache[b]=c.exports}a.modules={},a.cache={},a.resolve=function(b){return{}.hasOwnProperty.call(a.modules,b)?a.modules[b]:void 0},a.define=function(b,c){a.modules[b]=c};var b=function(a){return a='/',{title:'browser',version:'v0.10.26',browser:!0,env:{},argv:[],nextTick:c.setImmediate||function(a){setTimeout(a,0)},cwd:function(){return a},chdir:function(b){a=b}}}();a.define('/gif.coffee',function(d,m,l,k){function g(a,b){return{}.hasOwnProperty.call(a,b)}function j(d,b){for(var a=0,c=b.length;a<c;++a)if(a in b&&b[a]===d)return!0;return!1}function i(a,b){function d(){this.constructor=a}for(var c in b)g(b,c)&&(a[c]=b[c]);return d.prototype=b.prototype,a.prototype=new d,a.__super__=b.prototype,a}var h,c,f,b,e;f=a('events',d).EventEmitter,h=a('/browser.coffee',d),e=function(d){function a(d){var a,b;this.running=!1,this.options={},this.frames=[],this.freeWorkers=[],this.activeWorkers=[],this.setOptions(d);for(a in c)b=c[a],null!=this.options[a]?this.options[a]:this.options[a]=b}return i(a,d),c={workerScript:'gif.worker.js',workers:2,repeat:0,background:'#fff',quality:10,width:null,height:null,transparent:null},b={delay:500,copy:!1},a.prototype.setOption=function(a,b){return this.options[a]=b,null!=this._canvas&&(a==='width'||a==='height')?this._canvas[a]=b:void 0},a.prototype.setOptions=function(b){var a,c;return function(d){for(a in b){if(!g(b,a))continue;c=b[a],d.push(this.setOption(a,c))}return d}.call(this,[])},a.prototype.addFrame=function(a,d){var c,e;null==d&&(d={}),c={},c.transparent=this.options.transparent;for(e in b)c[e]=d[e]||b[e];if(null!=this.options.width||this.setOption('width',a.width),null!=this.options.height||this.setOption('height',a.height),'undefined'!==typeof ImageData&&null!=ImageData&&a instanceof ImageData)c.data=a.data;else if('undefined'!==typeof CanvasRenderingContext2D&&null!=CanvasRenderingContext2D&&a instanceof CanvasRenderingContext2D||'undefined'!==typeof WebGLRenderingContext&&null!=WebGLRenderingContext&&a instanceof WebGLRenderingContext)d.copy?c.data=this.getContextData(a):c.context=a;else if(null!=a.childNodes)d.copy?c.data=this.getImageData(a):c.image=a;else throw new Error('Invalid image');return this.frames.push(c)},a.prototype.render=function(){var d,a;if(this.running)throw new Error('Already running');if(!(null!=this.options.width&&null!=this.options.height))throw new Error('Width and height must be set prior to rendering');this.running=!0,this.nextFrame=0,this.finishedFrames=0,this.imageParts=function(c){for(var b=function(){var b;b=[];for(var a=0;0<=this.frames.length?a<this.frames.length:a>this.frames.length;0<=this.frames.length?++a:--a)b.push(a);return b}.apply(this,arguments),a=0,e=b.length;a<e;++a)d=b[a],c.push(null);return c}.call(this,[]),a=this.spawnWorkers();for(var c=function(){var c;c=[];for(var b=0;0<=a?b<a:b>a;0<=a?++b:--b)c.push(b);return c}.apply(this,arguments),b=0,e=c.length;b<e;++b)d=c[b],this.renderNextFrame();return this.emit('start'),this.emit('progress',0)},a.prototype.abort=function(){var a;while(!0){if(a=this.activeWorkers.shift(),!(null!=a))break;console.log('killing active worker'),a.terminate()}return this.running=!1,this.emit('abort')},a.prototype.spawnWorkers=function(){var a;return a=Math.min(this.options.workers,this.frames.length),function(){var c;c=[];for(var b=this.freeWorkers.length;this.freeWorkers.length<=a?b<a:b>a;this.freeWorkers.length<=a?++b:--b)c.push(b);return c}.apply(this,arguments).forEach(function(a){return function(c){var b;return console.log('spawning worker '+c),b=new Worker(a.options.workerScript),b.onmessage=function(a){return function(c){return a.activeWorkers.splice(a.activeWorkers.indexOf(b),1),a.freeWorkers.push(b),a.frameFinished(c.data)}}(a),a.freeWorkers.push(b)}}(this)),a},a.prototype.frameFinished=function(a){return console.log('frame '+a.index+' finished - '+this.activeWorkers.length+' active'),this.finishedFrames++,this.emit('progress',this.finishedFrames/this.frames.length),this.imageParts[a.index]=a,j(null,this.imageParts)?this.renderNextFrame():this.finishRendering()},a.prototype.finishRendering=function(){var e,a,k,m,b,d,h;b=0;for(var f=0,j=this.imageParts.length;f<j;++f)a=this.imageParts[f],b+=(a.data.length-1)*a.pageSize+a.cursor;b+=a.pageSize-a.cursor,console.log('rendering finished - filesize '+Math.round(b/1e3)+'kb'),e=new Uint8Array(b),d=0;for(var g=0,l=this.imageParts.length;g<l;++g){a=this.imageParts[g];for(var c=0,i=a.data.length;c<i;++c)h=a.data[c],k=c,e.set(h,d),k===a.data.length-1?d+=a.cursor:d+=a.pageSize}return m=new Blob([e],{type:'image/gif'}),this.emit('finished',m,e)},a.prototype.renderNextFrame=function(){var c,a,b;if(this.freeWorkers.length===0)throw new Error('No free workers');return this.nextFrame>=this.frames.length?void 0:(c=this.frames[this.nextFrame++],b=this.freeWorkers.shift(),a=this.getTask(c),console.log('starting frame '+(a.index+1)+' of '+this.frames.length),this.activeWorkers.push(b),b.postMessage(a))},a.prototype.getContextData=function(a){return a.getImageData(0,0,this.options.width,this.options.height).data},a.prototype.getImageData=function(b){var a;return null!=this._canvas||(this._canvas=document.createElement('canvas'),this._canvas.width=this.options.width,this._canvas.height=this.options.height),a=this._canvas.getContext('2d'),a.setFill=this.options.background,a.fillRect(0,0,this.options.width,this.options.height),a.drawImage(b,0,0),this.getContextData(a)},a.prototype.getTask=function(a){var c,b;if(c=this.frames.indexOf(a),b={index:c,last:c===this.frames.length-1,delay:a.delay,transparent:a.transparent,width:this.options.width,height:this.options.height,quality:this.options.quality,repeat:this.options.repeat,canTransfer:h.name==='chrome'},null!=a.data)b.data=a.data;else if(null!=a.context)b.data=this.getContextData(a.context);else if(null!=a.image)b.data=this.getImageData(a.image);else throw new Error('Invalid frame');return b},a}(f),d.exports=e}),a.define('/browser.coffee',function(f,g,h,i){var a,d,e,c,b;c=navigator.userAgent.toLowerCase(),e=navigator.platform.toLowerCase(),b=c.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/)||[null,'unknown',0],d=b[1]==='ie'&&document.documentMode,a={name:b[1]==='version'?b[3]:b[1],version:d||parseFloat(b[1]==='opera'&&b[4]?b[4]:b[2]),platform:{name:c.match(/ip(?:ad|od|hone)/)?'ios':(c.match(/(?:webos|android)/)||e.match(/mac|win|linux/)||['other'])[0]}},a[a.name]=!0,a[a.name+parseInt(a.version,10)]=!0,a.platform[a.platform.name]=!0,f.exports=a}),a.define('events',function(f,e,g,h){b.EventEmitter||(b.EventEmitter=function(){});var a=e.EventEmitter=b.EventEmitter,c=typeof Array.isArray==='function'?Array.isArray:function(a){return Object.prototype.toString.call(a)==='[object Array]'},d=10;a.prototype.setMaxListeners=function(a){this._events||(this._events={}),this._events.maxListeners=a},a.prototype.emit=function(f){if(f==='error'&&(!(this._events&&this._events.error)||c(this._events.error)&&!this._events.error.length))throw arguments[1]instanceof Error?arguments[1]:new Error("Uncaught, unspecified 'error' event.");if(!this._events)return!1;var a=this._events[f];if(!a)return!1;if(!(typeof a=='function'))if(c(a)){var b=Array.prototype.slice.call(arguments,1),e=a.slice();for(var d=0,g=e.length;d<g;d++)e[d].apply(this,b);return!0}else return!1;switch(arguments.length){case 1:a.call(this);break;case 2:a.call(this,arguments[1]);break;case 3:a.call(this,arguments[1],arguments[2]);break;default:var b=Array.prototype.slice.call(arguments,1);a.apply(this,b)}return!0},a.prototype.addListener=function(a,b){if('function'!==typeof b)throw new Error('addListener only takes instances of Function');if(this._events||(this._events={}),this.emit('newListener',a,b),!this._events[a])this._events[a]=b;else if(c(this._events[a])){if(!this._events[a].warned){var e;this._events.maxListeners!==undefined?e=this._events.maxListeners:e=d,e&&e>0&&this._events[a].length>e&&(this._events[a].warned=!0,console.error('(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.',this._events[a].length),console.trace())}this._events[a].push(b)}else this._events[a]=[this._events[a],b];return this},a.prototype.on=a.prototype.addListener,a.prototype.once=function(b,c){var a=this;return a.on(b,function d(){a.removeListener(b,d),c.apply(this,arguments)}),this},a.prototype.removeListener=function(a,d){if('function'!==typeof d)throw new Error('removeListener only takes instances of Function');if(!(this._events&&this._events[a]))return this;var b=this._events[a];if(c(b)){var e=b.indexOf(d);if(e<0)return this;b.splice(e,1),b.length==0&&delete this._events[a]}else this._events[a]===d&&delete this._events[a];return this},a.prototype.removeAllListeners=function(a){return a&&this._events&&this._events[a]&&(this._events[a]=null),this},a.prototype.listeners=function(a){return this._events||(this._events={}),this._events[a]||(this._events[a]=[]),c(this._events[a])||(this._events[a]=[this._events[a]]),this._events[a]}}),c.GIF=a('/gif.coffee')}.call(this,this))
//# sourceMappingURL=gif.js.map
// gif.js 0.1.6 - https://github.com/jnordberg/gif.js

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;;(function() {

"use strict";

var objectTypes = {
'function': true,
'object': true
};

function checkGlobal(value) {
    return (value && value.Object === Object) ? value : null;
  }

/** Built-in method references without a dependency on `root`. */
var freeParseFloat = parseFloat,
  freeParseInt = parseInt;

/** Detect free variable `exports`. */
var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType)
? exports
: undefined;

/** Detect free variable `module`. */
var freeModule = (objectTypes[typeof module] && module && !module.nodeType)
? module
: undefined;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = (freeModule && freeModule.exports === freeExports)
? freeExports
: undefined;

/** Detect free variable `global` from Node.js. */
var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);

/** Detect free variable `self`. */
var freeSelf = checkGlobal(objectTypes[typeof self] && self);

/** Detect free variable `window`. */
var freeWindow = checkGlobal(objectTypes[typeof window] && window);

/** Detect `this` as the global object. */
var thisGlobal = checkGlobal(objectTypes[typeof this] && this);

/**
* Used as a reference to the global object.
*
* The `this` value is used if it's the global object to avoid Greasemonkey's
* restricted `window` object, otherwise the `window` object is used.
*/
var root = freeGlobal ||
((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) ||
  freeSelf || thisGlobal || Function('return this')();

if( !('gc' in window ) ) {
	window.gc = function(){}
}

if (!HTMLCanvasElement.prototype.toBlob) {
 Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
  value: function (callback, type, quality) {

    var binStr = atob( this.toDataURL(type, quality).split(',')[1] ),
        len = binStr.length,
        arr = new Uint8Array(len);

    for (var i=0; i<len; i++ ) {
     arr[i] = binStr.charCodeAt(i);
    }

    callback( new Blob( [arr], {type: type || 'image/png'} ) );
  }
 });
}

// @license http://opensource.org/licenses/MIT
// copyright Paul Irish 2015


// Date.now() is supported everywhere except IE8. For IE8 we use the Date.now polyfill
//   github.com/Financial-Times/polyfill-service/blob/master/polyfills/Date.now/polyfill.js
// as Safari 6 doesn't have support for NavigationTiming, we use a Date.now() timestamp for relative values

// if you want values similar to what you'd get with real perf.now, place this towards the head of the page
// but in reality, you're just getting the delta between now() calls, so it's not terribly important where it's placed


(function(){

  if ("performance" in window == false) {
      window.performance = {};
  }

  Date.now = (Date.now || function () {  // thanks IE8
	  return new Date().getTime();
  });

  if ("now" in window.performance == false){

    var nowOffset = Date.now();

    if (performance.timing && performance.timing.navigationStart){
      nowOffset = performance.timing.navigationStart
    }

    window.performance.now = function now(){
      return Date.now() - nowOffset;
    }
  }

})();


function pad( n ) {
	return String("0000000" + n).slice(-7);
}
// https://developer.mozilla.org/en-US/Add-ons/Code_snippets/Timers

var g_startTime = window.Date.now();

function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function CCFrameEncoder( settings ) {

	var _handlers = {};

	this.settings = settings;

	this.on = function(event, handler) {

		_handlers[event] = handler;

	};

	this.emit = function(event) {

		var handler = _handlers[event];
		if (handler) {

			handler.apply(null, Array.prototype.slice.call(arguments, 1));

		}

	};

	this.filename = settings.name || guid();
	this.extension = '';
	this.mimeType = '';

}

CCFrameEncoder.prototype.start = function(){};
CCFrameEncoder.prototype.stop = function(){};
CCFrameEncoder.prototype.add = function(){};
CCFrameEncoder.prototype.save = function(){};
CCFrameEncoder.prototype.dispose = function(){};
CCFrameEncoder.prototype.safeToProceed = function(){ return true; };
CCFrameEncoder.prototype.step = function() { console.log( 'Step not set!' ) }

function CCTarEncoder( settings ) {

  CCFrameEncoder.call( this, settings );

  this.extension = '.tar'
  this.mimeType = 'application/x-tar'
  this.fileExtension = '';
  this.baseFilename = this.filename;

  this.tape = null
  this.count = 0;
  this.part = 1;
  this.frames = 0;

}

CCTarEncoder.prototype = Object.create( CCFrameEncoder.prototype );

CCTarEncoder.prototype.start = function(){

  this.dispose();

};

CCTarEncoder.prototype.add = function( blob ) {

  var fileReader = new FileReader();
  fileReader.onload = function() {
    this.tape.append( pad( this.count ) + this.fileExtension, new Uint8Array( fileReader.result ) );

    if( this.settings.autoSaveTime > 0 && ( this.frames / this.settings.framerate ) >= this.settings.autoSaveTime ) {
      this.save( function( blob ) {
        this.filename = this.baseFilename + '-part-' + pad( this.part );
        download( blob, this.filename + this.extension, this.mimeType );
        var count = this.count;
        this.dispose();
        this.count = count+1;
        this.part++;
        this.filename = this.baseFilename + '-part-' + pad( this.part );
        this.frames = 0;
        this.step();
      }.bind( this ) )
    } else {
      this.count++;
      this.frames++;
      this.step();
    }

  }.bind( this );
  fileReader.readAsArrayBuffer(blob);

}

CCTarEncoder.prototype.save = function( callback ) {

  callback( this.tape.save() );

}

CCTarEncoder.prototype.dispose = function() {

  this.tape = new Tar();
  this.count = 0;

}

function CCPNGEncoder( settings ) {

	CCTarEncoder.call( this, settings );

	this.type = 'image/png';
	this.fileExtension = '.png';

}

CCPNGEncoder.prototype = Object.create( CCTarEncoder.prototype );

CCPNGEncoder.prototype.add = function( canvas ) {

	canvas.toBlob( function( blob ) {
		CCTarEncoder.prototype.add.call( this, blob );
	}.bind( this ), this.type )

}

function CCJPEGEncoder( settings ) {

	CCTarEncoder.call( this, settings );

	this.type = 'image/jpeg';
	this.fileExtension = '.jpg';
	this.quality = ( settings.quality / 100 ) || .8;

}

CCJPEGEncoder.prototype = Object.create( CCTarEncoder.prototype );

CCJPEGEncoder.prototype.add = function( canvas ) {

	canvas.toBlob( function( blob ) {
		CCTarEncoder.prototype.add.call( this, blob );
	}.bind( this ), this.type, this.quality )

}

/*

	WebM Encoder

*/

function CCWebMEncoder( settings ) {

	var canvas = document.createElement( 'canvas' );
	if( canvas.toDataURL( 'image/webp' ).substr(5,10) !== 'image/webp' ){
		console.log( "WebP not supported - try another export format" )
	}

	CCFrameEncoder.call( this, settings );

	this.quality = ( settings.quality / 100 ) || .8;

	this.extension = '.webm'
	this.mimeType = 'video/webm'
	this.baseFilename = this.filename;
  this.framerate = settings.framerate;

	this.frames = 0;
	this.part = 1;

  this.videoWriter = new WebMWriter({
    quality: this.quality,
    fileWriter: null,
    fd: null,
    frameRate: this.framerate
  });

}

CCWebMEncoder.prototype = Object.create( CCFrameEncoder.prototype );

CCWebMEncoder.prototype.start = function( canvas ) {

	this.dispose();

}

CCWebMEncoder.prototype.add = function( canvas ) {

  this.videoWriter.addFrame(canvas);

	if( this.settings.autoSaveTime > 0 && ( this.frames / this.settings.framerate ) >= this.settings.autoSaveTime ) {
		this.save( function( blob ) {
			this.filename = this.baseFilename + '-part-' + pad( this.part );
			download( blob, this.filename + this.extension, this.mimeType );
			this.dispose();
			this.part++;
			this.filename = this.baseFilename + '-part-' + pad( this.part );
			this.step();
		}.bind( this ) )
	} else {
    this.frames++;
		this.step();
	}

}

CCWebMEncoder.prototype.save = function( callback ) {

  this.videoWriter.complete().then(callback);

}

CCWebMEncoder.prototype.dispose = function( canvas ) {

	this.frames = 0;
  this.videoWriter = new WebMWriter({
    quality: this.quality,
    fileWriter: null,
    fd: null,
    frameRate: this.framerate
  });

}

function CCFFMpegServerEncoder( settings ) {

	CCFrameEncoder.call( this, settings );

	settings.quality = ( settings.quality / 100 ) || .8;

	this.encoder = new FFMpegServer.Video( settings );
    this.encoder.on( 'process', function() {
        this.emit( 'process' )
    }.bind( this ) );
    this.encoder.on('finished', function( url, size ) {
        var cb = this.callback;
        if ( cb ) {
            this.callback = undefined;
            cb( url, size );
        }
    }.bind( this ) );
    this.encoder.on( 'progress', function( progress ) {
        if ( this.settings.onProgress ) {
            this.settings.onProgress( progress )
        }
    }.bind( this ) );
    this.encoder.on( 'error', function( data ) {
        alert(JSON.stringify(data, null, 2));
    }.bind( this ) );

}

CCFFMpegServerEncoder.prototype = Object.create( CCFrameEncoder.prototype );

CCFFMpegServerEncoder.prototype.start = function() {

	this.encoder.start( this.settings );

};

CCFFMpegServerEncoder.prototype.add = function( canvas ) {

	this.encoder.add( canvas );

}

CCFFMpegServerEncoder.prototype.save = function( callback ) {

    this.callback = callback;
    this.encoder.end();

}

CCFFMpegServerEncoder.prototype.safeToProceed = function() {
    return this.encoder.safeToProceed();
};

/*
	HTMLCanvasElement.captureStream()
*/

function CCStreamEncoder( settings ) {

	CCFrameEncoder.call( this, settings );

	this.framerate = this.settings.framerate;
	this.type = 'video/webm';
	this.extension = '.webm';
	this.stream = null;
	this.mediaRecorder = null;
	this.chunks = [];

}

CCStreamEncoder.prototype = Object.create( CCFrameEncoder.prototype );

CCStreamEncoder.prototype.add = function( canvas ) {

	if( !this.stream ) {
		this.stream = canvas.captureStream( this.framerate );
		this.mediaRecorder = new MediaRecorder( this.stream );
		this.mediaRecorder.start();

		this.mediaRecorder.ondataavailable = function(e) {
			this.chunks.push(e.data);
		}.bind( this );

	}
	this.step();

}

CCStreamEncoder.prototype.save = function( callback ) {

	this.mediaRecorder.onstop = function( e ) {
		var blob = new Blob( this.chunks, { 'type' : 'video/webm' });
		this.chunks = [];
		callback( blob );

	}.bind( this );

	this.mediaRecorder.stop();

}

/*function CCGIFEncoder( settings ) {

	CCFrameEncoder.call( this );

	settings.quality = settings.quality || 6;
	this.settings = settings;

	this.encoder = new GIFEncoder();
	this.encoder.setRepeat( 1 );
  	this.encoder.setDelay( settings.step );
  	this.encoder.setQuality( 6 );
  	this.encoder.setTransparent( null );
  	this.encoder.setSize( 150, 150 );

  	this.canvas = document.createElement( 'canvas' );
  	this.ctx = this.canvas.getContext( '2d' );

}

CCGIFEncoder.prototype = Object.create( CCFrameEncoder );

CCGIFEncoder.prototype.start = function() {

	this.encoder.start();

}

CCGIFEncoder.prototype.add = function( canvas ) {

	this.canvas.width = canvas.width;
	this.canvas.height = canvas.height;
	this.ctx.drawImage( canvas, 0, 0 );
	this.encoder.addFrame( this.ctx );

	this.encoder.setSize( canvas.width, canvas.height );
	var readBuffer = new Uint8Array(canvas.width * canvas.height * 4);
	var context = canvas.getContext( 'webgl' );
	context.readPixels(0, 0, canvas.width, canvas.height, context.RGBA, context.UNSIGNED_BYTE, readBuffer);
	this.encoder.addFrame( readBuffer, true );

}

CCGIFEncoder.prototype.stop = function() {

	this.encoder.finish();

}

CCGIFEncoder.prototype.save = function( callback ) {

	var binary_gif = this.encoder.stream().getData();

	var data_url = 'data:image/gif;base64,'+encode64(binary_gif);
	window.location = data_url;
	return;

	var blob = new Blob( [ binary_gif ], { type: "octet/stream" } );
	var url = window.URL.createObjectURL( blob );
	callback( url );

}*/

function CCGIFEncoder( settings ) {

	CCFrameEncoder.call( this, settings );

	settings.quality = 31 - ( ( settings.quality * 30 / 100 ) || 10 );
	settings.workers = settings.workers || 4;

	this.extension = '.gif'
	this.mimeType = 'image/gif'

  	this.canvas = document.createElement( 'canvas' );
  	this.ctx = this.canvas.getContext( '2d' );
  	this.sizeSet = false;

  	this.encoder = new GIF({
		workers: settings.workers,
		quality: settings.quality,
		workerScript: settings.workersPath + 'gif.worker.js'
	} );

    this.encoder.on( 'progress', function( progress ) {
        if ( this.settings.onProgress ) {
            this.settings.onProgress( progress )
        }
    }.bind( this ) );

    this.encoder.on('finished', function( blob ) {
        var cb = this.callback;
        if ( cb ) {
            this.callback = undefined;
            cb( blob );
        }
    }.bind( this ) );

}

CCGIFEncoder.prototype = Object.create( CCFrameEncoder.prototype );

CCGIFEncoder.prototype.add = function( canvas ) {

	if( !this.sizeSet ) {
		this.encoder.setOption( 'width',canvas.width );
		this.encoder.setOption( 'height',canvas.height );
		this.sizeSet = true;
	}

	this.canvas.width = canvas.width;
	this.canvas.height = canvas.height;
	this.ctx.drawImage( canvas, 0, 0 );

	this.encoder.addFrame( this.ctx, { copy: true, delay: this.settings.step } );
	this.step();

	/*this.encoder.setSize( canvas.width, canvas.height );
	var readBuffer = new Uint8Array(canvas.width * canvas.height * 4);
	var context = canvas.getContext( 'webgl' );
	context.readPixels(0, 0, canvas.width, canvas.height, context.RGBA, context.UNSIGNED_BYTE, readBuffer);
	this.encoder.addFrame( readBuffer, true );*/

}

CCGIFEncoder.prototype.save = function( callback ) {

    this.callback = callback;

	this.encoder.render();

}

function CCapture( settings ) {

	var _settings = settings || {},
		_date = new Date(),
		_verbose,
		_display,
		_time,
		_startTime,
		_performanceTime,
		_performanceStartTime,
		_step,
        _encoder,
		_timeouts = [],
		_intervals = [],
		_frameCount = 0,
		_intermediateFrameCount = 0,
		_lastFrame = null,
		_requestAnimationFrameCallbacks = [],
		_capturing = false,
        _handlers = {};

	_settings.framerate = _settings.framerate || 60;
	_settings.motionBlurFrames = 2 * ( _settings.motionBlurFrames || 1 );
	_verbose = _settings.verbose || false;
	_display = _settings.display || false;
	_settings.step = 1000.0 / _settings.framerate ;
	_settings.timeLimit = _settings.timeLimit || 0;
	_settings.frameLimit = _settings.frameLimit || 0;
	_settings.startTime = _settings.startTime || 0;

	var _timeDisplay = document.createElement( 'div' );
	_timeDisplay.style.position = 'absolute';
	_timeDisplay.style.left = _timeDisplay.style.top = 0
	_timeDisplay.style.backgroundColor = 'black';
	_timeDisplay.style.fontFamily = 'monospace'
	_timeDisplay.style.fontSize = '11px'
	_timeDisplay.style.padding = '5px'
	_timeDisplay.style.color = 'red';
	_timeDisplay.style.zIndex = 100000
	if( _settings.display ) document.body.appendChild( _timeDisplay );

	var canvasMotionBlur = document.createElement( 'canvas' );
	var ctxMotionBlur = canvasMotionBlur.getContext( '2d' );
	var bufferMotionBlur;
	var imageData;

	_log( 'Step is set to ' + _settings.step + 'ms' );

    var _encoders = {
		gif: CCGIFEncoder,
		webm: CCWebMEncoder,
		ffmpegserver: CCFFMpegServerEncoder,
		png: CCPNGEncoder,
		jpg: CCJPEGEncoder,
		'webm-mediarecorder': CCStreamEncoder
    };

    var ctor = _encoders[ _settings.format ];
    if ( !ctor ) {
		throw "Error: Incorrect or missing format: Valid formats are " + Object.keys(_encoders).join(", ");
    }
    _encoder = new ctor( _settings );
    _encoder.step = _step

	_encoder.on('process', _process);
    _encoder.on('progress', _progress);

    if ("performance" in window == false) {
    	window.performance = {};
    }

	Date.now = (Date.now || function () {  // thanks IE8
		return new Date().getTime();
	});

	if ("now" in window.performance == false){

		var nowOffset = Date.now();

		if (performance.timing && performance.timing.navigationStart){
			nowOffset = performance.timing.navigationStart
		}

		window.performance.now = function now(){
			return Date.now() - nowOffset;
		}
	}

	var _oldSetTimeout = window.setTimeout,
		_oldSetInterval = window.setInterval,
	    	_oldClearInterval = window.clearInterval,
		_oldClearTimeout = window.clearTimeout,
		_oldRequestAnimationFrame = window.requestAnimationFrame,
		_oldNow = window.Date.now,
		_oldPerformanceNow = window.performance.now,
		_oldGetTime = window.Date.prototype.getTime;
	// Date.prototype._oldGetTime = Date.prototype.getTime;

	var media = [];

	function _init() {

		_log( 'Capturer start' );

		_startTime = window.Date.now();
		_time = _startTime + _settings.startTime;
		_performanceStartTime = window.performance.now();
		_performanceTime = _performanceStartTime + _settings.startTime;

		window.Date.prototype.getTime = function(){
			return _time;
		};
		window.Date.now = function() {
			return _time;
		};

		window.setTimeout = function( callback, time ) {
			var t = {
				callback: callback,
				time: time,
				triggerTime: _time + time
			};
			_timeouts.push( t );
			_log( 'Timeout set to ' + t.time );
            return t;
		};
		window.clearTimeout = function( id ) {
			for( var j = 0; j < _timeouts.length; j++ ) {
				if( _timeouts[ j ] == id ) {
					_timeouts.splice( j, 1 );
					_log( 'Timeout cleared' );
					continue;
				}
			}
		};
		window.setInterval = function( callback, time ) {
			var t = {
				callback: callback,
				time: time,
				triggerTime: _time + time
			};
			_intervals.push( t );
			_log( 'Interval set to ' + t.time );
			return t;
		};
		window.clearInterval = function( id ) {
			_log( 'clear Interval' );
			return null;
		};
		window.requestAnimationFrame = function( callback ) {
			_requestAnimationFrameCallbacks.push( callback );
		};
		window.performance.now = function(){
			return _performanceTime;
		};

		function hookCurrentTime() { 
			if( !this._hooked ) {
				this._hooked = true;
				this._hookedTime = this.currentTime || 0;
				this.pause();
				media.push( this );
			}
			return this._hookedTime + _settings.startTime;
		};

		try {
			Object.defineProperty( HTMLVideoElement.prototype, 'currentTime', { get: hookCurrentTime } )
			Object.defineProperty( HTMLAudioElement.prototype, 'currentTime', { get: hookCurrentTime } )
		} catch (err) {
			_log(err);
		}

	}

	function _start() {
		_init();
		_encoder.start();
		_capturing = true;
	}

	function _stop() {
		_capturing = false;
		_encoder.stop();
		_destroy();
	}

	function _call( fn, p ) {
		_oldSetTimeout( fn, 0, p );
	}

	function _step() {
		//_oldRequestAnimationFrame( _process );
		_call( _process );
	}

	function _destroy() {
		_log( 'Capturer stop' );
		window.setTimeout = _oldSetTimeout;
		window.setInterval = _oldSetInterval;
		window.clearInterval = _oldClearInterval;
		window.clearTimeout = _oldClearTimeout;
		window.requestAnimationFrame = _oldRequestAnimationFrame;
		window.Date.prototype.getTime = _oldGetTime;
		window.Date.now = _oldNow;
		window.performance.now = _oldPerformanceNow;
	}

	function _updateTime() {
		var seconds = _frameCount / _settings.framerate;
		if( ( _settings.frameLimit && _frameCount >= _settings.frameLimit ) || ( _settings.timeLimit && seconds >= _settings.timeLimit ) ) {
			_stop();
			_save();
		}
		var d = new Date( null );
		d.setSeconds( seconds );
		if( _settings.motionBlurFrames > 2 ) {
			_timeDisplay.textContent = 'CCapture ' + _settings.format + ' | ' + _frameCount + ' frames (' + _intermediateFrameCount + ' inter) | ' +  d.toISOString().substr( 11, 8 );
		} else {
			_timeDisplay.textContent = 'CCapture ' + _settings.format + ' | ' + _frameCount + ' frames | ' +  d.toISOString().substr( 11, 8 );
		}
	}

	function _checkFrame( canvas ) {

		if( canvasMotionBlur.width !== canvas.width || canvasMotionBlur.height !== canvas.height ) {
			canvasMotionBlur.width = canvas.width;
			canvasMotionBlur.height = canvas.height;
			bufferMotionBlur = new Uint16Array( canvasMotionBlur.height * canvasMotionBlur.width * 4 );
			ctxMotionBlur.fillStyle = '#0'
			ctxMotionBlur.fillRect( 0, 0, canvasMotionBlur.width, canvasMotionBlur.height );
		}

	}

	function _blendFrame( canvas ) {

		//_log( 'Intermediate Frame: ' + _intermediateFrameCount );

		ctxMotionBlur.drawImage( canvas, 0, 0 );
		imageData = ctxMotionBlur.getImageData( 0, 0, canvasMotionBlur.width, canvasMotionBlur.height );
		for( var j = 0; j < bufferMotionBlur.length; j+= 4 ) {
			bufferMotionBlur[ j ] += imageData.data[ j ];
			bufferMotionBlur[ j + 1 ] += imageData.data[ j + 1 ];
			bufferMotionBlur[ j + 2 ] += imageData.data[ j + 2 ];
		}
		_intermediateFrameCount++;

	}

	function _saveFrame(){

		var data = imageData.data;
		for( var j = 0; j < bufferMotionBlur.length; j+= 4 ) {
			data[ j ] = bufferMotionBlur[ j ] * 2 / _settings.motionBlurFrames;
			data[ j + 1 ] = bufferMotionBlur[ j + 1 ] * 2 / _settings.motionBlurFrames;
			data[ j + 2 ] = bufferMotionBlur[ j + 2 ] * 2 / _settings.motionBlurFrames;
		}
		ctxMotionBlur.putImageData( imageData, 0, 0 );
		_encoder.add( canvasMotionBlur );
		_frameCount++;
		_intermediateFrameCount = 0;
		_log( 'Full MB Frame! ' + _frameCount + ' ' +  _time );
		for( var j = 0; j < bufferMotionBlur.length; j+= 4 ) {
			bufferMotionBlur[ j ] = 0;
			bufferMotionBlur[ j + 1 ] = 0;
			bufferMotionBlur[ j + 2 ] = 0;
		}
		gc();

	}

	function _capture( canvas ) {

		if( _capturing ) {

			if( _settings.motionBlurFrames > 2 ) {

				_checkFrame( canvas );
				_blendFrame( canvas );

				if( _intermediateFrameCount >= .5 * _settings.motionBlurFrames ) {
					_saveFrame();
				} else {
					_step();
				}

			} else {
				_encoder.add( canvas );
				_frameCount++;
				_log( 'Full Frame! ' + _frameCount );
			}

		}

	}

	function _process() {

		var step = 1000 / _settings.framerate;
		var dt = ( _frameCount + _intermediateFrameCount / _settings.motionBlurFrames ) * step;

		_time = _startTime + dt;
		_performanceTime = _performanceStartTime + dt;

		media.forEach( function( v ) {
			v._hookedTime = dt / 1000;
		} );

		_updateTime();
		_log( 'Frame: ' + _frameCount + ' ' + _intermediateFrameCount );

		for( var j = 0; j < _timeouts.length; j++ ) {
			if( _time >= _timeouts[ j ].triggerTime ) {
				_call( _timeouts[ j ].callback )
				//console.log( 'timeout!' );
				_timeouts.splice( j, 1 );
				continue;
			}
		}

		for( var j = 0; j < _intervals.length; j++ ) {
			if( _time >= _intervals[ j ].triggerTime ) {
				_call( _intervals[ j ].callback );
				_intervals[ j ].triggerTime += _intervals[ j ].time;
				//console.log( 'interval!' );
				continue;
			}
		}

		_requestAnimationFrameCallbacks.forEach( function( cb ) {
     		_call( cb, _time - g_startTime );
        } );
        _requestAnimationFrameCallbacks = [];

	}

	function _save( callback ) {

		if( !callback ) {
			callback = function( blob ) {
				download( blob, _encoder.filename + _encoder.extension, _encoder.mimeType );
				return false;
			}
		}
		_encoder.save( callback );

	}

	function _log( message ) {
		if( _verbose ) console.log( message );
	}

    function _on( event, handler ) {

        _handlers[event] = handler;

    }

    function _emit( event ) {

        var handler = _handlers[event];
        if ( handler ) {

            handler.apply( null, Array.prototype.slice.call( arguments, 1 ) );

        }

    }

    function _progress( progress ) {

        _emit( 'progress', progress );

    }

	return {
		start: _start,
		capture: _capture,
		stop: _stop,
		save: _save,
        on: _on
	}
}

(freeWindow || freeSelf || {}).CCapture = CCapture;

  // Some AMD build optimizers like r.js check for condition patterns like the following:
  if (true) {
    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
    	return CCapture;
    }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}
  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
  else if (freeExports && freeModule) {
    // Export for Node.js.
    if (moduleExports) {
    	(freeModule.exports = CCapture).CCapture = CCapture;
    }
    // Export for CommonJS support.
    freeExports.CCapture = CCapture;
}
else {
    // Export to the global object.
    root.CCapture = CCapture;
}

}());

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)(module), __webpack_require__(5)))

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })
/******/ ]);