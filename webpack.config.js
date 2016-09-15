var glob = require('glob');
var join = require('path').join;

var ENTRY = {};
var RESOLVE_ROOT = [__dirname];
glob.sync('components/*').forEach(function (componentPath) {
  // Output to components/X/examples/build.js while watching components/X/examples/main.js.
  ENTRY[join(componentPath, 'examples')] = join(__dirname, componentPath, 'examples', 'main.js');

  // Add local node_modules/ directories.
  RESOLVE_ROOT.push(join(componentPath));
});

module.exports = {
  entry: ENTRY,
  output: {
    path: __dirname,
    filename: '[name]/build.js'
  },
  resolve: {
    root: RESOLVE_ROOT
  }
};
