var cheerio = require('cheerio');
var glob = require('glob');
var fs = require('fs');
var nunjucks = require('nunjucks');
var path = require('path');

var GITHUB = 'https://github.com/ngokevin/kframe/tree/master/';
var RAW_GITHUB = 'https://raw.githubusercontent.com/ngokevin/kframe/master/';

nunjucks.configure('site/templates');

// Get component data.
var components = glob.sync('components/*').map(function (componentPath) {
  if (!fs.existsSync(path.join(componentPath, 'package.json'))) { return; }

  // Get component metadata.
  var json = require('../' + path.join(componentPath, 'package.json'));

  // Get examples.
  var examples = glob.sync(path.join(componentPath, 'examples/*/index.html'));
  examples = examples.map(function (exampleHTMLPath) {
    var examplePath = exampleHTMLPath.replace('/index.html', '/');
    var html = fs.readFileSync(exampleHTMLPath, 'utf-8');
    var $ = cheerio.load(html);

    // Preview image.
    var image = null;
    if (fs.existsSync(path.join(examplePath, 'preview.png'))) {
      image = path.join(examplePath, 'preview.png');
      image = image.split('/').splice(-3).join('/');
    } else if (fs.existsSync(path.join(examplePath, 'preview.jpg'))) {
      image = path.join(examplePath, 'preview.jpg');
      image = image.split('/').splice(-3).join('/');
    } else if (fs.existsSync(path.join(examplePath, 'preview.gif'))) {
      image = path.join(examplePath, 'preview.gif');
      image = image.split('/').splice(-3).join('/');
    }

    // Metadata.
    return {
      title: $('title').text(),
      description: $('meta[name="description"]').attr('content'),
      fullRelativePath: exampleHTMLPath,
      github: GITHUB + examplePath,
      relativePath: path.join('examples', exampleHTMLPath.split('/')[3], '/'),
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
}).filter(component => component);

// Final templating context.
var ctx = {components: components};

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
  var githubCorner = nunjucks.render('github-corner-scene.html', {
    github: GITHUB + htmlPath.replace(/index.html$/, '')
  });
  html = html.replace(/<\/a-scene>((.|[\r\n])*)<!--endgithubcorner-->/, '</a-scene>');
  html = html.replace(/  <\/body>/, '\n' + githubCorner + '  </body>');
  fs.writeFileSync(htmlPath, html);
});

// Generate preview meta tags.
glob.sync('components/*/examples/*/*.html').forEach(function (htmlPath) {
  var html = fs.readFileSync(htmlPath, 'utf-8');
  var examplePath = htmlPath.replace('index.html', '');

  var image;
  if (fs.existsSync(path.join(examplePath, 'preview.png'))) {
    image = 'preview.png';
  } else if (fs.existsSync(path.join(examplePath, 'preview.jpg'))) {
    image = 'preview.jpg';
  } else if (fs.existsSync(path.join(examplePath, 'preview.gif'))) {
    image = 'preview.gif';
  }
  if (!image) { return; }
  image = RAW_GITHUB + examplePath + image;

  var meta = '<meta property="og:image" content="' + image + '"></meta>\n';
  html = html.replace(/<meta property="og:image".*?<\/meta>\n    /, '');
  html = html.replace(/<script/, meta + '    <script');
  fs.writeFileSync(htmlPath, html);
});
