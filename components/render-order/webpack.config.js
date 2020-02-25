const path = require('path');

const PLUGINS = [];

module.exports = {
  devServer: {
    disableHostCheck: true
  },
  entry: './index.js',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  output: {
    globalObject: 'this',
    path: path.join(__dirname, '/dist'),
    filename: process.env.NODE_ENV === 'production' ? 'aframe-render-order-component.min.js' : 'aframe-render-order-component.js',
    libraryTarget: 'umd'
  },
  plugins: PLUGINS,
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /(node_modules)/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    modules: [path.join(__dirname, 'node_modules')]
  }
};
