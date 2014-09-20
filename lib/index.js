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
    console.log('constructor');
    this.colSize = 75;
    this.rowsize = 50;
    this.particleCount = 10;
  }

  World.prototype.setParticleCount = function(count) {
    console.log('setParticleCount');
    return this.particleCount = count;
  };

  World.prototype.setupWorld = function() {
    var i, particle, position;
    console.log('setupWorld');
    this.physics = new CoffeePhysics.Physics();
    this.physics.integrator = new CoffeePhysics.Verlet();
    this.pullToTop = new CoffeePhysics.Attraction();
    this.pullToBottom = new CoffeePhysics.Attraction();
    this.edgeBounce = new CoffeePhysics.EdgeBounce(new CoffeePhysics.Vector(0, 0), new CoffeePhysics.Vector(this.colSize, this.rowsize));
    this.collision = new CoffeePhysics.Collision();
    i = 0;
    while (i < this.particleCount) {
      particle = new CoffeePhysics.Particle(Math.random());
      position = new CoffeePhysics.Vector(5 + i, 5 * i);
      particle.setMass(1);
      particle.setRadius(1);
      particle.moveTo(position);
      this.collision.pool.push(particle);
      particle.behaviours.push(this.pullToTop, this.pullToBottom, this.collision, this.edgeBounce);
      this.physics.particles.push(particle);
      i++;
    }
    this.pullToBottom.target.x = this.colSize / 2;
    this.pullToBottom.target.y = this.rowsize * (1 / 4);
    this.pullToBottom.strength = 10;
    this.pullToTop.target.x = this.colSize / 2;
    this.pullToTop.target.y = this.rowsize * (3 / 4);
    this.pullToTop.strength = 10;
    console.log('about to drawWorld');
    return this.drawWorld();
  };

  World.prototype.drawWorld = function() {
    var i, j, particle, self, _i, _len, _ref;
    console.log('drawWorld');
    this.physics.step();
    process.stdout.write('\u001B[2J\u001B[0;0f');
    i = 0;
    while (i < this.rowsize) {
      this.string = '';
      j = 0;
      while (j < this.colSize) {
        _ref = this.physics.particles;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          particle = _ref[_i];
          if (Math.round(particle.pos.x) === j && Math.round(particle.pos.y) === i) {
            this.string += '0';
          }
        }
        if (j === 0 || j === this.colSize - 1) {
          this.string += '|';
        } else if (i === 0 || i === this.rowsize - 1) {
          this.string += '_';
        } else {
          this.string += ' ';
        }
        j++;
      }
      console.log(this.string);
      i++;
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
