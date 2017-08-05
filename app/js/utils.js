function createLinearGradient (game, color1, color2) {
	let myBitmap = game.add.bitmapData(game.width, game.height)
	let grd = myBitmap.context.createLinearGradient(0, 0, 0, 500)

	grd.addColorStop(0, color1)
	grd.addColorStop(1, color2)

	myBitmap.context.fillStyle = grd
	myBitmap.context.fillRect(0, 0, game.width, game.height)

	game.add.sprite(0, 0, myBitmap)
}

function createDummySprite (game, width, height, x, y) {
	let myBitmap = game.add.bitmapData(width, height)
	let sprite = new Phaser.Sprite(game, x, y, myBitmap)

	sprite.visible = false

	game.add.existing(sprite)

	return sprite
}

function checkOverlap (spriteA, spriteB) {
	let boundsA = spriteA.getBounds()
    let boundsB = spriteB.getBounds()

    return Phaser.Rectangle.intersects(boundsA, boundsB)
}

function getRandomArbitrary (min, max) {
	return Math.random() * (max - min) + min
}

module.exports = {
	'createLinearGradient': createLinearGradient,
	'createDummySprite': createDummySprite,
	'checkOverlap': checkOverlap,
	'getRandomArbitrary': getRandomArbitrary
}
