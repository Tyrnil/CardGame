class Card extends Phaser.Sprite {
	constructor (game, id, name, attack, health, rank, type, img, imgName, player) {
		super(game, 0, 0, 'img_card_1')
		this.id = id
		this.name = name
		this.attack = attack
		this.health = health
		this.currentHealth = health
		this.rank = rank
		this.type = type
		this.img = imgName
		this.player = player
		this.attackText = null
		this.currentHealthText = null

		this.inputEnabled = true
		this.visible = false
	}
}

module.exports = Card
