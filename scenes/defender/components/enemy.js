/**
 * Keep track of enemies.
 */
AFRAME.registerSystem('enemy', {
  init: function () {
    this.enemies = [];
    this.id = 0;
  },

  addEnemy: function (enemy) {
    this.enemies.push(enemy);
    return this.id++;
  }
});

/**
 * General enemy class.
 */
AFRAME.registerComponent('enemy', {
  init: function () {
    // Add enemy.
    var id = this.system.addEnemy(this.el);

    // Set ID and label.
    var name = 'Enemy ' + id;
    this.el.setAttribute('id', name);
    this.el.setAttribute('label', name);
  }
});
