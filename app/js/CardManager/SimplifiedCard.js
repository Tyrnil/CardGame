class SimplifiedCard {
	constructor (id, name, attack, health, rank, type, nature, img) {
		this.id = id
		this.name = name
		this.attack = attack
		this.health = health
		this.rank = rank
		this.type = type
		this.nature = nature
		this.img = img

		this.isOpen = false
		this.isFocused = false

		this.imgChanged = false
		this.newImgUrl
	}

	toJSON () {
		return {
			id: this.id,
			name: this.name,
			attack: this.attack,
			health: this.health,
			rank: this.rank,
			type: this.type,
			nature: this.nature,
			img: this.img
		}
	}

	static defaultCard (id) {
		return new SimplifiedCard(id, 'default', '0', '0', '1', 'Bouffe', 'monster', '/cards/img/card_default.png')
	}
}

module.exports = SimplifiedCard
