/**
 * Attack an enemy.
 *
 * Depends on enemy system.
 */
AFRAME.registerComponent('attack-enemy', {
  schema: {
    fireRate: {default: 10},  // projectiles per second.
    projectileMixin: {default: ''},
  },

  init: function () {
    this.currentTarget = null;  // One target a time.
  },

  tick: function (t, dt) {
    var el = this.el;

    // Grab the closest enemy and target it.
    if (!this.currentTarget) {
      this.currentTarget = getClosestEnemy(el.sceneEl.systems.enemy.enemies,
                                           el.object3D.position.clone());
      this.el.setAttribute('label', 'Target: ' + this.currentTarget.id);
    }
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
