// Karma configuration.
var webpackConfiguration = require('../webpack.config.js');

// karma-webpack defines its own entry and output.
delete webpackConfiguration.entry;
delete webpackConfiguration.output;
delete webpackConfiguration.devServer;
webpackConfiguration.mode = 'development';

module.exports = function (config) {
  config.set({
    basePath: '../',
    webpack: webpackConfiguration,
    browsers: ['Firefox', 'Chrome'],
    client: {
      captureConsole: true,
      mocha: {ui: 'tdd'}
    },
    envPreprocessor: ['TEST_ENV'],
    files: [
      // Define test files.
      {pattern: 'tests/**/*.test.js'},
      // Serve test assets.
      {pattern: 'tests/assets/**/*', included: false, served: true}
    ],
    frameworks: ['mocha', 'sinon-chai', 'chai-shallow-deep-equal', 'webpack'],
    preprocessors: {'tests/**/*.js': ['webpack', 'env']},
    reporters: ['mocha']
  });
};
