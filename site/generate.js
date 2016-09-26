var cheerio = require('cheerio');
var glob = require('glob');
var fs = require('fs');
var nunjucks = require('nunjucks');
var path = require('path');

var GITHUB = 'https://github.com/ngokevin/kframe/tree/master/';

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
      fullRelativePath: examplePath.replace('/index.html', '/'),
      github: GITHUB + examplePath.replace('/index.html', '/'),
      relativePath: path.join('examples', examplePath.split('/')[3], '/'),
      image: image
    };
  });

  return {
    description: json['description'],
    github: GITHUB + componentPath + '/',
    name: componentPath.split('/')[1],
    relativePath: path.join(componentPath, '/'),
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

// Generate README.
var readme = nunjucks.render('README.md', ctx);
fs.writeFileSync('README.md', readme);

// Generate index.html.
var indexHtml = nunjucks.render('index.html', ctx);
fs.writeFileSync('index.html', indexHtml);

// Generate component pages.
components.forEach(function (component) {
  var exampleHtml = nunjucks.render('component.html', component);
  fs.writeFileSync(path.join(component.relativePath, 'index.html'), exampleHtml);
});

// Append GitHub corners to all pages.
glob.sync('components/*/examples/*/*.html').forEach(function (htmlPath) {
  var html = fs.readFileSync(htmlPath, 'utf-8');
  var githubCorner = nunjucks.render('github-corner.html', {
    url: GITHUB + htmlPath.replace(/index.html$/, '')
  });
  html = html.replace(/<!--githubcorner-->.*<!--endgithubcorner-->/, '');
  html = html.replace(/  <\/body>/, '\n' + githubCorner + '  </body>');
  fs.writeFileSync(htmlPath, html);
});
