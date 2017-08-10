class Card extends Phaser.Sprite {
	constructor (game, id, name, attack, health, rank, type, nature, img, imgName, player) {
		super(game, 0, 0, img)
		this.id = id
		this.name = name
		this.attack = parseInt(attack)
		this.health = parseInt(health)
		this.currentHealth = parseInt(health)
		this.rank = parseInt(rank)
		this.type = type
		this.nature = nature
		this.img = imgName
		this.player = player
		this.state = 'DECK'
		this.attackText = null
		this.currentHealthText = null

		this.inputEnabled = true
		this.visible = false
	}

	hide () {
		this.visible = false
		if (this.attackText)
			this.attackText.visible = false
		if (this.currentHealthText)
			this.currentHealthText.visible = false

		this.inputEnabled =  false
	}
}

module.exports = Card
