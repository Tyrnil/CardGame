const utils = require('./utils')

class Player {
	constructor (deck = ['1', '1', '1'], name = 'Jean') {
		this.deck = deck
		this.cardDeck = null
		this.name = name
		this.currentDeck = []
		this.hand = []
		this.usedCards = []
		this.cardInPlay = []
		this.energy = 0
		this.energyEarnedLastTurn = 0
		this.deadCards = []
	}

	init () {
		this.currentDeck = this.cardDeck
		this.hand = []
		this.usedCards = []
		this.cardInPlay = []
		this.deadCards = []
	}

	drawCard () {
		if (this.currentDeck.length === 0)
			return -1

		let pull = Math.floor(utils.getRandomArbitrary(0, this.currentDeck.length))

		this.currentDeck[pull].state = 'HAND'
		this.hand.push(this.currentDeck[pull])
		this.currentDeck.splice(pull, 1)

		return 1
	}

	checkDeadCards () {
		for (let i in this.cardInPlay) {
			if (this.cardInPlay[i].state === "DEAD") {
				this.deadCards.push(this.cardInPlay[i]);
				this.cardInPlay.splice(i, 1)
			}
		}
	}
}

module.exports = Player
