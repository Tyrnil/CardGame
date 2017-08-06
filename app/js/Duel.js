const utils = require('./utils')

class Duel extends Phaser.State {

	init () {
		this.game.player1.init()
		this.game.player2.init()
	}

	preload () {
	}

	create () {
		utils.createLinearGradient(this.game, '#ff9966', '#ff5e62')

		//Ajout des sprites des cartes au jeu et enable physique pour faire tomber la pomme
		for (let i  in this.game.player1.cardDeck) {
			this.game.add.existing(this.game.player1.cardDeck[i])
			this.game.physics.arcade.enable(this.game.player1.cardDeck[i])
		}
		for (let i  in this.game.player2.cardDeck) {
			this.game.add.existing(this.game.player2.cardDeck[i])
			this.game.physics.arcade.enable(this.game.player2.cardDeck[i])
		}

		this.game.player1.drawCard()
		this.game.player1.drawCard()
		this.game.player2.drawCard()

		//Créer les zones de jeu
		this.game.handPlayer1HitBox = utils.createDummySprite(this.game, 2560, 300, 0, 1440 - 300)
		this.game.handPlayer2HitBox = utils.createDummySprite(this.game, 2560, 300, 0, 0)

		//Main des joueurs
		this.player1HandGroup = this.game.add.group()
		this.player2HandGroup = this.game.add.group()
		//Terrain de jeu des joueurs
		this.player1TerrainGroup = this.game.add.group()
		this.player2TerrainGroup = this.game.add.group()

		//Dessine les mains des 2 joueurs
		this._drawHandPlayer(this.game.player1, this.player1HandGroup)
		this._drawHandPlayer(this.game.player2, this.player2HandGroup)

		//Dessine le text des cartes
		this._createCardText(this.player1HandGroup)
		this._createCardText(this.player2HandGroup)

		//Dessine le texte génaral du jeu
		this._createGameText()

		this.player1TerrainGroup.add(this.player1HandGroup.children[0])
	}

	update () {
		//Dessine les cartes
		this._updateCardGroup(this.player1HandGroup)
		this._updateCardGroup(this.player1TerrainGroup)
		this._updateCardGroup(this.player2HandGroup)
		this._updateCardGroup(this.player2TerrainGroup)

		//Positionne la main du joueur 1 correctement sur l'écran
		this.player1HandGroup.x = this.world.centerX - (this.player1HandGroup.width * 0.5)
		this.player1HandGroup.y = 1140

		//Positionne le terrain de jeu du joueur 1 correctement sur l'écran
		this.player1TerrainGroup.x = this.world.centerX - (this.player1TerrainGroup.width * 0.5)
		this.player1TerrainGroup.y = 760

		//Positionne la main du joueur 2 correctement sur l'écran
		this.player2HandGroup.x = this.world.centerX - (this.player2HandGroup.width * 0.5)

		//Positionne le terrain de jeu du joueur 2 correctement sur l'écran
		this.player2TerrainGroup.x = this.world.centerX - (this.player2TerrainGroup.width * 0.5)
		this.player2TerrainGroup.y = 380

		this._updateCardText(this.player1HandGroup)
		this._updateCardText(this.player1TerrainGroup)
		this._updateCardText(this.player2HandGroup)
		this._updateCardText(this.player2TerrainGroup)
	}

	_createGameText () {
		let style = { font: '32px Pixel', fill: '#ecf0f1', boundsAlignH: 'center', boundsAlignV: 'middle' }

		this.onScreenText = {
			player1Info: this.game.add.text(20, this.game.height - 52,  'Player1: ' + this.game.player1.name, style),
			player1Energy: this.game.add.text(this.game.width - 250, this.game.height - 52, 'Energy: ' + this.game.player1.energy, style),
			player2Info: this.game.add.text(20, 20,  'Player2: ' + this.game.player2.name, style),
			player2Energy: this.game.add.text(this.game.width - 250, 20, 'Energy: ' + this.game.player2.energy, style)
		}
	}

	_drawHandPlayer (player, group) {
		for (let i in player.hand) {
			player.hand[i].visible = true
			player.hand[i].x = i * player.hand[i].width
			player.hand[i].y = 0

			player.hand[i].input.enableDrag()
			player.hand[i].events.onDragStart.add(this._on_card_drag_start, this)
			player.hand[i].events.onDragStop.add(this._on_card_drag_end, this)

			group.add(player.hand[i])
		}
	}

	_createCardText (group) {
		let style = { font: '24px Pixel', fill: '#ecf0f1', boundsAlignH: 'center', boundsAlignV: 'middle' }

		for (let i in group.children) {
			group.children[i].attackText = this.game.add.text(group.x + (i * group.children[i].width), group.y, group.children[i].attack, style)
			group.children[i].attackText.stroke = '#000000';
    		group.children[i].attackText.strokeThickness = 4;

			group.children[i].currentHealthText = this.game.add.text(group.x + (i * group.children[i].width) + (group.children[i].width / 2), group.y, group.children[i].currentHealth, style)
			group.children[i].currentHealthText.stroke = '#000000';
    		group.children[i].currentHealthText.strokeThickness = 4;
		}
	}

	_on_card_drag_start (card, pointer) {
		this.game.world.add(card)
	}

	_on_card_drag_end (card, pointer) {
		if (utils.checkOverlap(card, this.game.handPlayer1HitBox) || utils.checkOverlap(card, this.game.handPlayer2HitBox)){
			if (card.player === 'player1')
				this.player1HandGroup.add(card)
			else if (card.player === 'player2')
				this.player2HandGroup.add(card)
		}
		else {
			if (card.player === 'player1')
				this.player1TerrainGroup.add(card)
			else if (card.player === 'player2')
				this.player2TerrainGroup.add(card)
		}

	}

	_updateCardText (group) {
		for (let i in group.children) {
			group.children[i].currentHealthText.text = group.children[i].currentHealth

			group.children[i].currentHealthText.x = group.children[i].world.x + (group.children[i].width / 2)
			group.children[i].currentHealthText.y = group.children[i].world.y

			group.children[i].attackText.x = group.children[i].world.x
			group.children[i].attackText.y = group.children[i].world.y
		}
	}

	_updateCardGroup (group) {
		for (let i in group.children) {
			group.children[i].x = i * group.children[i].width
			group.children[i].y = 0
		}
	}
}

module.exports = Duel
