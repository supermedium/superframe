var LINKS = [
  {href: '?env=arches', image: '#arches', title: 'Arches'},
  {href: '?env=checkboard', image: '#checkerboard', title: 'Checkerboard'},
  {href: '?env=egypt', image: '#egypt', title: 'Egypt'},
  {href: '?env=forest', image: '#forest', title: 'Forest'},
  {href: '?env=goaland', image: '#goaland', title: 'Goaland'},
  {href: '?env=goldmine', image: '#goldmine', title: 'Goldmine'},
  {href: '?env=japan', image: '#japan', title: 'Japan'},
  {href: '?env=poison', image: '#poison', title: 'Poison'},
  {href: '?env=threetowers', image: '#threetowers', title: 'Three Towers'},
  {href: '?env=tron', image: '#tron', title: 'Tron'},
  {href: '?env=yavapai', image: '#yavapai', title: 'Yavapai'},
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
