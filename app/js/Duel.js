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
		this._draw_hand_player(this.game.player1, this.player1HandGroup)
		this._draw_hand_player(this.game.player2, this.player2HandGroup)

		//Positionne la main du joueur 1 correctement sur l'écran
		this.player1HandGroup.x = this.world.centerX - (this.player1HandGroup.width * 0.5)
		this.player1HandGroup.y = this.game.height - this.player1HandGroup.height

		//Positionne le terrain de jeu du joueur 1 correctement sur l'écran
		this.player1TerrainGroup.x = this.world.centerX - (this.player1TerrainGroup.width * 0.5)
		this.player1TerrainGroup.y = this.game.height - (this.player1TerrainGroup.height + this.player1HandGroup.height)

		//Positionne la main du joueur 2 correctement sur l'écran
		this.player2HandGroup.x = this.world.centerX - (this.player2HandGroup.width * 0.5)

		//Positionne le terrain de jeu du joueur 2 correctement sur l'écran
		this.player2TerrainGroup.x = this.world.centerX - (this.player2TerrainGroup.width * 0.5)
		this.player2TerrainGroup.y = this.player2HandGroup.height

		//Dessine le text des cartes
		this._draw_hand_text(this.player1HandGroup)
		this._draw_hand_text(this.player2HandGroup)

		//Dessine le texte génaral du jeu
		this._create_game_text()
	}

	update () {
		//Dessine les mains des 2 joueurs
		this._draw_hand_player(this.game.player1, this.player1HandGroup)
		this._draw_hand_player(this.game.player2, this.player2HandGroup)

		//Positionne la main du joueur 1 correctement sur l'écran
		this.player1HandGroup.x = this.world.centerX - (this.player1HandGroup.width * 0.5)
		this.player1HandGroup.y = this.game.height - this.player1HandGroup.height

		//Positionne le terrain de jeu du joueur 1 correctement sur l'écran
		this.player1TerrainGroup.x = this.world.centerX - (this.player1TerrainGroup.width * 0.5)
		this.player1TerrainGroup.y = this.game.height - (this.player1TerrainGroup.height + this.player1HandGroup.height)

		//Positionne la main du joueur 2 correctement sur l'écran
		this.player2HandGroup.x = this.world.centerX - (this.player2HandGroup.width * 0.5)

		//Positionne le terrain de jeu du joueur 2 correctement sur l'écran
		this.player2TerrainGroup.x = this.world.centerX - (this.player2TerrainGroup.width * 0.5)
		this.player2TerrainGroup.y = this.player2HandGroup.height

		//this._update_card_text(this.player1HandGroup)
		//this._update_card_text(this.player2HandGroup)
	}

	_create_game_text () {
		let style = { font: '32px Pixel', fill: '#ecf0f1', boundsAlignH: 'center', boundsAlignV: 'middle' }

		this.onScreenText = {
			player1Info: this.game.add.text(20, this.game.height - 52,  'Player1: ' + this.game.player1.name, style),
			player2Info: this.game.add.text(20, 20,  'Player2: ' + this.game.player2.name, style)
		}
	}

	_draw_hand_player (player, group) {
		for (let i in player.hand) {
			for (let j in player.cardDeck) {
				if ((player.cardDeck[j].id === player.hand[i]) && (player.cardDeck[j].visible == false)) {
					player.cardDeck[j].visible = true
					player.cardDeck[j].x = i * player.cardDeck[j].width
					player.cardDeck[j].y = 0

					player.cardDeck[j].input.enableDrag()
					player.cardDeck[j].events.onDragStart.add(this._on_card_drag_start, this)
    				player.cardDeck[j].events.onDragStop.add(this._on_card_drag_end, this)
					player.cardDeck[j].events.onInputDown.add(this._on_card_click, player.cardDeck[j])

					group.add(player.cardDeck[j])

					break
				}
			}
		}

	}

	_draw_hand_text (group) {
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

	_on_card_click () {
	}

	_on_card_drag_start (card, pointer) {
		this.player1HandGroup.remove(card, false, false)
		card.startPos = { x:card.x, y:card.y }
	}

	_on_card_drag_end (card, pointer) {
		if (utils.checkOverlap(card, this.game.handPlayer1HitBox) || utils.checkOverlap(card, this.game.handPlayer2HitBox)){
			card.x = card.startPos.x
			card.y = card.startPos.y
			this.player1HandGroup.add(card)
		}
		else {
			this.player1TerrainGroup.add(card)
			card.x = (this.player1TerrainGroup.children.length * card.width)
			card.y = 0
			card.input.enableDrag()
		}

	}

	_update_card_text (group) {
		for (let i in group.children) {
			group.children[i].currentHealthText.text = group.children[i].currentHealth

			group.children[i].currentHealthText.x = group.children[i].world.x + (group.children[i].width / 2)
			group.children[i].currentHealthText.y = group.children[i].world.y

			group.children[i].attackText.x = group.children[i].world.x
			group.children[i].attackText.y = group.children[i].world.y
		}

	}
}

module.exports = Duel
