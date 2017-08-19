const utils = require('../utils')

class Player {
	constructor (deck = ['1', '1', '1', '2'], name = 'Jean') {
		this.deck = deck
		this.cardDeck = null
		this.name = name
		this.currentDeck = []
		this.hand = []
		this.usedCards = []
		this.cardInPlay = []
		this.energy = 0
		this.lifePoint = 0
		this.energyEarnedLastTurn = 0
		this.deadCards = []
	}

	init () {
		this.currentDeck = this.cardDeck
		this.hand = []
		this.usedCards = []
		this.cardInPlay = []
		this.deadCards = []
		this.lifePoint = 8000
	}

	drawCard () {
		if (this.currentDeck.length === 0)
			return null

		let pull = utils.getRandomArbitrary(0, this.currentDeck.length)

		let card = this.currentDeck[pull]

		card.state = 'HAND'
		this.hand.push(card)
		this.currentDeck.splice(pull, 1)

		return card
	}

	hasBeenInvoked () {
		for (let i in this.hand) {
			if (this.hand[i].state === 'PLAY') {
				this.cardInPlay.push(this.hand[i])
				this.hand.splice(i, 1)
			}
		}
	}

	checkDeadCards () {
		for (let i in this.cardInPlay) {
			if (this.cardInPlay[i].state === 'DEAD') {
				this.deadCards.push(this.cardInPlay[i])
				this.cardInPlay.splice(i, 1)
			}
		}
	}

	setEnergy () {
		this.energy = 4 + this.energyEarnedLastTurn
		if (this.energy > 12)
			this.energy = 12
		this.energyEarnedLastTurn = 0
	}
}

module.exports = Player
