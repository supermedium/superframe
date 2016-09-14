/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var templateString = __webpack_require__(1);

	var debug = AFRAME.utils.debug;
	var extend = AFRAME.utils.extend;
	var templateCache = {};  // Template cache.
	var error = debug('template-component:error');
	var log = debug('template-component:info');

	var HANDLEBARS = 'handlebars';
	var JADE = 'jade';
	var MUSTACHE = 'mustache';
	var NUNJUCKS = 'nunjucks';
	var HTML = 'html';

	var LIB_LOADED = {};
	LIB_LOADED[HANDLEBARS] = !!window.Handlebars;
	LIB_LOADED[JADE] = !!window.jade;
	LIB_LOADED[MUSTACHE] = !!window.Mustache;
	LIB_LOADED[NUNJUCKS] = !!window.nunjucks;

	var LIB_SRC = {};
	LIB_SRC[HANDLEBARS] = 'https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.5/handlebars.min.js';
	LIB_SRC[JADE] = 'https://cdnjs.cloudflare.com/ajax/libs/jade/1.11.0/jade.min.js';
	LIB_SRC[MUSTACHE] = 'https://cdnjs.cloudflare.com/ajax/libs/mustache.js/2.2.1/mustache.min.js';
	LIB_SRC[NUNJUCKS] = 'https://cdnjs.cloudflare.com/ajax/libs/nunjucks/2.3.0/nunjucks.min.js';

	AFRAME.registerComponent('template', {
	  schema: {
	    insert: {
	      // insertAdjacentHTML.
	      default: 'beforeend'
	    },
	    type: {
	      default: ''
	    },
	    src: {
	      // Selector or URL.
	      default: ''
	    },
	    data: {
	      default: ''
	    }
	  },

	  update: function (oldData) {
	    var data = this.data;
	    var el = this.el;
	    var fetcher = data.src[0] === '#' ? fetchTemplateFromScriptTag : fetchTemplateFromXHR;
	    var templateCacheItem = templateCache[data.src];

	    // Replace children if swapping templates.
	    if (oldData && oldData.src !== data.src) {
	      while (el.firstChild) {
	        el.removeChild(el.firstChild);
	      }
	    }

	    if (templateCacheItem) {
	      this.renderTemplate(templateCacheItem);
	      return;
	    }

	    fetcher(data.src, data.type).then(this.renderTemplate.bind(this));
	  },

	  renderTemplate: function (templateCacheItem) {
	    var el = this.el;
	    var data = this.data;
	    var templateData = {};

	    Object.keys(el.dataset).forEach(function convertToData (key) {
	      templateData[key] = el.dataset[key];
	    });
	    if (data.data) {
	      templateData = extend(templateData, el.getComputedAttribute(data.data));
	    }

	    var renderedTemplate = renderTemplate(templateCacheItem.template, templateCacheItem.type,
	                                          templateData);
	    el.insertAdjacentHTML(data.insert, renderedTemplate);
	  }
	});

	/**
	 * Helper to compile template, lazy-loading the template engine if needed.
	 */
	function compileTemplate (src, type, templateStr) {
	  return new Promise(function (resolve) {
	    injectTemplateLib(type).then(function () {
	      templateCache[src] = {
	        template: getCompiler(type)(templateStr.trim()),
	        type: type
	      };
	      resolve(templateCache[src]);
	    });
	  });
	}

	function renderTemplate (template, type, context) {
	  switch (type) {
	    case HANDLEBARS: {
	      return template(context);
	    }
	    case JADE: {
	      return template(context);
	    }
	    case MUSTACHE: {
	      return Mustache.render(template, context);
	    }
	    case NUNJUCKS: {
	      return template.render(context);
	    }
	    default: {
	      // If type not specified, assume HTML. Add some ES6 template string sugar.
	      console.log(template);
	      console.log(context);
	      return templateString(template, context);
	    }
	  }
	}

	/**
	 * Cache and compile templates.
	 */
	function fetchTemplateFromScriptTag (src, type) {
	  var compiler;
	  var scriptEl = document.querySelector(src);
	  var scriptType = scriptEl.getAttribute('type');
	  var templateStr = scriptEl.innerHTML;

	  // Try to infer template type from <script type> if type not specified.
	  if (!type) {
	    if (!scriptType) {
	      throw new Error('Must provide `type` attribute for <script> templates (e.g., handlebars, jade, nunjucks, html)');
	    }
	    if (scriptType.indexOf('handlebars') !== -1) {
	      type = HANDLEBARS;
	    } else if (scriptType.indexOf('jade') !== -1) {
	      type = JADE
	    } else if (scriptType.indexOf('mustache') !== -1) {
	      type = MUSTACHE;
	    } else if (scriptType.indexOf('nunjucks') !== -1) {
	      type = NUNJUCKS
	    } else if (scriptType.indexOf('html') !== -1) {
	      type = HTML;
	    } else {
	      error('Template type could not be inferred from the script tag. Please add a type.');
	      return;
	    }
	  }

	  return new Promise(function (resolve) {
	    compileTemplate(src, type, templateStr).then(function (template) {
	      resolve(template, type);
	    });
	  });
	}

	function fetchTemplateFromXHR (src, type) {
	  return new Promise(function (resolve) {
	    var request;
	    request = new XMLHttpRequest();
	    request.addEventListener('load', function () {
	      // Template fetched. Use template.
	      compileTemplate(src, type, request.response).then(function (template) {
	        resolve(template, type);
	      });
	    });
	    request.open('GET', src);
	    request.send();
	  });
	}

	/**
	 * Get compiler given type.
	 */
	function getCompiler (type) {
	  switch (type) {
	    case HANDLEBARS: {
	      return compileHandlebarsTemplate;
	    }
	    case JADE: {
	      return compileJadeTemplate;
	    }
	    case MUSTACHE: {
	      return compileHandlebarsTemplate;
	    }
	    case NUNJUCKS: {
	      return compileNunjucksTemplate;
	    }
	    default: {
	      // If type not specified, assume raw HTML and no templating needed.
	      return function (str) { return str; };
	    }
	  }
	}

	function compileHandlebarsTemplate (templateStr) {
	  return Handlebars.compile(templateStr);
	}

	function compileJadeTemplate (templateStr) {
	  return jade.compile(templateStr);
	}

	function compileMustacheTemplate (templateStr) {
	  Mustache.parse(templateStr);
	  return templateStr;
	}

	function compileNunjucksTemplate (templateStr) {
	  return nunjucks.compile(templateStr);
	}

	function injectTemplateLib (type) {
	  return new Promise(function (resolve) {
	    // No lib injection required.
	    if (!type || type === 'html') { return resolve(); }

	    var scriptEl = LIB_LOADED[type];

	    // Engine loaded.
	    if (LIB_LOADED[type] === true) { return resolve(); }

	    // Start lazy-loading.
	    if (!scriptEl) {
	      scriptEl = document.createElement('script');
	      LIB_LOADED[type] = scriptEl;
	      scriptEl.setAttribute('src', LIB_SRC[type]);
	      log('Lazy-loading %s engine. Please add <script src="%s"> to your page.',
	          type, LIB_SRC[type]);
	      document.body.appendChild(scriptEl);
	    }

	    // Wait for onload, whether just injected or already lazy-loading.
	    var prevOnload = scriptEl.onload || function () {};
	    scriptEl.onload = function () {
	      prevOnload();
	      LIB_LOADED[type] = true;
	      resolve();
	    };
	  });
	};

	AFRAME.registerComponent('template-set', {
	  schema: {
	    on: {type: 'string'},
	    src: {type: 'string'},
	    data: {type: 'string'}
	  },

	  init: function () {
	    var data = this.data;
	    var el = this.el;
	    el.addEventListener(data.on, function () {
	      el.setAttribute('template', {src: data.src, data: data.data});
	    });
	  }
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var compile = __webpack_require__(2)
	  , resolve = __webpack_require__(40);

	module.exports = function (template, context/*, options*/) {
		return resolve(compile(template), context, arguments[2]);
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var esniff = __webpack_require__(3)

	  , i, current, literals, substitutions, sOut, sEscape, sAhead, sIn, sInEscape, template;

	sOut = function (char) {
		if (char === '\\') return sEscape;
		if (char === '$') return sAhead;
		current += char;
		return sOut;
	};
	sEscape = function (char) {
		if ((char !== '\\') && (char !== '$')) current += '\\';
		current += char;
		return sOut;
	};
	sAhead = function (char) {
		if (char === '{') {
			literals.push(current);
			current = '';
			return sIn;
		}
		if (char === '$') {
			current += '$';
			return sAhead;
		}
		current += '$' + char;
		return sOut;
	};
	sIn = function (char) {
		var code = template.slice(i), end;
		esniff(code, '}', function (j) {
			if (esniff.nest >= 0) return esniff.next();
			end = j;
		});
		if (end != null) {
			substitutions.push(template.slice(i, i + end));
			i += end;
			current = '';
			return sOut;
		}
		end = code.length;
		i += end;
		current += code;
		return sIn;
	};
	sInEscape = function (char) {
		if ((char !== '\\') && (char !== '}')) current += '\\';
		current += char;
		return sIn;
	};

	module.exports = function (str) {
		var length, state, result;
		current = '';
		literals = [];
		substitutions = [];

		template = String(str);
		length = template.length;

		state = sOut;
		for (i = 0; i < length; ++i) state = state(template[i]);
		if (state === sOut) {
			literals.push(current);
		} else if (state === sEscape) {
			literals.push(current + '\\');
		} else if (state === sAhead) {
			literals.push(current + '$');
		} else if (state === sIn) {
			literals[literals.length - 1] += '${' + current;
		} else if (state === sInEscape) {
			literals[literals.length - 1] += '${' + current + '\\';
		}
		result = { literals: literals, substitutions: substitutions };
		literals = substitutions = null;
		return result;
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var from         = __webpack_require__(4)
	  , primitiveSet = __webpack_require__(35)
	  , value        = __webpack_require__(17)
	  , callable     = __webpack_require__(33)
	  , d            = __webpack_require__(36)
	  , eolSet       = __webpack_require__(37)
	  , wsSet        = __webpack_require__(38)

	  , hasOwnProperty = Object.prototype.hasOwnProperty
	  , preRegExpSet = primitiveSet.apply(null, from(';{=([,<>+-*/%&|^!~?:}'))
	  , nonNameSet = primitiveSet.apply(null, from(';{=([,<>+-*/%&|^!~?:})].'))

	  , move, startCollect, endCollect, collectNest
	  , $ws, $common, $string, $comment, $multiComment, $regExp

	  , i, char, line, columnIndex, afterWs, previousChar
	  , nest, nestedTokens, results
	  , userCode, userTriggerChar, isUserTriggerOperatorChar, userCallback

	  , quote
	  , collectIndex, data, nestRelease;

	move = function (j) {
		if (!char) return;
		if (i >= j) return;
		while (i !== j) {
			if (!char) return;
			if (hasOwnProperty.call(wsSet, char)) {
				if (hasOwnProperty.call(eolSet, char)) {
					columnIndex = i;
					++line;
				}
			} else {
				previousChar = char;
			}
			char = userCode[++i];
		}
	};

	startCollect = function (oldNestRelease) {
		if (collectIndex != null) nestedTokens.push([data, collectIndex, oldNestRelease]);
		data = { point: i + 1, line: line, column: i + 1 - columnIndex };
		collectIndex = i;
	};

	endCollect = function () {
		var previous;
		data.raw = userCode.slice(collectIndex, i);
		results.push(data);
		if (nestedTokens.length) {
			previous = nestedTokens.pop();
			data = previous[0];
			collectIndex = previous[1];
			nestRelease = previous[2];
			return;
		}
		data = null;
		collectIndex = null;
		nestRelease = null;
	};

	collectNest = function () {
		var old = nestRelease;
		nestRelease = nest;
		++nest;
		move(i + 1);
		startCollect(old);
		return $ws;
	};

	$common = function () {
		if ((char === '\'') || (char === '"')) {
			quote = char;
			char = userCode[++i];
			return $string;
		}
		if ((char === '(') || (char === '{') || (char === '[')) {
			++nest;
		} else if ((char === ')') || (char === '}') || (char === ']')) {
			if (nestRelease === --nest) endCollect();
		} else if (char === '/') {
			if (hasOwnProperty.call(preRegExpSet, previousChar)) {
				char = userCode[++i];
				return $regExp;
			}
		}
		if ((char !== userTriggerChar) || (!isUserTriggerOperatorChar && previousChar && !afterWs &&
				!hasOwnProperty.call(nonNameSet, previousChar))) {
			previousChar = char;
			char = userCode[++i];
			return $ws;
		}

		return userCallback(i, previousChar, nest);
	};

	$comment = function () {
		while (true) {
			if (!char) return;
			if (hasOwnProperty.call(eolSet, char)) {
				columnIndex = i + 1;
				++line;
				return;
			}
			char = userCode[++i];
		}
	};

	$multiComment = function () {
		while (true) {
			if (!char) return;
			if (char === '*') {
				char = userCode[++i];
				if (char === '/') return;
				continue;
			}
			if (hasOwnProperty.call(eolSet, char)) {
				columnIndex = i + 1;
				++line;
			}
			char = userCode[++i];
		}
	};

	$ws = function () {
		var next;
		afterWs = false;
		while (true) {
			if (!char) return;
			if (hasOwnProperty.call(wsSet, char)) {
				afterWs = true;
				if (hasOwnProperty.call(eolSet, char)) {
					columnIndex = i + 1;
					++line;
				}
			} else if (char === '/') {
				next = userCode[i + 1];
				if (next === '/') {
					char = userCode[i += 2];
					afterWs = true;
					$comment();
				} else if (next === '*') {
					char = userCode[i += 2];
					afterWs = true;
					$multiComment();
				} else {
					break;
				}
			} else {
				break;
			}
			char = userCode[++i];
		}
		return $common;
	};

	$string = function () {
		while (true) {
			if (!char) return;
			if (char === quote) {
				char = userCode[++i];
				previousChar = quote;
				return $ws;
			}
			if (char === '\\') {
				if (hasOwnProperty.call(eolSet, userCode[++i])) {
					columnIndex = i + 1;
					++line;
				}
			}
			char = userCode[++i];
		}
	};

	$regExp = function () {
		while (true) {
			if (!char) return;
			if (char === '/') {
				previousChar = '/';
				char = userCode[++i];
				return $ws;
			}
			if (char === '\\') ++i;
			char = userCode[++i];
		}
	};

	module.exports = exports = function (code, triggerChar, callback) {
		var state;

		userCode = String(value(code));
		userTriggerChar = String(value(triggerChar));
		if (userTriggerChar.length !== 1) {
			throw new TypeError(userTriggerChar + " should be one character long string");
		}
		userCallback = callable(callback);
		isUserTriggerOperatorChar = hasOwnProperty.call(nonNameSet, userTriggerChar);
		i = 0;
		char = userCode[i];
		line = 1;
		columnIndex = 0;
		afterWs = false;
		previousChar = null;
		nest = 0;
		nestedTokens = [];
		results = [];
		exports.forceStop = false;
		state = $ws;
		while (state) state = state();
		return results;
	};

	Object.defineProperties(exports, {
		$ws: d($ws),
		$common: d($common),
		collectNest: d(collectNest),
		move: d(move),
		index: d.gs(function () { return i; }),
		line: d.gs(function () { return line; }),
		nest: d.gs(function () { return nest; }),
		columnIndex: d.gs(function () { return columnIndex; }),
		next: d(function (step) {
			if (!char) return;
			move(i + (step || 1));
			return $ws();
		}),
		resume: d(function () { return $common; })
	});


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(5)()
		? Array.from
		: __webpack_require__(6);


/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
		var from = Array.from, arr, result;
		if (typeof from !== 'function') return false;
		arr = ['raz', 'dwa'];
		result = from(arr);
		return Boolean(result && (result !== arr) && (result[1] === 'dwa'));
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var iteratorSymbol = __webpack_require__(7).iterator
	  , isArguments    = __webpack_require__(25)
	  , isFunction     = __webpack_require__(26)
	  , toPosInt       = __webpack_require__(28)
	  , callable       = __webpack_require__(33)
	  , validValue     = __webpack_require__(17)
	  , isString       = __webpack_require__(34)

	  , isArray = Array.isArray, call = Function.prototype.call
	  , desc = { configurable: true, enumerable: true, writable: true, value: null }
	  , defineProperty = Object.defineProperty;

	module.exports = function (arrayLike/*, mapFn, thisArg*/) {
		var mapFn = arguments[1], thisArg = arguments[2], Constructor, i, j, arr, l, code, iterator
		  , result, getIterator, value;

		arrayLike = Object(validValue(arrayLike));

		if (mapFn != null) callable(mapFn);
		if (!this || (this === Array) || !isFunction(this)) {
			// Result: Plain array
			if (!mapFn) {
				if (isArguments(arrayLike)) {
					// Source: Arguments
					l = arrayLike.length;
					if (l !== 1) return Array.apply(null, arrayLike);
					arr = new Array(1);
					arr[0] = arrayLike[0];
					return arr;
				}
				if (isArray(arrayLike)) {
					// Source: Array
					arr = new Array(l = arrayLike.length);
					for (i = 0; i < l; ++i) arr[i] = arrayLike[i];
					return arr;
				}
			}
			arr = [];
		} else {
			// Result: Non plain array
			Constructor = this;
		}

		if (!isArray(arrayLike)) {
			if ((getIterator = arrayLike[iteratorSymbol]) !== undefined) {
				// Source: Iterator
				iterator = callable(getIterator).call(arrayLike);
				if (Constructor) arr = new Constructor();
				result = iterator.next();
				i = 0;
				while (!result.done) {
					value = mapFn ? call.call(mapFn, thisArg, result.value, i) : result.value;
					if (!Constructor) {
						arr[i] = value;
					} else {
						desc.value = value;
						defineProperty(arr, i, desc);
					}
					result = iterator.next();
					++i;
				}
				l = i;
			} else if (isString(arrayLike)) {
				// Source: String
				l = arrayLike.length;
				if (Constructor) arr = new Constructor();
				for (i = 0, j = 0; i < l; ++i) {
					value = arrayLike[i];
					if ((i + 1) < l) {
						code = value.charCodeAt(0);
						if ((code >= 0xD800) && (code <= 0xDBFF)) value += arrayLike[++i];
					}
					value = mapFn ? call.call(mapFn, thisArg, value, j) : value;
					if (!Constructor) {
						arr[j] = value;
					} else {
						desc.value = value;
						defineProperty(arr, j, desc);
					}
					++j;
				}
				l = j;
			}
		}
		if (l === undefined) {
			// Source: array or array-like
			l = toPosInt(arrayLike.length);
			if (Constructor) arr = new Constructor(l);
			for (i = 0; i < l; ++i) {
				value = mapFn ? call.call(mapFn, thisArg, arrayLike[i], i) : arrayLike[i];
				if (!Constructor) {
					arr[i] = value;
				} else {
					desc.value = value;
					defineProperty(arr, i, desc);
				}
			}
		}
		if (Constructor) {
			desc.value = null;
			arr.length = l;
		}
		return arr;
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(8)() ? Symbol : __webpack_require__(9);


/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	var validTypes = { object: true, symbol: true };

	module.exports = function () {
		var symbol;
		if (typeof Symbol !== 'function') return false;
		symbol = Symbol('test symbol');
		try { String(symbol); } catch (e) { return false; }

		// Return 'true' also for polyfills
		if (!validTypes[typeof Symbol.iterator]) return false;
		if (!validTypes[typeof Symbol.toPrimitive]) return false;
		if (!validTypes[typeof Symbol.toStringTag]) return false;

		return true;
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// ES2015 Symbol polyfill for environments that do not support it (or partially support it)

	'use strict';

	var d              = __webpack_require__(10)
	  , validateSymbol = __webpack_require__(23)

	  , create = Object.create, defineProperties = Object.defineProperties
	  , defineProperty = Object.defineProperty, objPrototype = Object.prototype
	  , NativeSymbol, SymbolPolyfill, HiddenSymbol, globalSymbols = create(null)
	  , isNativeSafe;

	if (typeof Symbol === 'function') {
		NativeSymbol = Symbol;
		try {
			String(NativeSymbol());
			isNativeSafe = true;
		} catch (ignore) {}
	}

	var generateName = (function () {
		var created = create(null);
		return function (desc) {
			var postfix = 0, name, ie11BugWorkaround;
			while (created[desc + (postfix || '')]) ++postfix;
			desc += (postfix || '');
			created[desc] = true;
			name = '@@' + desc;
			defineProperty(objPrototype, name, d.gs(null, function (value) {
				// For IE11 issue see:
				// https://connect.microsoft.com/IE/feedbackdetail/view/1928508/
				//    ie11-broken-getters-on-dom-objects
				// https://github.com/medikoo/es6-symbol/issues/12
				if (ie11BugWorkaround) return;
				ie11BugWorkaround = true;
				defineProperty(this, name, d(value));
				ie11BugWorkaround = false;
			}));
			return name;
		};
	}());

	// Internal constructor (not one exposed) for creating Symbol instances.
	// This one is used to ensure that `someSymbol instanceof Symbol` always return false
	HiddenSymbol = function Symbol(description) {
		if (this instanceof HiddenSymbol) throw new TypeError('TypeError: Symbol is not a constructor');
		return SymbolPolyfill(description);
	};

	// Exposed `Symbol` constructor
	// (returns instances of HiddenSymbol)
	module.exports = SymbolPolyfill = function Symbol(description) {
		var symbol;
		if (this instanceof Symbol) throw new TypeError('TypeError: Symbol is not a constructor');
		if (isNativeSafe) return NativeSymbol(description);
		symbol = create(HiddenSymbol.prototype);
		description = (description === undefined ? '' : String(description));
		return defineProperties(symbol, {
			__description__: d('', description),
			__name__: d('', generateName(description))
		});
	};
	defineProperties(SymbolPolyfill, {
		for: d(function (key) {
			if (globalSymbols[key]) return globalSymbols[key];
			return (globalSymbols[key] = SymbolPolyfill(String(key)));
		}),
		keyFor: d(function (s) {
			var key;
			validateSymbol(s);
			for (key in globalSymbols) if (globalSymbols[key] === s) return key;
		}),

		// If there's native implementation of given symbol, let's fallback to it
		// to ensure proper interoperability with other native functions e.g. Array.from
		hasInstance: d('', (NativeSymbol && NativeSymbol.hasInstance) || SymbolPolyfill('hasInstance')),
		isConcatSpreadable: d('', (NativeSymbol && NativeSymbol.isConcatSpreadable) ||
			SymbolPolyfill('isConcatSpreadable')),
		iterator: d('', (NativeSymbol && NativeSymbol.iterator) || SymbolPolyfill('iterator')),
		match: d('', (NativeSymbol && NativeSymbol.match) || SymbolPolyfill('match')),
		replace: d('', (NativeSymbol && NativeSymbol.replace) || SymbolPolyfill('replace')),
		search: d('', (NativeSymbol && NativeSymbol.search) || SymbolPolyfill('search')),
		species: d('', (NativeSymbol && NativeSymbol.species) || SymbolPolyfill('species')),
		split: d('', (NativeSymbol && NativeSymbol.split) || SymbolPolyfill('split')),
		toPrimitive: d('', (NativeSymbol && NativeSymbol.toPrimitive) || SymbolPolyfill('toPrimitive')),
		toStringTag: d('', (NativeSymbol && NativeSymbol.toStringTag) || SymbolPolyfill('toStringTag')),
		unscopables: d('', (NativeSymbol && NativeSymbol.unscopables) || SymbolPolyfill('unscopables'))
	});

	// Internal tweaks for real symbol producer
	defineProperties(HiddenSymbol.prototype, {
		constructor: d(SymbolPolyfill),
		toString: d('', function () { return this.__name__; })
	});

	// Proper implementation of methods exposed on Symbol.prototype
	// They won't be accessible on produced symbol instances as they derive from HiddenSymbol.prototype
	defineProperties(SymbolPolyfill.prototype, {
		toString: d(function () { return 'Symbol (' + validateSymbol(this).__description__ + ')'; }),
		valueOf: d(function () { return validateSymbol(this); })
	});
	defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toPrimitive, d('', function () {
		var symbol = validateSymbol(this);
		if (typeof symbol === 'symbol') return symbol;
		return symbol.toString();
	}));
	defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toStringTag, d('c', 'Symbol'));

	// Proper implementaton of toPrimitive and toStringTag for returned symbol instances
	defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toStringTag,
		d('c', SymbolPolyfill.prototype[SymbolPolyfill.toStringTag]));

	// Note: It's important to define `toPrimitive` as last one, as some implementations
	// implement `toPrimitive` natively without implementing `toStringTag` (or other specified symbols)
	// And that may invoke error in definition flow:
	// See: https://github.com/medikoo/es6-symbol/issues/13#issuecomment-164146149
	defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toPrimitive,
		d('c', SymbolPolyfill.prototype[SymbolPolyfill.toPrimitive]));


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var assign        = __webpack_require__(11)
	  , normalizeOpts = __webpack_require__(18)
	  , isCallable    = __webpack_require__(19)
	  , contains      = __webpack_require__(20)

	  , d;

	d = module.exports = function (dscr, value/*, options*/) {
		var c, e, w, options, desc;
		if ((arguments.length < 2) || (typeof dscr !== 'string')) {
			options = value;
			value = dscr;
			dscr = null;
		} else {
			options = arguments[2];
		}
		if (dscr == null) {
			c = w = true;
			e = false;
		} else {
			c = contains.call(dscr, 'c');
			e = contains.call(dscr, 'e');
			w = contains.call(dscr, 'w');
		}

		desc = { value: value, configurable: c, enumerable: e, writable: w };
		return !options ? desc : assign(normalizeOpts(options), desc);
	};

	d.gs = function (dscr, get, set/*, options*/) {
		var c, e, options, desc;
		if (typeof dscr !== 'string') {
			options = set;
			set = get;
			get = dscr;
			dscr = null;
		} else {
			options = arguments[3];
		}
		if (get == null) {
			get = undefined;
		} else if (!isCallable(get)) {
			options = get;
			get = set = undefined;
		} else if (set == null) {
			set = undefined;
		} else if (!isCallable(set)) {
			options = set;
			set = undefined;
		}
		if (dscr == null) {
			c = true;
			e = false;
		} else {
			c = contains.call(dscr, 'c');
			e = contains.call(dscr, 'e');
		}

		desc = { get: get, set: set, configurable: c, enumerable: e };
		return !options ? desc : assign(normalizeOpts(options), desc);
	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(12)()
		? Object.assign
		: __webpack_require__(13);


/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
		var assign = Object.assign, obj;
		if (typeof assign !== 'function') return false;
		obj = { foo: 'raz' };
		assign(obj, { bar: 'dwa' }, { trzy: 'trzy' });
		return (obj.foo + obj.bar + obj.trzy) === 'razdwatrzy';
	};


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var keys  = __webpack_require__(14)
	  , value = __webpack_require__(17)

	  , max = Math.max;

	module.exports = function (dest, src/*, …srcn*/) {
		var error, i, l = max(arguments.length, 2), assign;
		dest = Object(value(dest));
		assign = function (key) {
			try { dest[key] = src[key]; } catch (e) {
				if (!error) error = e;
			}
		};
		for (i = 1; i < l; ++i) {
			src = arguments[i];
			keys(src).forEach(assign);
		}
		if (error !== undefined) throw error;
		return dest;
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(15)()
		? Object.keys
		: __webpack_require__(16);


/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
		try {
			Object.keys('primitive');
			return true;
		} catch (e) { return false; }
	};


/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	var keys = Object.keys;

	module.exports = function (object) {
		return keys(object == null ? object : Object(object));
	};


/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (value) {
		if (value == null) throw new TypeError("Cannot use null or undefined");
		return value;
	};


/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';

	var forEach = Array.prototype.forEach, create = Object.create;

	var process = function (src, obj) {
		var key;
		for (key in src) obj[key] = src[key];
	};

	module.exports = function (options/*, …options*/) {
		var result = create(null);
		forEach.call(arguments, function (options) {
			if (options == null) return;
			process(Object(options), result);
		});
		return result;
	};


/***/ },
/* 19 */
/***/ function(module, exports) {

	// Deprecated

	'use strict';

	module.exports = function (obj) { return typeof obj === 'function'; };


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(21)()
		? String.prototype.contains
		: __webpack_require__(22);


/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';

	var str = 'razdwatrzy';

	module.exports = function () {
		if (typeof str.contains !== 'function') return false;
		return ((str.contains('dwa') === true) && (str.contains('foo') === false));
	};


/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';

	var indexOf = String.prototype.indexOf;

	module.exports = function (searchString/*, position*/) {
		return indexOf.call(this, searchString, arguments[1]) > -1;
	};


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isSymbol = __webpack_require__(24);

	module.exports = function (value) {
		if (!isSymbol(value)) throw new TypeError(value + " is not a symbol");
		return value;
	};


/***/ },
/* 24 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (x) {
		if (!x) return false;
		if (typeof x === 'symbol') return true;
		if (!x.constructor) return false;
		if (x.constructor.name !== 'Symbol') return false;
		return (x[x.constructor.toStringTag] === 'Symbol');
	};


/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict';

	var toString = Object.prototype.toString

	  , id = toString.call((function () { return arguments; }()));

	module.exports = function (x) { return (toString.call(x) === id); };


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toString = Object.prototype.toString

	  , id = toString.call(__webpack_require__(27));

	module.exports = function (f) {
		return (typeof f === "function") && (toString.call(f) === id);
	};


/***/ },
/* 27 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {};


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toInteger = __webpack_require__(29)

	  , max = Math.max;

	module.exports = function (value) { return max(0, toInteger(value)); };


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var sign = __webpack_require__(30)

	  , abs = Math.abs, floor = Math.floor;

	module.exports = function (value) {
		if (isNaN(value)) return 0;
		value = Number(value);
		if ((value === 0) || !isFinite(value)) return value;
		return sign(value) * floor(abs(value));
	};


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(31)()
		? Math.sign
		: __webpack_require__(32);


/***/ },
/* 31 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
		var sign = Math.sign;
		if (typeof sign !== 'function') return false;
		return ((sign(10) === 1) && (sign(-20) === -1));
	};


/***/ },
/* 32 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (value) {
		value = Number(value);
		if (isNaN(value) || (value === 0)) return value;
		return (value > 0) ? 1 : -1;
	};


/***/ },
/* 33 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (fn) {
		if (typeof fn !== 'function') throw new TypeError(fn + " is not a function");
		return fn;
	};


/***/ },
/* 34 */
/***/ function(module, exports) {

	'use strict';

	var toString = Object.prototype.toString

	  , id = toString.call('');

	module.exports = function (x) {
		return (typeof x === 'string') || (x && (typeof x === 'object') &&
			((x instanceof String) || (toString.call(x) === id))) || false;
	};


/***/ },
/* 35 */
/***/ function(module, exports) {

	'use strict';

	var forEach = Array.prototype.forEach, create = Object.create;

	module.exports = function (arg/*, …args*/) {
		var set = create(null);
		forEach.call(arguments, function (name) { set[name] = true; });
		return set;
	};


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var assign        = __webpack_require__(11)
	  , normalizeOpts = __webpack_require__(18)
	  , isCallable    = __webpack_require__(19)
	  , contains      = __webpack_require__(20)

	  , d;

	d = module.exports = function (dscr, value/*, options*/) {
		var c, e, w, options, desc;
		if ((arguments.length < 2) || (typeof dscr !== 'string')) {
			options = value;
			value = dscr;
			dscr = null;
		} else {
			options = arguments[2];
		}
		if (dscr == null) {
			c = w = true;
			e = false;
		} else {
			c = contains.call(dscr, 'c');
			e = contains.call(dscr, 'e');
			w = contains.call(dscr, 'w');
		}

		desc = { value: value, configurable: c, enumerable: e, writable: w };
		return !options ? desc : assign(normalizeOpts(options), desc);
	};

	d.gs = function (dscr, get, set/*, options*/) {
		var c, e, options, desc;
		if (typeof dscr !== 'string') {
			options = set;
			set = get;
			get = dscr;
			dscr = null;
		} else {
			options = arguments[3];
		}
		if (get == null) {
			get = undefined;
		} else if (!isCallable(get)) {
			options = get;
			get = set = undefined;
		} else if (set == null) {
			set = undefined;
		} else if (!isCallable(set)) {
			options = set;
			set = undefined;
		}
		if (dscr == null) {
			c = true;
			e = false;
		} else {
			c = contains.call(dscr, 'c');
			e = contains.call(dscr, 'e');
		}

		desc = { get: get, set: set, configurable: c, enumerable: e };
		return !options ? desc : assign(normalizeOpts(options), desc);
	};


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var from         = __webpack_require__(4)
	  , primitiveSet = __webpack_require__(35);

	module.exports = primitiveSet.apply(null, from('\n\r\u2028\u2029'));


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var primitiveSet = __webpack_require__(35)
	  , eol          = __webpack_require__(37)
	  , inline       = __webpack_require__(39);

	module.exports = primitiveSet.apply(null,
		Object.keys(eol).concat(Object.keys(inline)));


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var from         = __webpack_require__(4)
	  , primitiveSet = __webpack_require__(35);

	module.exports = primitiveSet.apply(null, from(' \f\t\v​\u00a0\u1680​\u180e' +
		'\u2000​\u2001\u2002​\u2003\u2004​\u2005\u2006​\u2007\u2008​\u2009\u200a' +
		'​​​\u202f\u205f​\u3000'));


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var resolve  = __webpack_require__(41)
	  , passthru = __webpack_require__(42);

	module.exports = function (data, context/*, options*/) {
		return passthru.apply(null, resolve(data, context, arguments[2]));
	};


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var value     = __webpack_require__(17)
	  , normalize = __webpack_require__(18)

	  , map = Array.prototype.map, keys = Object.keys
	  , stringify = JSON.stringify;

	module.exports = function (data, context/*, options*/) {
		var names, argNames, argValues, options = Object(arguments[2]);

		(value(data) && value(data.literals) && value(data.substitutions));
		context = normalize(context);
		names = keys(context);
		argNames = names.join(', ');
		argValues = names.map(function (name) { return context[name]; });
		return [data.literals].concat(map.call(data.substitutions, function (expr) {
			var resolver;
			if (!expr) return undefined;
			try {
				resolver = new Function(argNames, 'return (' + expr + ')');
			} catch (e) {
				throw new TypeError("Unable to compile expression:\n\targs: " + stringify(argNames) +
					"\n\tbody: " + stringify(expr) + "\n\terror: " + e.stack);
			}
			try {
				return resolver.apply(null, argValues);
			} catch (e) {
				if (options.partial) return '${' + expr + '}';
				throw new TypeError("Unable to resolve expression:\n\targs: " + stringify(argNames) +
					"\n\tbody: " + stringify(expr) + "\n\terror: " + e.stack);
			}
		}));
	};


/***/ },
/* 42 */
/***/ function(module, exports) {

	'use strict';

	var reduce = Array.prototype.reduce;

	module.exports = function (literals/*, …substitutions*/) {
		var args = arguments;
		return reduce.call(literals, function (a, b, i) {
			return a + ((args[i] === undefined) ? '' :  String(args[i])) + b;
		});
	};


/***/ }
/******/ ]);