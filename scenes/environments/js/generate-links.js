var LINKS = [
  {href: '?env=arches', image: 'img/arches.png', title: 'Arches'},
  {href: '?env=checkboard', image: 'img/checkerboard.png', title: 'Checkerboard'},
  {href: '?env=egypt', image: 'img/egypt.png', title: 'Egypt'},
  {href: '?env=forest', image: 'img/forest.png', title: 'Forest'},
  {href: '?env=goaland', image: 'img/goaland.png', title: 'Goaland'},
  {href: '?env=goldmine', image: 'img/goldmine.png', title: 'Goldmine'},
  {href: '?env=japan', image: 'img/japan.png', title: 'Japan'},
  {href: '?env=poison', image: 'img/poison.png', title: 'Poison'},
  {href: '?env=threetowers', image: 'img/threetowers.png', title: 'Three Towers'},
  {href: '?env=tron', image: 'img/tron.png', title: 'Tron'},
  {href: '?env=yavapai', image: 'img/yavapai.png', title: 'Yavapai'},
];

AFRAME.registerComponent('generate-links', {
  init: function () {
    LINKS.forEach(link => {
      var linkEl;

      // Current page.
      if (window.location.search.indexOf(link.href.substring(1)) !== -1) { return; }

      linkEl = document.createElement('a-entity');
      linkEl.setAttribute('look-at', 'a-camera');
      linkEl.setAttribute('link', {
        href: link.href,
        src: link.image,
        title: link.title
      });
      linkEl.setAttribute('scale', {x: 0.5, y: 0.5, z: 1});
      this.el.appendChild(linkEl);
    });
  }
});
