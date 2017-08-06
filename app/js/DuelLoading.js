const fs = require('fs')
const Card = require('./Card')
const utils = require('./utils')

class DuelLoading extends Phaser.State {
	init () {
		this.game.player1.cardDeck = DuelLoading._load_cards_from_deck(this.game.player1.deck)
		this.game.player2.cardDeck = DuelLoading._load_cards_from_deck(this.game.player2.deck)
	}

	preload () {
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVertically = true;

		console.log('Canvas WIDTH: ',$('#main').width(), ' - HEIGHT: ', $('#main').height(), '\nGame WIDTH: ', this.game.width, ' - HEIGHT: ', this.game.height)

		this._load_deck_imgs(this.game.player1.deck, this.game.player2.deck)
	}

	create () {
		this.game.stage.backgroundColor = '#ff9966'

		utils.createLinearGradient(this.game, '#ff9966', '#ff5e62')

		let style = { font: '72px Pixel', fill: '#ecf0f1', boundsAlignH: 'center', boundsAlignV: 'middle' }

		let text = this.game.add.text(0, 0,  'LOADING', style)
		text.setTextBounds(0, (this.game.height/2) - 100, this.game.width, 100)

		this.game.player1.cardDeck = this._instanciate_cards(this.game.player1.cardDeck, "player1")
		this.game.player2.cardDeck = this._instanciate_cards(this.game.player2.cardDeck, "player2")

		setTimeout(() => {
			this.game.state.start('duel')
		}, 2000)
	}

	update () {

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
				cardDeck[i].type, 'img_card_' + cardDeck[i].id, cardDeck[i].img, player))
		return deck
	}
}

module.exports = DuelLoading
