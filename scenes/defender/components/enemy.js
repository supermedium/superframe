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
  schema: {
    hp: {default: 100}
  },

  init: function () {
    // Add enemy.
    var id = this.system.addEnemy(this.el);

    // Set ID and label.
    var name = 'Enemy ' + id;
    this.el.setAttribute('id', name);
    this.el.setAttribute('label__name', {text: name});
    this.updateHPLabel();
  },

  /**
   * Apply damage to HP.
   */
  applyDamage: function (damage) {
    var el = this.el;

    // Update HP.
    var newHP = Math.max(this.data.hp - damage, 0);
    el.setAttribute('enemy', 'hp', newHP);

    this.updateHPLabel();

    // Check for death.
    if (newHP <= 0) { el.emit('enemyDead'); }
  },

  /**
   * Update HP label using HP data.
   */
  updateHPLabel: function () {
    this.el.setAttribute('label__hp', {text: 'HP ' + this.data.hp, level: 2});
  }
});
