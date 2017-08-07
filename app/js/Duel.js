const utils = require('./utils')
const GameLogic = require('./GameLogic')

class Duel extends Phaser.State {

	init () {
		this.game.player1.init()
		this.game.player2.init()
	}

	preload () {
		this.game.time.advancedTiming = true
	}

	create () {
		utils.createLinearGradient(this.game, '#ff9966', '#ff5e62')

		//Ajout des sprites des cartes au jeu et add les listener
		for (let i  in this.game.player1.cardDeck) {
			this.game.add.existing(this.game.player1.cardDeck[i])
			this.game.player1.cardDeck[i].events.onDragStart.add(this._onCardDragStart, this)
			this.game.player1.cardDeck[i].events.onDragStop.add(this._onCardDragEnd, this)
			this.game.player1.cardDeck[i].events.onInputDown.add(this._onCardClick, this)
		}
		for (let i  in this.game.player2.cardDeck) {
			this.game.add.existing(this.game.player2.cardDeck[i])
			this.game.player2.cardDeck[i].events.onDragStart.add(this._onCardDragStart, this)
			this.game.player2.cardDeck[i].events.onDragStop.add(this._onCardDragEnd, this)
			this.game.player2.cardDeck[i].events.onInputDown.add(this._onCardClick, this)
		}

		//Créer les zones de jeu
		this.game.handPlayer1HitBox = utils.createDummySprite(this.game, 2560, 300, 0, 1440 - 300)
		this.game.handPlayer2HitBox = utils.createDummySprite(this.game, 2560, 300, 0, 0)

		//Main des joueurs
		this.player1HandGroup = this.game.add.group()
		this.player2HandGroup = this.game.add.group()
		//Terrain de jeu des joueurs
		this.player1TerrainGroup = this.game.add.group()
		this.player2TerrainGroup = this.game.add.group()
		//Cimetière des cartes
		this.player1Graveyard = this.game.add.group()
		this.player2Graveyard = this.game.add.group()

		//Dessine le texte génaral du jeu
		this._createGameText()

		this.playerTurn = 'player1'
		this.duelState ='DRAW_PHASE'
		this.stateStatus = 'NOT_INIT'

		this._initCard(this.game.player1.drawCard(), this.player1HandGroup)
		this._initCard(this.game.player2.drawCard(), this.player2HandGroup)

		this.game.add.button(2160, this.game.world.centerY, 'button', this._onEndTurnButton, this, 0, 1, 2)
	}

	update () {
		this._gameLogicLoop()

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

		this._updateGameText()
	}

	_createGameText () {
		let style = { font: '32px Pixel', fill: '#ecf0f1', boundsAlignH: 'center', boundsAlignV: 'middle' }

		this.onScreenText = {
			player1Info: this.game.add.text(20, this.game.height - 52,  'Player1: ' + this.game.player1.name, style),
			player1Energy: this.game.add.text(this.game.width - 250, this.game.height - 52, 'Energy: ' + this.game.player1.energy, style),
			player2Info: this.game.add.text(20, 20,  'Player2: ' + this.game.player2.name, style),
			player2Energy: this.game.add.text(this.game.width - 250, 20, 'Energy: ' + this.game.player2.energy, style),
			debug: this.game.add.text(20, 250, 'Debug:\nfps: ' + this.game.time.fps + '\nplayerTurn: ' + this.playerTurn + '\nduelState: ' + this.duelState, style)
		}
	}

	_updateGameText () {
		let style = { font: '32px Pixel', fill: '#ecf0f1', boundsAlignH: 'center', boundsAlignV: 'middle' }

		this.onScreenText.player1Energy.text = 'Energy: ' + this.game.player1.energy
		this.onScreenText.player2Energy.text = 'Energy: ' + this.game.player2.energy
		this.onScreenText.debug.text = 'Debug:\nfps: ' + this.game.time.fps + '\nplayerTurn: ' + this.playerTurn + '\nduelState: ' + this.duelState

	}

	_initCard (card, group) {
		card.visible = true
		group.add(card)
		this._createCardText(card)

	}

	_createCardText (card) {
		let style = { font: '24px Pixel', fill: '#ecf0f1', boundsAlignH: 'center', boundsAlignV: 'middle' }

		card.attackText = this.game.add.text(card.world.x, 0, card.attack, style)
		card.attackText.stroke = '#000000';
		card.attackText.strokeThickness = 4;

		card.currentHealthText = this.game.add.text(card.world.x + (card.width / 2), 0, card.currentHealth, style)
		card.currentHealthText.stroke = '#000000';
		card.currentHealthText.strokeThickness = 4;
	}

	_onCardDragStart (card, pointer) {
		if (this.duelState === 'MAIN_PHASE')
			this.game.world.add(card)
	}

	_onCardDragEnd (card, pointer) {
		let player = card.player === 'player1' ? this.game.player1 : this.game.player2

		if (this.duelState === 'MAIN_PHASE') {
			if (card.state === 'HAND') {
				if (!utils.checkOverlap(card, this.game.handPlayer1HitBox) && !utils.checkOverlap(card, this.game.handPlayer2HitBox)){
					if (GameLogic.checkInvokCard(card, player)) {
						if ((card.nature === 'magic') || (card.rank <= 2)) {
							if (card.player === 'player1') {
								this.game.player1.energyEarnedLastTurn += GameLogic.invok(card)
								this.game.player1.hasBeenInvoked()
								this.player1TerrainGroup.add(card)
							}
							else if (card.player === 'player2') {
								this.game.player2.energyEarnedLastTurn += GameLogic.invok(card)
								this.game.player2.hasBeenInvoked()
								this.player2TerrainGroup.add(card)
							}
							return
						}
						else {
							this.duelState = 'SACRIFICE'
							this.currentSacrifice = {
								'toInvok': card,
								'required': 1,
								'list': []
							}
						}
					}
				}
				if (card.player === 'player1')
					this.player1HandGroup.add(card)
				else if (card.player === 'player2')
					this.player2HandGroup.add(card)
			}
			else if (card.state === 'PLAY') {
				if (card.player === 'player1') {
					if (utils.checkOverlap(card, this.player2TerrainGroup)) {
						this.duelState = 'BATTLE_PHASE'
						this.stateStatus = 'NOT_INIT'
						this.cardAttacking = card
					}
					this.player1TerrainGroup.add(card)
				}
				else if (card.player === 'player2') {
					if (utils.checkOverlap(card, this.player1TerrainGroup)) {
						this.duelState = 'BATTLE_PHASE'
						this.stateStatus = 'NOT_INIT'
						this.cardAttacking = card
					}
					this.player2TerrainGroup.add(card)
				}
			}
		}
	}

	_onCardClick(card, pointer) {
		if (this.duelState === 'SACRIFICE') {
			this.currentSacrifice.list.push(card)
			if (this.currentSacrifice.list.length === this.currentSacrifice.required) {
				if (card.player === 'player1') {
					this.game.player1.energyEarnedLastTurn += GameLogic.invok(this.currentSacrifice.toInvok, this.currentSacrifice.list)
					this.game.player1.hasBeenInvoked()
					this.player1TerrainGroup.add(this.currentSacrifice.toInvok)
					for (let i in this.currentSacrifice.list) {
						this.currentSacrifice.list[i].hide()
						this.player1Graveyard.add(this.currentSacrifice.list[i])
					}
				}
				else if (card.player === 'player2') {
					this.game.player2.energyEarnedLastTurn += GameLogic.invok(this.currentSacrifice.toInvok, this.currentSacrifice.list)
					this.game.player2.hasBeenInvoked()
					this.player2TerrainGroup.add(this.currentSacrifice.toInvok)
					for (let i in this.currentSacrifice.list) {
						this.currentSacrifice.list[i].hide()
						this.player2Graveyard.add(this.currentSacrifice.list[i])
					}
				}
				this.duelState = 'MAIN_PHASE'
				this.stateStatus = 'NOT_INIT'

				this.currentSacrifice = null
			}
		}
		else if (this.duelState === 'BATTLE_PHASE') {
			if (this.playerTurn === 'player1')
				this.game.player1.energyEarnedLastTurn += GameLogic.attackPhase(this.cardAttacking, card)
			else if (this.playerTurn === 'player2')
				this.game.player2.energyEarnedLastTurn += GameLogic.attackPhase(this.cardAttacking, card)

			if (card.currentHealth <= 0) {
				card.hide()
				if (this.playerTurn === 'player1')
					this.player2Graveyard.add(card)
				else if (this.playerTurn === 'player2')
					this.player1Graveyard.add(card)
			}

			if (this.cardAttacking.currentHealth <= 0) {
				this.cardAttacking.hide()
				if (this.playerTurn === 'player1')
					this.player1Graveyard.add(this.cardAttacking)
				else if (this.playerTurn === 'player2')
					this.player2Graveyard.add(this.cardAttacking)
			}

			this.cardAttacking = null

			this.duelState = 'MAIN_PHASE'
			this.stateStatus = 'NOT_INIT'
		}

	}

	_onEndTurnButton () {
		if (this.duelState === 'MAIN_PHASE') {
			this.duelState = 'END_TURN'
			this.stateStatus = 'NOT_INIT'
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
			if (!group.children[i].visible)
				group.children[i].visible = true
			group.children[i].x = i * group.children[i].width
			group.children[i].y = 0
		}
	}

	_inputManager () {
		if ((this.duelState === 'DRAW_PHASE') || (this.duelState === 'END_TURN') || (this.duelState === 'BLOCKED'))
			this._blockInput()
		else if (this.duelState === 'MAIN_PHASE')
			this._mainPhaseInput()
		else if (this.duelState === 'SACRIFICE')
			this._sacrificeInput()
		else if (this.duelState === 'BATTLE_PHASE')
			this._battlePhaseInput()
	}

	_blockInput () {
		for (let i in this.player1HandGroup.children)
			this.player1HandGroup.children[i].inputEnabled = false
		for (let i in this.player1TerrainGroup.children)
			this.player1TerrainGroup.children[i].inputEnabled = false
		for (let i in this.player2HandGroup.children)
			this.player2HandGroup.children[i].inputEnabled = false
		for (let i in this.player2TerrainGroup.children)
			this.player2TerrainGroup.children[i].inputEnabled = false
	}

	_mainPhaseInput () {
		if (this.playerTurn === 'player1') {
			for (let i in this.player1HandGroup.children) {
				this.player1HandGroup.children[i].inputEnabled = true
				this.player1HandGroup.children[i].input.enableDrag()
			}
			for (let i in this.player1TerrainGroup.children) {
				this.player1TerrainGroup.children[i].inputEnabled = true
				this.player1TerrainGroup.children[i].input.enableDrag()
			}
		}
		else if (this.playerTurn === 'player2') {
			for (let i in this.player2HandGroup.children) {
				this.player2HandGroup.children[i].inputEnabled = true
				this.player2HandGroup.children[i].input.enableDrag()
			}
			for (let i in this.player2TerrainGroup.children) {
				this.player2TerrainGroup.children[i].inputEnabled = true
				this.player2TerrainGroup.children[i].input.enableDrag()
			}
		}
	}

	_sacrificeInput () {
		if (this.playerTurn === 'player1') {
			for (let i in this.player1HandGroup.children)
				this.player1HandGroup.children[i].inputEnabled = false

			for (let i in this.player1TerrainGroup.children)
				this.player1TerrainGroup.children[i].input.disableDrag()
		}
		else if (this.playerTurn === 'player2') {
			for (let i in this.player2HandGroup.children)
				this.player2HandGroup.children[i].inputEnabled = false

			for (let i in this.player2TerrainGroup.children)
				this.player2TerrainGroup.children[i].input.disableDrag()
		}
	}

	_battlePhaseInput () {
		if (this.playerTurn === 'player1') {
			for (let i in this.player1HandGroup.children)
				this.player1HandGroup.children[i].inputEnabled = false

			for (let i in this.player1TerrainGroup.children)
				this.player1TerrainGroup.children[i].inputEnabled = false

			for (let i in this.player2TerrainGroup.children) {
				this.player2TerrainGroup.children[i].inputEnabled = true
				this.player2TerrainGroup.children[i].input.disableDrag()
			}
		}
		else if (this.playerTurn === 'player2') {
			for (let i in this.player2HandGroup.children)
				this.player2HandGroup.children[i].inputEnabled = false

			for (let i in this.player2TerrainGroup.children)
				this.player2TerrainGroup.children[i].inputEnabled = false

			for (let i in this.player1TerrainGroup.children) {
				this.player1TerrainGroup.children[i].inputEnabled = true
				this.player1TerrainGroup.children[i].input.disableDrag()
			}
		}
	}

	_gameLogicLoop () {
		if (this.duelState === 'DRAW_PHASE') {
			if (this.stateStatus === 'NOT_INIT')
				this._initDrawPhase()
		}
		else if (this.duelState === 'MAIN_PHASE') {
			if (this.stateStatus === 'NOT_INIT')
				this._initMainPhase()
		}
		else if (this.duelState === 'SACRIFICE') {
			if (this.stateStatus === 'NOT_INIT')
				this._initSacrifice()
		}
		else if (this.duelState === 'BATTLE_PHASE') {
			if (this.stateStatus === 'NOT_INIT')
				this._initBattlePhase()
		}
		else if (this.duelState === 'END_TURN') {
			if (this.stateStatus === 'NOT_INIT')
				this._initEndTurn ()
		}

		GameLogic.deadCard(this.player1TerrainGroup)
		GameLogic.deadCard(this.player2TerrainGroup)

		this.game.player1.checkDeadCards()
		this.game.player2.checkDeadCards()
	}

	_changePlayerTurn () {
		if (this.playerTurn === 'player1')
			this.playerTurn = 'player2'
		else
			this.playerTurn = 'player1'
	}

	_initDrawPhase () {
		if (this.playerTurn === 'player1') {
			this._initCard(this.game.player1.drawCard(), this.player1HandGroup)
			this.game.player1.setEnergy()
		}
		else if (this.playerTurn === 'player2') {
			this._initCard(this.game.player2.drawCard(), this.player2HandGroup)
			this.game.player2.setEnergy()
		}

		this._inputManager()

		this.duelState = 'MAIN_PHASE'
		this.stateStatus = 'NOT_INIT'
	}

	_initMainPhase () {
		this._inputManager()
		this.stateStatus = 'INIT'
	}

	_initSacrifice () {
		this._inputManager()
		this.stateStatus = 'INIT'
	}

	_initBattlePhase () {
		this._inputManager()
		this.stateStatus = 'INIT'
	}

	_initEndTurn () {
		this._inputManager()
		this.duelState ='DRAW_PHASE'
		this.stateStatus = 'NOT_INIT'
		this._changePlayerTurn()
	}
}

module.exports = Duel
