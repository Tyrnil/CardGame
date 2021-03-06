const fs = require('fs')
const Card = require('../Class/Card')
const utils = require('../utils')
const fonts = require('../fonts')

class DuelLoading extends Phaser.State {
	init () {
		this.startTime = new Date().getTime()
		this.game.player1.cardDeck = DuelLoading._load_cards_from_deck(this.game.player1.deck)
		this.game.player2.cardDeck = DuelLoading._load_cards_from_deck(this.game.player2.deck)
	}

	preload () {
		this._load_deck_imgs(this.game.player1.deck, this.game.player2.deck)
	}

	create () {
		this.game.stage.backgroundColor = '#ff9966'

		utils.createLinearGradient(this.game, '#ff9966', '#ff5e62')

		let text = this.game.add.text(0, 0,  'LOADING', fonts.pixel128px)
		text.setTextBounds(0, (this.game.height/2) - 100, this.game.width, 100)

		this.game.player1.cardDeck = this._instanciate_cards(this.game.player1.cardDeck, "player1")
		this.game.player2.cardDeck = this._instanciate_cards(this.game.player2.cardDeck, "player2")

		this.endTime = new Date().getTime()

		console.log('Loading done in : ' + (this.endTime - this.startTime) + ' ms')

		if (this.endTime - this.startTime < 1000)
			setTimeout(() => {
				this.game.state.start('duel')
			}, 1000)
		else
			this.game.state.start('duel')
	}

	static _load_cards_from_deck (deck) {
		let allCards = []
		let cards = []

		allCards = DuelLoading._readAllCards()

		for (let i in deck)
			cards.push(DuelLoading._match_card_by_id(allCards, deck[i]))

		return cards
	}

	static _readAllCards () {
		return JSON.parse(fs.readFileSync('./cards/cards.json'))
	}

	static _match_card_by_id (list, id) {
		for (let i in list) {
			if (list[i].id === id)
				return list[i]
		}
		return null
	}

	_load_deck_imgs (deck1, deck2) {
		let deck = []
		let i, j, test

		for (i in deck1) {
			test = true
			for (j in deck) {
				if (deck1[i] === deck[j]) {
					test = false
					break
				}
			}
			if (test)
				deck.push(deck1[i])
		}

		for (i in deck2) {
			test = true
			for (j in deck) {
				if (deck2[i] === deck[j]) {
					test = false
					break
				}
			}
			if (test)
				deck.push(deck2[i])
		}

		for (i in deck) {
			console.log('Loading /cards/img/card_' + deck[i] + '.png ...')
			this.game.load.image('img_card_' + deck[i], '../cards/img/card_' + deck[i] + '.png')
		}

	}

	_instanciate_cards (cardDeck, player) {
		let deck = []
		for (let i in cardDeck)
			deck.push(new Card(this.game, cardDeck[i].id, cardDeck[i].name,
				cardDeck[i].attack, cardDeck[i].health, cardDeck[i].rank,
				cardDeck[i].type, cardDeck[i].nature, 'img_card_' + cardDeck[i].id, cardDeck[i].img, player))
		return deck
	}
}

module.exports = DuelLoading
