var CoffeePhysics, Colors, Prompt, Sleep, World, init;

Prompt = require('prompt');

Colors = require('colors');

Sleep = require('sleep');

CoffeePhysics = require('./physics.js');

init = function() {
  var world;
  world = new World();
  world.setParticleCount(10);
  return world.setupWorld();
};

World = (function() {
  function World() {
    this.colSize = 75;
    this.rowSize = 50;
    this.particleCount = 10;
  }

  World.prototype.setParticleCount = function(count) {
    return this.particleCount = count;
  };

  World.prototype.setupWorld = function() {
    var i, particle, position, _i, _ref;
    this.physics = new CoffeePhysics.Physics();
    this.physics.integrator = new CoffeePhysics.Verlet();
    this.pullToTop = new CoffeePhysics.Attraction();
    this.pullToBottom = new CoffeePhysics.Attraction();
    this.edgeBounce = new CoffeePhysics.EdgeBounce(new CoffeePhysics.Vector(0, 0), new CoffeePhysics.Vector(this.colSize, this.rowSize));
    this.collision = new CoffeePhysics.Collision();
    for (i = _i = 0, _ref = this.particleCount - 1; _i <= _ref; i = _i += 1) {
      particle = new CoffeePhysics.Particle(Math.random());
      position = new CoffeePhysics.Vector(5 + i, 5 * i);
      particle.setMass(1);
      particle.setRadius(1);
      particle.moveTo(position);
      this.collision.pool.push(particle);
      particle.behaviours.push(this.pullToTop, this.pullToBottom, this.collision, this.edgeBounce);
      this.physics.particles.push(particle);
    }
    this.pullToBottom.target.x = this.colSize / 2;
    this.pullToBottom.target.y = this.rowSize * (1 / 4);
    this.pullToBottom.strength = 10;
    this.pullToTop.target.x = this.colSize / 2;
    this.pullToTop.target.y = this.rowSize * (3 / 4);
    this.pullToTop.strength = 10;
    return this.drawWorld();
  };

  World.prototype.drawWorld = function() {
    var i, j, particle, self, _i, _j, _k, _len, _ref, _ref1, _ref2;
    this.physics.step();
    process.stdout.write('\u001B[2J\u001B[0;0f');
    for (i = _i = 0, _ref = this.rowSize - 1; _i <= _ref; i = _i += 1) {
      this.string = '';
      for (j = _j = 0, _ref1 = this.colSize - 1; _j <= _ref1; j = _j += 1) {
        _ref2 = this.physics.particles;
        for (_k = 0, _len = _ref2.length; _k < _len; _k++) {
          particle = _ref2[_k];
          if (Math.round(particle.pos.x) === j && Math.round(particle.pos.y) === i) {
            this.string += 'o';
          }
        }
        if (j === 0 || j === this.colSize - 1) {
          this.string += '|';
        } else if (i === 0 || i === this.rowSize - 1) {
          this.string += '_';
        } else {
          this.string += ' ';
        }
      }
      console.log(this.string);
    }
    Sleep.usleep(10000);
    self = this;
    return setTimeout(function() {
      return self.drawWorld();
    }, 0);
  };

  return World;

})();

init();
