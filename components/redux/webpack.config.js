var webpack = require('webpack');

var PLUGINS = [
  new webpack.DefinePlugin({
    'process.env': {'NODE_ENV': JSON.stringify('production')}
  })
];
if (process.env.NODE_ENV === 'production') {
  PLUGINS.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = {
  entry: 'index.js',
  plugins: PLUGINS
};
