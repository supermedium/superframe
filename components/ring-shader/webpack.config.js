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
  devServer: {
    contentBase: require('path').resolve(__dirname, './'),
    disableHostCheck: true
  },
  entry: './src/index.js',
  output: {
    path: __dirname,
    filename: process.env.NODE_ENV === 'production' ? 'dist/aframe-ring-shader.min.js' : 'dist/aframe-ring-shader.js',
    libraryTarget: 'umd'
  },
  plugins: PLUGINS,
  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel-loader'},
      {
        test: /\.glsl/,
        exclude: /(node_modules)/,
        loader: 'webpack-glsl-loader'
      }
    ]
  }
};
