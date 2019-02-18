const fs = require('fs');
const glob = require('glob');

const aframeVersion = '0.9.0';

glob.sync('components/*/README.md').forEach(readmePath => {
  const packagePath = readmePath.replace(/README.md/, 'package.json');

  if (!fs.existsSync(`./${packagePath}`)) { return; }

  const json = require(`../${packagePath}`);
  const name = json.name;
  const version = json.version;

  let readme = fs.readFileSync(`./${readmePath}`, 'utf-8');
  readme = readme.replace(new RegExp(`${name}@.*\/dist`, 'g'), `${name}@${version}/dist`);
  readme = readme.replace(/releases\/.*\/aframe/g, `releases/${aframeVersion}/aframe`);

  fs.writeFileSync(`./${readmePath}`, readme);
});
