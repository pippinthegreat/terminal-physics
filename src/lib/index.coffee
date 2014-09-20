Prompt = require 'prompt'
Colors = require 'colors'
Sleep = require 'sleep'

CoffeePhysics = require './physics.js'


init = ()->
	world = new World()


	# setup environment via prompt
	world.setParticleCount(10)
	world.setupWorld()


class World
	constructor: ()->
		@colSize = 75
		@rowSize = 50
		@particleCount = 10

	setParticleCount: (count)->
		@particleCount = count

	setupWorld: ->
		@physics = new CoffeePhysics.Physics()
		@physics.integrator = new CoffeePhysics.Verlet()

		@pullToTop = new CoffeePhysics.Attraction()
		@pullToBottom = new CoffeePhysics.Attraction()
		@edgeBounce = new CoffeePhysics.EdgeBounce new CoffeePhysics.Vector(0, 0), new CoffeePhysics.Vector(@colSize, @rowSize)

		@collision = new CoffeePhysics.Collision()


		for i in [0..@particleCount-1] by 1
			particle = new CoffeePhysics.Particle Math.random()
			position = new CoffeePhysics.Vector 5+i, 5*i
			particle.setMass 1
			particle.setRadius 1
			particle.moveTo position

			@collision.pool.push particle

			particle.behaviours.push @pullToTop, @pullToBottom, @collision, @edgeBounce

			@physics.particles.push particle



		@pullToBottom.target.x = @colSize / 2
		@pullToBottom.target.y = @rowSize * (1/4)
		@pullToBottom.strength = 10

		@pullToTop.target.x = @colSize / 2
		@pullToTop.target.y = @rowSize * (3/4)
		@pullToTop.strength = 10

		@drawWorld()


	drawWorld: ->
		@physics.step()

		# process.stdout.write '\033c' # windows
		process.stdout.write '\u001B[2J\u001B[0;0f'

		for i in [0..@rowSize-1] by 1

			@string = ''

			for j in [0..@colSize-1] by 1

				for particle in @physics.particles
					if Math.round(particle.pos.x) is j and Math.round(particle.pos.y) is i then @string += 'o'


				if j is 0 or j is @colSize-1 then @string += '|'
				else if i is 0 or i is @rowSize-1 then @string += '_'
				else @string += ' '


			console.log @string


		Sleep.usleep 10000

		self = @
		setTimeout ()->
			self.drawWorld()
		, 0

init()
