AFRAME.registerComponent('html-exporter', {
  init: function () {
    window.addEventListener('keydown', this.onKeyDown.bind(this));
  },

  exportHTML: function () {
    var sceneEl = this.el;
    var html = buildHTML(sceneEl.getAttribute('gamestate').entities);
    this.saveFile(html);
  },

  saveFile: function (html) {
    var blob = new Blob([html], {type: 'text/plain'});
    var url = URL.createObjectURL(blob);
    var aEl = document.createElement('a');
    aEl.href = url;
    aEl.setAttribute('download', 'aframescene.html');
    aEl.innerHTML = 'Downloading...';
    aEl.style.display = 'none';
    document.body.appendChild(aEl);
    setTimeout(function () {
      aEl.click();
      document.body.removeChild(aEl);
    }, 1);
  },

  /**
   * Keyboard shortcut.
   */
  onKeyDown: function (evt) {
    // <e> for Export.
    if (evt.keyCode !== 69) { return; }
    this.exportHTML();
  }
});

function buildHTML (entityGroups) {
  var html = [
    '<html>',
    '  <head>',
    '    <script src="https://aframe.io/releases/0.5.0/aframe.min.js"></script>',
    '  </head>',
    '  <body>',
    '    <a-scene>',
  ];

  console.log(entityGroups);

  entityGroups.forEach(function (entityGroup) {
    entityGroup.forEach(function (entity) {
      html.push(
        `        <a-entity geometry="${AFRAME.utils.styleParser.stringify(entity.geometry)}" material="${AFRAME.utils.styleParser.stringify(entity.material)}" position="${AFRAME.utils.coordinates.stringify(entity.position)}" rotation="${AFRAME.utils.coordinates.stringify(entity.rotation)}" scale="${AFRAME.utils.coordinates.stringify(entity.scale)}"></a-entity>`
      );
    });
  });

  html.push('    </a-scene>');
  html.push('  </body>');
  html.push('</html>');
  return html.join('\n');
}
