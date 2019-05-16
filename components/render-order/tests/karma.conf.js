// Karma configuration.
module.exports = function (config) {
  config.set({
    basePath: '../',
    browserify: {
      debug: true,
      paths: ['./']
    },
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
    frameworks: ['mocha', 'sinon-chai', 'chai-shallow-deep-equal', 'browserify'],
    preprocessors: {'tests/**/*.js': ['browserify', 'env']},
    reporters: ['mocha']
  });
};
