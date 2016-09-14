'use strict';
module.exports = function (config) {
  config.set({
    basePath: '../',
    browserify: {
      paths: ['./']
    },
    browsers: ['firefox_latest'],
    customLaunchers: {
      firefox_latest: {
        base: 'FirefoxNightly',
        prefs: { /* empty */ }
      }
    },
    client: {
      captureConsole: true,
      mocha: {ui: 'bdd'}
    },
    envPreprocessor: [
      'TEST_ENV'
    ],
    files: [
      'tests/**/*.test.js',
    ],
    frameworks: ['mocha', 'sinon-chai', 'chai-shallow-deep-equal', 'browserify'],
    preprocessors: {
      'tests/**/*.js': ['browserify']
    },
    reporters: ['mocha']
  });
};
