var cheerio = require('cheerio');
var glob = require('glob');
var fs = require('fs');
var nunjucks = require('nunjucks');
var path = require('path');

var GITHUB = 'https://github.com/ngokevin/kframe/tree/master';

nunjucks.configure('site/templates');

// Get component data.
var components = glob.sync('components/*').map(function (componentPath) {
  // Get component metadata.
  var json = require(path.join(componentPath, 'package.json'));

  // Get examples.
  var examples = glob.sync(path.join(componentPath, 'examples/*/index.html'));
  examples = examples.map(function (examplePath) {
    var html = fs.readFileSync(examplePath, 'utf-8');
    var $ = cheerio.load(html);

    // Preview image.
    var image = null;
    if (fs.existsSync(path.join(examplePath, 'preview.png'))) {
      image = path.join(examplePath, 'preview.png');
    } else if (fs.existsSync(path.join(examplePath, 'preview.gif'))) {
      image = path.join(examplePath, 'preview.gif');
    }

    // Metadata.
    return {
      title: $('title').text(),
      description: $('meta[name="description"]').attr('content'),
      github: path.join(GITHUB, examplePath),
      path: examplePath.replace('/index.html', '/'),
      image: image
    };
  });

  return {
    description: json['description'],
    github: path.join(GITHUB, componentPath, '/'),
    name: componentPath.split('/')[1],
    examples: examples
  };
});

// Get bundled components.
var indexJs = fs.readFileSync('index.js', 'utf-8');
var regex = /components\/(.*)\//g;
var bundled = [];
while (match = regex.exec(indexJs)) {
  bundled.push(match[1]);
};

// Final templating context.
var ctx = {
  bundled: bundled,
  components: components
};

// Copy README.
var readme = nunjucks.render('README.md', ctx);
fs.writeFileSync('README.md', readme);
