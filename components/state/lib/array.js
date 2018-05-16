var fns = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice'
];

function wrapArray (arr) {
  var i;
  if (arr.__wrapped) { return; }
  for (i = 0; i < fns.length; i++) {
    makeCallDirty(arr, fns[i]);
  }
  arr.__wrapped = true;
}
module.exports.wrapArray = wrapArray;

function makeCallDirty (arr, fn) {
  var originalFn = arr[fn];
  arr[fn] = function () {
    originalFn.apply(arr, arguments);
    arr.__dirty = true;
  };
}
