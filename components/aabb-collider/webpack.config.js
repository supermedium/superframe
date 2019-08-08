var webpack = require('webpack');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var PLUGINS = [
  new webpack.DefinePlugin({
    'process.env': {'NODE_ENV': JSON.stringify('production')}
  })
];
if (process.env.NODE_ENV === 'production') {
  PLUGINS.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = {
  entry: './index.js',
  output: {
    path: __dirname + '/dist',
    filename: process.env.NODE_ENV === 'production' ? 'aframe-aabb-collider-component.min.js' : 'aframe-aabb-collider-component.js',
    libraryTarget: 'umd'
  },
  plugins: PLUGINS,
  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel-loader'}
    ]
  }
};
