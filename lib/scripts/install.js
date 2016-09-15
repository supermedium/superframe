/*
  Install nested package.json directories.
*/
var childProcess = require('child_process');
var glob = require('glob');
var resolve = require('path').resolve;

glob.sync('components/*').forEach(function (componentPath) {
  // Install.
  var installPath = resolve(componentPath);
  console.log('npm installing', installPath);
  childProcess.spawn('npm', ['i'], {
    cwd: installPath,
    env: process.env,
    stdio: 'inherit'
  });
})
