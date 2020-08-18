// Pre-compiled functions.
const selectFunctions = {};

/**
 * Select value from store. Handles boolean operations, calls `selectProperty`.
 *
 * @param {object} state - State object.
 * @param {string} selector - Dot-delimited store keys (e.g., game.player.health).
 * @param {object} item - From bind-item.
 */
function select (state, selector, item) {
  if (!selectFunctions[selector]) {
    selectFunctions[selector] = new Function('state', 'item',
                                             `return ${generateExpression(selector)};`);
  }
  return selectFunctions[selector](state, item);
}
module.exports.select = select;

const DOT_NOTATION_RE = /\.([A-Za-z][\w_-]*)/g;
const WHITESPACE_RE = /\s/g;
const STATE_SELECTOR_RE = /([=&|!?:+-])(\s*)([\(]?)([A-Za-z][\w_-]*)/g;
const ROOT_STATE_SELECTOR_RE = /^([\(]?)([A-Za-z][\w_-]*)/g;
const ITEM_RE = /state\["item"\]/g;
const BOOLEAN_RE = /state\["(true|false)"\]/g;
const STATE_STR = 'state';
function generateExpression (str) {
  str = str.replace(DOT_NOTATION_RE, '["$1"]');
  str = str.replace(ROOT_STATE_SELECTOR_RE, '$1state["$2"]');
  str = str.replace(STATE_SELECTOR_RE, '$1$2$3state["$4"]');
  str = str.replace(ITEM_RE, 'item');
  str = str.replace(BOOLEAN_RE, '$1');
  return str;
}
module.exports.generateExpression = generateExpression;

function clearObject (obj) { for (var key in obj) { delete obj[key]; } }
module.exports.clearObject = clearObject;

/**
 * Helper to compose object of handlers, merging functions handling same action.
 */
function composeHandlers () {
  var actionName;
  var i;
  var inputHandlers = arguments;
  var outputHandlers;

  outputHandlers = {};
  for (i = 0; i < inputHandlers.length; i++) {
    for (actionName in inputHandlers[i]) {
      if (actionName in outputHandlers) {
        // Initial compose/merge functions into arrays.
        if (outputHandlers[actionName].constructor === Array) {
          outputHandlers[actionName].push(inputHandlers[i][actionName]);
        } else {
          outputHandlers[actionName] = [outputHandlers[actionName],
                                        inputHandlers[i][actionName]];
        }
      } else {
        outputHandlers[actionName] = inputHandlers[i][actionName];
      }
    }
  }

  // Compose functions specified via array.
  for (actionName in outputHandlers) {
    if (outputHandlers[actionName].constructor === Array) {
      outputHandlers[actionName] = composeFunctions.apply(this, outputHandlers[actionName])
    }
  }

  return outputHandlers;
}
module.exports.composeHandlers = composeHandlers;

function composeFunctions () {
  var functions = arguments;
  return function () {
    var i;
    for (i = 0; i < functions.length; i++) {
      functions[i].apply(this, arguments);
    }
  }
}
module.exports.composeFunctions = composeFunctions;

var NO_WATCH_TOKENS = ['||', '&&', '!=', '!==', '==', '===', '>', '<', '<=', '>='];
var WHITESPACE_PLUS_RE = /\s+/;
var SYMBOLS = /\(|\)|\!/g;
function parseKeysToWatch (keys, str, isBindItem) {
  var i;
  var tokens;
  tokens = split(str, WHITESPACE_PLUS_RE);
  for (i = 0; i < tokens.length; i++) {
    if (NO_WATCH_TOKENS.indexOf(tokens[i]) === -1 && !tokens[i].startsWith("'") &&
        keys.indexOf(tokens[i]) === -1) {
      if (isBindItem && tokens[i] === 'item') { continue; }
      keys.push(parseKeyToWatch(tokens[i]).replace(SYMBOLS, ''));
    }
  }
  return keys;
}
module.exports.parseKeysToWatch = parseKeysToWatch;

function parseKeyToWatch (str) {
  var dotIndex;
  str = stripNot(str.trim());
  dotIndex = str.indexOf('.');
  if (dotIndex === -1) { return str; }
  return str.substring(0, str.indexOf('.'));
}

function stripNot (str) {
 if (str.indexOf('!!') === 0) {
    return str.replace('!!', '');
  } else if (str.indexOf('!') === 0) {
    return str.replace('!', '');
  }
  return str;
}

/**
 * Cached split.
 */
var SPLIT_CACHE = {};
function split (str, delimiter) {
  if (!SPLIT_CACHE[delimiter]) { SPLIT_CACHE[delimiter] = {}; }
  if (SPLIT_CACHE[delimiter][str]) { return SPLIT_CACHE[delimiter][str]; }
  SPLIT_CACHE[delimiter][str] = str.split(delimiter);
  return SPLIT_CACHE[delimiter][str];
}
module.exports.split = split;

function copyArray (dest, src) {
  var i;
  dest.length = 0;
  for (i = 0 ; i < src.length; i++) {
    dest[i] = src[i];
  }
}
module.exports.copyArray = copyArray;
