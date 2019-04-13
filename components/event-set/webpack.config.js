var webpack = require('webpack');

var PLUGINS = [
  new webpack.DefinePlugin({
    'process.env': {'NODE_ENV': JSON.stringify('production')}
  })
];

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devServer: {
    disableHostCheck: true,
    hotOnly: true
  },
  devtool: 'false',
  entry: './index.js',
  optimization: {
    minimize: process.env.NODE_ENV === 'production'
  },
  output: {
    path: __dirname + '/dist',
    filename: process.env.NODE_ENV === 'production' ?
      'aframe-event-set-component.min.js' :
      'aframe-event-set-component.js',
    libraryTarget: 'umd'
  },
  plugins: PLUGINS,
  module: {
    rules: [
      {test: /\.js$/, loader: 'babel-loader'}
    ]
  }
};
