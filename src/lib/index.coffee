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
		console.log 'constructor'
		@colSize = 75
		@rowsize = 50
		@particleCount = 10

	setParticleCount: (count)->
		console.log 'setParticleCount'
		@particleCount = count

	setupWorld: ->
		console.log 'setupWorld'
		@physics = new CoffeePhysics.Physics()
		@physics.integrator = new CoffeePhysics.Verlet()

		@pullToTop = new CoffeePhysics.Attraction()
		@pullToBottom = new CoffeePhysics.Attraction()
		@edgeBounce = new CoffeePhysics.EdgeBounce new CoffeePhysics.Vector(0, 0), new CoffeePhysics.Vector(@colSize, @rowsize)

		@collision = new CoffeePhysics.Collision()

		i = 0

		while i < @particleCount
			particle = new CoffeePhysics.Particle Math.random()
			position = new CoffeePhysics.Vector 5+i, 5*i
			particle.setMass 1
			particle.setRadius 1
			particle.moveTo position

			@collision.pool.push particle

			particle.behaviours.push @pullToTop, @pullToBottom, @collision, @edgeBounce

			@physics.particles.push particle

			i++

		@pullToBottom.target.x = @colSize / 2
		@pullToBottom.target.y = @rowsize * (1/4)
		@pullToBottom.strength = 10

		@pullToTop.target.x = @colSize / 2
		@pullToTop.target.y = @rowsize * (3/4)
		@pullToTop.strength = 10

		console.log 'about to drawWorld'
		@drawWorld()


	drawWorld: ->
		console.log 'drawWorld'
		@physics.step()

		# process.stdout.write '\033c' # windows
		process.stdout.write '\u001B[2J\u001B[0;0f'

		i = 0
		while i < @rowsize

			@string = ''
			j = 0
			while j < @colSize

				for particle in @physics.particles
					if Math.round(particle.pos.x) is j and Math.round(particle.pos.y) is i
						@string += 'o'


				if j is 0 or j is @colSize-1 then @string += '|'
				else if i is 0 or i is @rowsize-1 then @string += '_'
				else @string += ' '

				j++
			console.log @string
			i++

		Sleep.usleep 10000

		self = @
		setTimeout ()->
			self.drawWorld()
		, 0

init()
