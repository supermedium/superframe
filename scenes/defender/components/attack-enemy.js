/**
 * Attack an enemy.
 *
 * Depends on enemy system.
 */
AFRAME.registerComponent('attack-enemy', {
  schema: {
    attackRadius: {default: 5},
    damage: {default: 1},
    fireRate: {default: 5},  // projectiles per second.
    projectileMixin: {default: ''}
  },

  init: function () {
    this.currentTarget = null;  // One target a time.
    this.time = 0;
  },

  tick: function (t, dt) {
    var el = this.el;

    // Maintain rate of fire.
    if ((t - this.time) / 1000 < (1 / this.data.fireRate)) { return; }
    this.time = t;

    // Grab the closest enemy and target it.
    if (!this.currentTarget) {
      this.currentTarget = getClosestEnemy(el.sceneEl.systems.enemy.enemies,
                                           el.object3D.position.clone());
      this.el.setAttribute('label__target', {text: 'Target: ' + this.currentTarget.id});
    }

    // Attack enemy.
    this.currentTarget.components.enemy.applyDamage(this.data.damage);
  }
});

/**
 * Get closest enemy via position distance.
 *
 * @param {array} enemies - From enemy system.
 * @param {object} position - three.js Object3D.
 */
function getClosestEnemy (enemies, position) {
  var closestDistance = Infinity;
  var closestEnemy;

  enemies.forEach(function (enemy) {
    var enemyPosition = enemy.getComputedAttribute('position');
    var betweenVec3 = position.sub(enemyPosition);
    var enemyDistance = betweenVec3.length();
    if (enemyDistance < closestDistance) {
      closestDistance = enemyDistance;
      closestEnemy = enemy;
    }
  });

  return closestEnemy;
}
