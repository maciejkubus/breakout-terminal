const readline = require('readline')

let points = 0
const map = {
	width: 41,
	height: 12,
}

const bricks = []

const player = [
	{ x: 16, y: 10 },
	{ x: 17, y: 10 },
	{ x: 18, y: 10 },
	{ x: 19, y: 10 },
	{ x: 20, y: 10 },
	{ x: 21, y: 10 },
	{ x: 22, y: 10 },
]

const ball = {
	x: 19,
	y: 9,
	updateX: 1,
	updateY: -1
}

const draw = () => {
	for(let y = 0; y < map.height; y++) {
		let line = ''
		for(let x = 0; x < map.width; x++) {
			const playerPart = player.find(p => p.x == x && p.y == y)
			if(playerPart) {
				line += '⬜'
			}
			else if(ball.x == x && ball.y == y) {
				line += '🏀'
			}
			else if(bricks.find(b => b.x == x && b.y == y)) {
				line += '🧱'
			}
			else {
				line += '⬛'
			}
		}	
		console.log(line)
	}
	console.log('Points: ' + points)
}

const die = () => {
	console.log('You motherfucking idiot')
	console.log('Points: ' + points)
	process.exit()
}

const win = () => {
	console.log('You won')
	console.log('Points: ' + points)
	process.exit()
}

const moveBall = () => {
	ball.x += ball.updateX
	ball.y += ball.updateY

	const brick = bricks.findIndex(b => b.x == ball.x && b.y == ball.y)
	if(brick > 0) {
		bricks.splice(brick, 1)
		ball.x -= ball.updateX
		ball.y -= ball.updateY
		ball.updateY *= -1
		ball.updateX *= -1
		points++
	}

	if(bricks.length <= 0) {
		win();
	}

	if(
		ball.y <= 0 || ball.y >= map.height || 
		player.find(p => p.x == ball.x && p.y == ball.y + 1)
	) 
		ball.updateY *= -1
	if(ball.x <= 0 || ball.x >= map.width - 1) 
		ball.updateX *= -1

	if(ball.y == map.height)
		die()
}

const update = () => {
	console.clear();
	draw();
}

const generateRow = (shift, row) => {
	for(let i = shift; i < map.width - shift - 1; i++) {
		if(i % 6 != shift) {
			bricks.push({ x: i, y: row })
		}
	}
}

const generate = () => {
	for(let i = 1; i <= 3; i += 2) {
		generateRow(i % 3, i)
	}
}

const main = () => {
	readline.emitKeypressEvents(process.stdin);

	if (process.stdin.isTTY)
			process.stdin.setRawMode(true);

	process.stdin.on('keypress', (chunk, key) => {
		if(key.name == 'q') {
			process.exit()
		}
		if(key.name == 'right' && !player.find(p => p.x == map.width - 1)) {
			player.forEach(p => p.x++)
		}
		else if(key.name == 'left' && !player.find(p => p.x == 0)) {
			player.forEach(p => p.x--)
		}
		
	});

	setInterval(update, 50)
	setInterval(moveBall, 200)

	generate()
}

main();