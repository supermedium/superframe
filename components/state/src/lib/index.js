var AND = '&&';
var QUOTE_RE = /'/g;
var OR = '||';
var COMPARISONS = ['==', '===', '!=', '!=='];
var tempTokenArray = [];
var tokenArray = [];

/**
 * Select value from store. Handles boolean operations, calls `selectProperty`.
 *
 * @param {object} state - State object.
 * @param {string} selector - Dot-delimited store keys (e.g., game.player.health).
 */
function select (state, selector, bindFor, bindForKey) {
  var comparisonResult;
  var firstValue;
  var i;
  var runningBool;
  var secondValue;
  var tokens;
  var value;

  // If just single selector, then grab value.
  tokens = split(selector, /\s+/);
  if (tokens.length === 1) { return selectProperty(state, selector, bindFor, bindForKey); }

  // Evaluate comparisons.
  tokenArray.length = 0;
  copyArray(tempTokenArray, tokens);
  for (i = 0; i < tempTokenArray.length; i++) {
    if (COMPARISONS.indexOf(tempTokenArray[i]) === -1) {
      tokenArray.push(tempTokenArray[i]);
      continue;
    }

    // Comparison (color === 'red').
    // Pop previous value since that is one of comparsion value.
    firstValue = selectProperty(state, tokenArray.pop());
    // Lookup second value.
    secondValue = tempTokenArray[i + 1].replace(QUOTE_RE, '');
    // Evaluate (equals or not equals).
    firstValue = firstValue === undefined ? 'undefined' : firstValue.toString()
    secondValue = secondValue === undefined ? 'undefined' : secondValue.toString()
    comparisonResult = tempTokenArray[i].indexOf('!') === -1
      ? firstValue === secondValue
      : firstValue !== secondValue;
    tokenArray.push(comparisonResult);
    i++;
  }

  // Was single comparison.
  if (tokenArray.length === 1) { return tokenArray[0]; }

  // If has boolean expression, evaluate.
  runningBool = tokenArray[0].constructor === Boolean
    ? tokenArray[0]
    : selectProperty(state, tokenArray[0], bindFor, bindForKey);
  for (i = 1; i < tokenArray.length; i += 2) {
    if (tokenArray[i] !== OR && tokenArray[i] !== AND) { continue; }
    // Check if was evaluated comparison (bool) or a selector (string).
    tokenArray[i + 1] = tokenArray[i + 1].constructor === Boolean
      ? tokenArray[i + 1]
      : selectProperty(state, tokenArray[i + 1]);

    // Evaluate boolean.
    if (tokenArray[i] === OR) {
      runningBool = runningBool || tokenArray[i + 1];
    } else if (tokenArray[i] === AND) {
      runningBool = runningBool && tokenArray[i + 1];
    }
  }
  return runningBool;
}
module.exports.select = select;

/**
 * Does actual selecting and walking of state.
 */
function selectProperty (state, selector, bindFor, bindForKey) {
  var i;
  var originalSelector;
  var splitted;
  var value;

  // If bindFor, select the array. Then later, we filter the array.
  if (bindFor && selector.startsWith(bindFor.for)) {
    originalSelector = selector;
    selector = bindFor.in;
  }

  // Walk.
  value = state;
  splitted = split(stripNot(selector), '.');
  for (i = 0; i < splitted.length; i++) {
    if (i < splitted.length - 1 && !(splitted[i] in value)) {
      console.error('[state] Not found:', splitted, splitted[i]);
    }
    value = value[splitted[i]];
  }

  if (bindFor && originalSelector.startsWith(bindFor.for)) {
    // Simple array.
    if (!bindFor.key) { return value[bindForKey]; }
    // Array of objects.
    for (i = 0; i < value.length; i++) {
      if (value[i][bindFor.key] !== bindForKey) { continue; }
      value = selectProperty(value[i], originalSelector.replace(`${bindFor.for}.`, ''));
      break;
    }
  }

  // Boolean.
  if (selector[0] === '!' && selector[1] === '!') { return !!value; }
  if (selector[0] === '!') { return !value; }
  return value;
}
module.exports.selectProperty = selectProperty;

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

var NO_WATCH_TOKENS = ['||', '&&', '!=', '!==', '==', '==='];
function parseKeysToWatch (keys, str, isBindItem) {
  var i;
  var tokens;
  tokens = str.split(/\s+/);
  for (i = 0; i < tokens.length; i++) {
    if (NO_WATCH_TOKENS.indexOf(tokens[i]) === -1 && !tokens[i].startsWith("'") &&
        keys.indexOf(tokens[i]) === -1) {
      if (isBindItem && tokens[i] === 'item') { continue; }
      keys.push(parseKeyToWatch(tokens[i]));
    }
  }
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
