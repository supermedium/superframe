var templateString = require('es6-template-strings');

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
      templateData = extend(templateData, el.getAttribute(data.data));
    }

    var renderedTemplate = renderTemplate(templateCacheItem.template, templateCacheItem.type,
                                          templateData);
    el.insertAdjacentHTML(data.insert, renderedTemplate);
    el.emit('templaterendered');
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
