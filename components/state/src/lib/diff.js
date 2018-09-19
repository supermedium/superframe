/**
 * Computes the difference between two objects with ability to ignore keys.
 *
 * @param {object} a - First object to compare (e.g., oldData).
 * @param {object} b - Second object to compare (e.g., newData).
 * @returns {object}
 *   Difference object where set of keys note which values were not equal, and values are
 *   `b`'s values.
 */
module.exports = (function () {
  var keys = [];

  return function (a, b, targetObject, ignoreKeys) {
    var aVal;
    var bVal;
    var bKey;
    var diff;
    var key;
    var i;
    var isComparingObjects;

    diff = targetObject || {};

    // Collect A keys.
    keys.length = 0;
    for (key in a) { keys.push(key); }

    if (!b) { return diff; }

    // Collect B keys.
    for (bKey in b) {
      if (keys.indexOf(bKey) === -1) {
        keys.push(bKey);
      }
    }

    for (i = 0; i < keys.length; i++) {
      key = keys[i];

      // Ignore specified keys.
      if (ignoreKeys && ignoreKeys.indexOf(key) !== -1) { continue; }

      aVal = a[key];
      bVal = b[key];
      isComparingObjects = aVal && bVal &&
                          aVal.constructor === Object && bVal.constructor === Object;
      if ((isComparingObjects && !AFRAME.utils.deepEqual(aVal, bVal)) ||
          (!isComparingObjects && aVal !== bVal)) {
        diff[key] = bVal;
      }
    }
    return diff;
  };
})();
